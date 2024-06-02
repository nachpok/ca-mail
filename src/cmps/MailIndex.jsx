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
  const [searchMails, setSearchMails] = useState([])
  const [unreadCounters, setUnreadCounters] = useState({
    inbox: 0,
    starred: 0,
    trash: 0,
    allMail: 0,
  });
  const [searchValue, setSearchValue] = useState("");
  const [isComposeMailOpen, setIsComposeMailOpen] = useState(false);
  const [loadingMails, setLoadingMails] = useState(false);
  const [loadingSearchMails, setLoadingSearchMails] = useState(false)
  const location = useLocation();
  const currentUrl = location.pathname;


  useEffect(() => {
    fetchMails();
  }, [location]);

  useEffect(() => {
    fetchMailsByText()
  }, [searchValue])

  useEffect(() => {
    console.log(searchMails)
  }, [searchMails])

  async function fetchMailsByText() {

    setLoadingSearchMails(true)

    try {
      if (searchValue !== '' && searchValue.length > 2) {
        console.log("called with: ", searchValue)
        const searchMails = await mailService.queryByText(searchValue);
        setSearchMails(searchMails)
      }
    } catch (error) {
      console.error("Having issues with loading search mails:", error);
    } finally {
      setLoadingSearchMails(false)
    }
  }

  async function fetchMails() {
    setLoadingMails(true);
    const folder = currentUrl.split("/")[1];

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
  //Close compose mail modal and reload mails when sent is in view
  //TODO add all-mails
  async function onComposeMailModal(isOpen) {
    if (isOpen === false && currentUrl.includes("/sent")) {
      await fetchMails();
    }
    setIsComposeMailOpen(isOpen);
  };

  function isMailDetailsRoute() {
    return location.pathname.split("/").length > 2;
  }
  //TODO name parent conpoent calls as compoent name
  //TODO implament search in all mails, form searver, use debounce
  return (
    <section className="mail-index">
      <AppHeader
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchMails={searchMails}
      />
      <section className="content">
        <aside>
          <SideBar onComposeMailModal={onComposeMailModal} unreadCounters={unreadCounters} />
        </aside>
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
