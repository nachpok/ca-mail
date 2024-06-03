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
    console.log(folder)
    //avoid refetching when back from detals to list of searched 
    if (folder === "search") {
      console.log(currentUrl.split("/"))
      const mailId = currentUrl.split("/")[3];

      setMails([mail]);
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
  };

  function onSearchChange(e) {
    setSearchValue(e.target.value);
  };

  async function onUpdateSelectedMails(action, ids) {
    let selectedMails = mails.filter((mail) => ids.includes(mail.id));

    switch (action) {
      case 'delete':
        selectedMails = selectedMails.filter((mail) => mail.removedAt === null);
        for (let mail of selectedMails) {
          //TODO desturcure 
          mail.removedAt = new Date();
          await mailService.updateMail(mail);
        }
        break;

      case 'unread':
        selectedMails = selectedMails.filter((mail) => mail.isRead === true);
        for (let mail of selectedMails) {
          mail.isRead = false;
          await mailService.updateMail(mail);
        }
        break;

      case 'archive':
        selectedMails = selectedMails.filter((mail) => mail.isArchived === false);
        for (let mail of selectedMails) {
          mail.isArchived = true;
          await mailService.updateMail(mail);
        }
        break;

      case 'star':
        selectedMails = selectedMails.filter((mail) => mail.isStarred === false);
        for (let mail of selectedMails) {
          mail.isStarred = true;
          await mailService.updateMail(mail);
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
    return location.pathname.split("/").length > 2;
  }


  //TODO repalce search with current folder
  function viewMailBySearch(mails) {
    navigate(`/search`)
    setLoadingMails(false)
    setMails(mails)
  }

  return (
    <section className="mail-index">
      <AppHeader
        viewMailBySearch={viewMailBySearch}
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
