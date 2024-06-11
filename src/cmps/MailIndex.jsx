import { MailList } from "./MailList.jsx";
import { useState, useEffect } from "react";
import { mailService } from "../services/mail.service.js";
import { useLocation, Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader.jsx";
import { SideBar } from "./SideBar.jsx";
import { ComposeMailModal } from "./ComposeMailModal.jsx";
import { Loader } from "./Loader.jsx";
import { useNavigate } from "react-router-dom";
import { showSuccessMsg } from "../services/event-bus.service";

export function MailIndex() {
  const navigate = useNavigate();
  const [mails, setMails] = useState([]);
  const [unreadCounters, setUnreadCounters] = useState({
    inbox: 0,
    starred: 0,
    trash: 0,
    allMail: 0,
  });

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isComposeMailOpen, setIsComposeMailOpen] = useState(false);
  const [isLoadingMails, setLoadingMails] = useState(false);
  const location = useLocation();
  const currentUrl = location.pathname;
  //TODO move to hook file, add cleanup in the case that the location changes
  useEffect(() => {
    fetchMails();
  }, [location.pathname]);

  async function onUpdateSelectedMails(action, ids) {
    let selectedMails = mails.filter((mail) => ids.includes(mail.id));

    let updateNotificationText = "";
    let onUndoAction = () => { }

    switch (action) {
      case 'delete':
        selectedMails = selectedMails.filter((mail) => mail.removedAt === null);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, removedAt: new Date() });
        }
        updateNotificationText = selectedMails.length > 1 ? `${selectedMails.length} Conversations moved to Trash.` : "Conversation moved to Trash."
        onUndoAction = async () => {
          for (const mail of selectedMails) {
            await mailService.updateMail({ ...mail, removedAt: null });
          }
        }
        break;

      case 'restore':
        selectedMails = selectedMails.filter((mail) => mail.removedAt !== null);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, removedAt: null });
        }
        updateNotificationText = selectedMails.length > 1 ? `${selectedMails.length} Conversations restored.` : "Conversation restored."
        break;

      case 'read':
        selectedMails = selectedMails.filter((mail) => mail.isRead === false);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isRead: true });
        }
        updateNotificationText = selectedMails.length > 1 ? `${selectedMails.length} Conversations marked as read.` : "Conversation marked as read."
        onUndoAction = async () => {
          for (const mail of selectedMails) {
            await mailService.updateMail({ ...mail, isRead: false });
          }
        }
        break;

      case 'unread':
        selectedMails = selectedMails.filter((mail) => mail.isRead === true);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isRead: false });
        }
        updateNotificationText = selectedMails.length > 1 ? `${selectedMails.length} Conversations marked as unread.` : "Conversation marked as unread."
        onUndoAction = async () => {
          for (const mail of selectedMails) {
            await mailService.updateMail({ ...mail, isRead: true });
          }
        }
        break;

      case 'archive':
        selectedMails = selectedMails.filter((mail) => mail.isArchived === false);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isArchived: true });
        }
        updateNotificationText = selectedMails.length > 1 ? `${selectedMails.length} Conversations archived.` : "Conversation archived."
        onUndoAction = async () => {
          for (const mail of selectedMails) {
            await mailService.updateMail({ ...mail, isArchived: false });
          }
        }
        break;

      case 'unarchive':
        selectedMails = selectedMails.filter((mail) => mail.isArchived === true);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isArchived: false });
        }
        updateNotificationText = selectedMails.length > 1 ? `${selectedMails.length} Conversations unarchived.` : "Conversation unarchived."
        break;

      case 'star':
        selectedMails = selectedMails.filter((mail) => mail.isStarred === false);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isStarred: true });
        }
        break;

      case 'unstar':
        selectedMails = selectedMails.filter((mail) => mail.isStarred === true);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isStarred: false });
        }
        break;

      default:
        throw new Error('Invalid action type');
    }

    const undoAndRefresh = async () => {
      //Notice, undo needs to be async 
      await onUndoAction()
      await fetchMails()
    }

    if (selectedMails.length > 0) {
      showSuccessMsg(updateNotificationText, undoAndRefresh);
    }

    if (isMailDetailsRoute()) {
      if (action === "star" || action === "unstar") {
        return;
      }

      //Go Back and refresh
      setLoadingMails(true);
      const pathSegments = location.pathname.split("/");
      const lastSegment = pathSegments[pathSegments.length - 1];

      if (lastSegment.startsWith("MUIxx")) {
        pathSegments.pop();
      }

      const folder = pathSegments.join("/");

      navigate(folder);
    } else if (selectedMails.length > 0) {
      await fetchMails();
    }

  }

  async function onDraftEdite(updatedMail) {
    if (location.pathname.includes("drafts")) {
      const existingMail = mails.find(mail => mail.id === updatedMail.id);

      if (existingMail) {
        if (updatedMail.isDraft && updatedMail.removedAt) {
          await mailService.remove(updatedMail.id);
          setMails(prevMails =>
            prevMails.filter(mail => mail.id !== updatedMail.id)
          );
        } else {
          setMails(prevMails =>
            prevMails.map(mail => (mail.id === updatedMail.id ? updatedMail : mail))
          );
        }
      } else {
        setMails(prevMails => [...prevMails, updatedMail]);
      }
    }
  }

  function onComposeNewDraft() {
    navigate(location.pathname + "?compose=new");
    setIsComposeMailOpen(true);
  }

  function onSideBarToggle() {
    setIsSideBarOpen(prevIsSideBarOpen => !prevIsSideBarOpen);
  }

  async function fetchMailsByText(text, limit = 0) {
    try {
      if (text !== '') {
        const searchMails = await mailService.queryByText(text, limit);
        return searchMails;
      }
    } catch (error) {
      console.error("Having issues with loading search mails:", error);
    }
  }

  async function fetchMailsByAdvancedSearch(text, filters, limit = 0) {
    try {
      const searchMails = await mailService.queryByAdvancedSearch(text, filters, limit);
      return searchMails;
    } catch (error) {
      console.error("Having issues with loading search mails:", error);
    }
  }

  async function fetchMails() {
    setLoadingMails(true);
    const folder = currentUrl.split("/")[1];

    if (folder === "advanced-search") {
      if (isMailDetailsRoute()) {
        try {
          const segments = currentUrl.split("/");
          const mailId = segments[segments.length - 1];
          const mail = await mailService.getById(mailId);
          setMails([mail]);
          setLoadingMails(false);
        } catch (error) {
          console.error("Having issues with loading search mails:", error);
        }
        return;
      }

      const filters = decodeURIComponent(currentUrl.split("/")[2]).split("&")
      const filtersMap = filters.reduce((acc, filter) => {
        const [key, value] = filter.split("=");
        acc[key] = value;
        return acc;
      }, {});

      const mails = await fetchMailsByAdvancedSearch(filtersMap.query || "", filtersMap);
      setMails(mails);
      setLoadingMails(false);
      return;
    }

    if (folder === 'search') {
      try {
        const segments = currentUrl.split("/");
        const lastSegment = segments[segments.length - 1];
        if (lastSegment.startsWith("MUIxx-")) {
          const mail = await mailService.getById(lastSegment);
          setMails([mail]);
        } else {
          const mails = await fetchMailsByText(lastSegment);
          setMails(mails);
        }
        setLoadingMails(false);
      } catch (error) {
        console.error("Having issues with loading mails:", error);
      }
      return;
    }

    try {
      const { mails, unreadCounters } = await mailService.query(folder);
      setMails(mails);
      setUnreadCounters(unreadCounters);
    } catch (error) {
      console.error("Having issues with loading mails:", error);
    } finally {
      setLoadingMails(false);
    }
  }

  async function handleComposeMailModal(isShow) {
    if (!isShow && isNewMailInView()) {
      await fetchMails();
    }

    if (!isShow) {
      navigate({ pathname: location.pathname, search: '' });
    }

    setIsComposeMailOpen(isShow);
  };

  function isMailDetailsRoute() {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment.startsWith("MUIxx-");
  }

  function isNewMailInView() {
    return location.pathname.includes("drafts") || location.pathname.includes("sent") || location.pathname.includes("all-mails")
  }

  const isResponsiveOverlay = isSideBarOpen || isComposeMailOpen
  return (
    <section className={`mail-index ${isSideBarOpen ? "side-bar-open" : ""}`}>
      <AppHeader
        fetchMailsByText={fetchMailsByText}
        fetchMailsByAdvancedSearch={fetchMailsByAdvancedSearch}
        onSideBarToggle={onSideBarToggle}
      />
      <section className="content">
        <SideBar onCompose={onComposeNewDraft} unreadCounters={unreadCounters} isSideBarOpen={isSideBarOpen} onSideBarToggle={onSideBarToggle} />
        <main className="main">
          {isLoadingMails ? (
            <Loader />
          ) : (
            isMailDetailsRoute() ? (
              <Outlet context={{ onUpdateSelectedMails }} />
            ) : (
              <MailList
                mails={mails}
                reloadMails={fetchMails}
                onUpdateSelectedMails={onUpdateSelectedMails}
                onOpenDraft={handleComposeMailModal}
              />
            )
          )}
          {isComposeMailOpen && (
            <ComposeMailModal onCloseCompose={handleComposeMailModal} onEditDraft={onDraftEdite} />
          )}
          <article className="responsive-componse-btn">
            {!isComposeMailOpen && !isSideBarOpen && <button onClick={() => handleComposeMailModal(true)}>Compose</button>}
          </article>
        </main>
      </section>
      {isResponsiveOverlay && <div className="overlay" ></div>}
    </section>
  );
}
