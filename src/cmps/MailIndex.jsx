import { MailList } from "./MailList.jsx";
import { useState, useEffect } from "react";
import { mailService } from "../services/mail.service.js";
import { useLocation, Outlet, useAsyncError } from "react-router-dom";
import { AppHeader } from "./AppHeader.jsx";
import { SideBar } from "./SideBar.jsx";
import { ComposeMailModal } from "./ComposeMailModal.jsx";
import { Loader } from "./Loader.jsx";
import { useNavigate } from "react-router-dom";

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


  useEffect(() => {
    fetchMails();
  }, [location]);


  async function fetchMailsByText(text) {
    try {
      if (text !== '' && text.length > 2) {
        const searchMails = await mailService.queryByText(text);
        return searchMails;
      }
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

    switch (action) {
      case 'delete':
        selectedMails = selectedMails.filter((mail) => mail.removedAt === null);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, removedAt: new Date() });
        }
        break;

      case 'unread':
        selectedMails = selectedMails.filter((mail) => mail.isRead === true);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isRead: false });
        }
        break;

      case 'archive':
        selectedMails = selectedMails.filter((mail) => mail.isArchived === false);
        for (const mail of selectedMails) {
          await mailService.updateMail({ ...mail, isArchived: true });
        }
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

    if (isMailDetailsRoute()) {
      setLoadingMails(true);
      const folder = location.pathname.split("/")[1];
      navigate('/' + folder);
    } else {
      await fetchMails();
    }
  }

  async function onComposeMailModal(isOpen) {
    // refresh if creating new mail when sent Mails are in view
    if (!isOpen && (currentUrl.includes("/sent") || currentUrl.includes("/all-mails"))) {
      await fetchMails();
    }
    setIsComposeMailOpen(isOpen);
  };

  function isMailDetailsRoute() {
    const pathSegments = location.pathname.split("/");
    const folder = pathSegments[1];
    if (folder === "search") {
      return pathSegments.length > 3;
    }
    return pathSegments.length > 2;
  }

  return (
    <section className="mail-index">
      <AppHeader
        fetchMailsByText={fetchMailsByText}
      />
      <section className="content">
        <SideBar onComposeMailModal={onComposeMailModal} unreadCounters={unreadCounters} />
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
              />
            )
          )}
          {isComposeMailOpen && (
            <ComposeMailModal closeComposeMailModal={onComposeMailModal} />
          )}
        </main>
      </section>
    </section>
  );
}
