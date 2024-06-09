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
  //TODO move to params
  const [isComposeMailOpen, setIsComposeMailOpen] = useState(false);
  //TODO array fo objects with subject to body and id
  //getEmptyMail returns empty obj with temp id 
  const [loadingMails, setLoadingMails] = useState(false);
  const location = useLocation();
  const currentUrl = location.pathname;

  //TODO move to hook file, add cleanup in the case that the location changes
  useEffect(() => {
    fetchMails();
  }, [location.pathname]);


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
    //avoid refetching when back from detals to list of searched 
    if (folder === "search") {
      if (currentUrl.split("/").length > 3) {
        const mailId = currentUrl.split("/")[3];
        try {
          const mail = await mailService.getById(mailId);
          setMails([mail]);
          setLoadingMails(false);
        } catch (error) {
          console.error("Having issues with loading search mails:", error);
        }
        return;
      } else {
        const searchByText = currentUrl.split("/")[2];
        const searchMails = await fetchMailsByText(searchByText);
        setMails(searchMails);
        setLoadingMails(false);
      }
      return;
    }

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

  async function onUpdateSelectedMails(action, ids) {
    let selectedMails = mails.filter((mail) => ids.includes(mail.id));
    let text = "";
    let undo = () => { }
    switch (action) {
      case 'delete':
        selectedMails = selectedMails.filter((mail) => mail.removedAt === null);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, removedAt: new Date() });
        }
        text = selectedMails.length > 1 ? `${selectedMails.length} Conversations moved to Trash.` : "Conversation moved to Trash."
        undo = async () => {
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
        text = selectedMails.length > 1 ? `${selectedMails.length} Conversations restored.` : "Conversation restored."
        break;

      case 'read':
        selectedMails = selectedMails.filter((mail) => mail.isRead === false);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isRead: true });
        }
        text = selectedMails.length > 1 ? `${selectedMails.length} Conversations marked as read.` : "Conversation marked as read."
        undo = async () => {
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
        text = selectedMails.length > 1 ? `${selectedMails.length} Conversations marked as unread.` : "Conversation marked as unread."
        undo = async () => {
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
        text = selectedMails.length > 1 ? `${selectedMails.length} Conversations archived.` : "Conversation archived."
        undo = async () => {
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
        text = selectedMails.length > 1 ? `${selectedMails.length} Conversations unarchived.` : "Conversation unarchived."
        break;

      case 'star':
        selectedMails = selectedMails.filter((mail) => mail.isStarred === false);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isStarred: true });
        }
        break;



      default:
        throw new Error('Invalid action type');
    }
    const undeAndRefresh = async () => {
      //Notice, undo needs to be async 
      await undo()
      await fetchMails()
    }
    if (selectedMails.length > 0) {
      showSuccessMsg(text, undeAndRefresh);
    }

    if (isMailDetailsRoute()) {
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

  async function onComposeMailModal(isOpen, mailId) {
    // refresh if creating new mail when sent Mails are in view
    if (!isOpen && (currentUrl.includes("/sent") || currentUrl.includes("/all-mails"))) {
      await fetchMails();

    }
    if (isOpen && !mailId) {
      navigate(location.pathname + "?compose=new");
    } else if (isOpen && mailId) {
      navigate(`${location.pathname}/${mailId}`);
    } else {
      navigate({ pathname: location.pathname, search: '' });
    }

    setIsComposeMailOpen(isOpen);
  };

  async function refeshDrafsOnComposeEdit(updatedMail) {
    if (location.pathname.includes("drafts")) {
      if (mails.find(mail => mail.id === updatedMail.id)) {
        if (updatedMail.isDraft && updatedMail.removedAt) {
          await mailService.remove(updatedMail.id)
          setMails((prevMails) =>
            prevMails.filter((mail) => mail.id !== updatedMail.id)
          )
        } else {
          setMails((prevMails) =>
            prevMails.map((mail) => (mail.id === updatedMail.id ? updatedMail : mail))
          );
        }
      } else {
        setMails((prevMails) => [...prevMails, updatedMail]);
      }
    }
  }

  function onComposeClick() {
    navigate(location.pathname + "?compose=new");
    setIsComposeMailOpen(true);
  }

  function isMailDetailsRoute() {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment.startsWith("MUIxx-");
  }

  return (
    <section className="mail-index">
      <AppHeader
        fetchMailsByText={fetchMailsByText}
        fetchMailsByAdvancedSearch={fetchMailsByAdvancedSearch}
      />
      <section className="content">
        <SideBar onComposeClick={onComposeClick} unreadCounters={unreadCounters} />
        <main className="main">
          {loadingMails ? (
            <Loader />
          ) : (
            isMailDetailsRoute() ? (
              <Outlet context={{ onUpdateSelectedMails }} />
            ) : (
              <MailList
                mails={mails}
                reloadMails={fetchMails}
                onUpdateSelectedMails={onUpdateSelectedMails}
                openDraftById={onComposeMailModal}
              />
            )
          )}
          {isComposeMailOpen && (
            <ComposeMailModal closeComposeMailModal={onComposeMailModal} refeshDrafsOnComposeEdit={refeshDrafsOnComposeEdit} />
          )}
        </main>
      </section>
    </section>
  );
}
