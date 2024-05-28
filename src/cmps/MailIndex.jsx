import { MailList } from "./MailList.jsx";
import { useState, useEffect } from "react";
import { mailService } from "../services/mail.service.js";
import { useLocation, Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader.jsx";
import { SideBar } from "./SideBar.jsx";
import { ComposeMailModal } from "./ComposeMailModal.jsx";
import { Loader } from "./Loader.jsx";

export function MailIndex() {

  //TODO null optional
  const [mails, setMails] = useState([]);
  const [unreadCounters, setUnreadCounters] = useState({
    inbox: 0,
    starred: 0,
    trash: 0,
    allMail: 0,
  });
  const [searchValue, setSearchValue] = useState("");
  const [isComposeMailOpen, setIsComposeMailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const currentUrl = location.pathname;

  async function fetchMails() {
    setLoading(true);
    const folder = currentUrl.split("/")[1];

    try {
      const { mails, unreadCounters } = await mailService.query(folder);
      console.log("MailIndex.unreadCount: ", unreadCounters)
      setMails(mails);
      setUnreadCounters(unreadCounters);
    } catch (error) {
      console.error("Having issues with loading mails:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
  }, [location]);

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  //Close compose mail modal and reload mails when sent is in view
  const onComposeMailModal = async (isOpen) => {
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
      />
      <section className="content">
        <aside>
          <SideBar onComposeMailModal={onComposeMailModal} unreadCounters={unreadCounters} />
        </aside>
        <main className="main">
          {loading ? (
            <Loader />
          ) : (
            isMailDetailsRoute() ? (
              <Outlet context={{ reloadMails: fetchMails }} />
            ) : (
              <MailList
                mails={mails}
                reloadMails={fetchMails}
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
