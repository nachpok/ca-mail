import { MailList } from "./MailList.jsx";
import { useState, useEffect, useRef } from "react";
import { mailService } from "../services/mail.service.js";
import { useLocation, Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader.jsx";
import { SideBar } from "./SideBar.jsx";
import { ComposeMailModal } from "./ComposeMailModal.jsx";
import { Loader } from "./Loader.jsx";

export function MailIndex() {

  //TODO null optional
  const [mails, setMails] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isComposeMailOpen, setIsComposeMailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const currentUrl = location.pathname;

  async function fetchMails() {
    setLoading(true);
    const folder = currentUrl.split("/")[1];

    try {
      const { mails, unreadCount } = await mailService.query(folder);
      setMails(mails);
    } catch (error) {
      console.error("Having issues with loading mails:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
  }, [location]);

  useEffect(() => {
    if (!mails) {
      setUnreadCount(0);
    } else {
      const unreadCount = mails.filter(
        (mail) =>
          mail.isRead === false && mail.to === mailService.loggedinUser.email
      ).length;
      setUnreadCount(unreadCount);
    }
  }, [mails]);


  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  //TODO all on... not handle...
  //TODO whats going on
  const onComposeMailModal = async (isOpen) => {
    if (isOpen === false && currentUrl.includes("/sent")) {
      await fetchMails();
    }
    setIsComposeMailOpen(isOpen);
  };

  //TODO as function
  const isMailDetailsRoute = currentUrl.split("/").length > 2;

  //TODO name parent conpoent calls as compoent name
  return (
    <section className="mail-index-section">
      <AppHeader
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        unreadCount={unreadCount}
      />
      <div className="mail-index-content">
        <aside>
          <SideBar onComposeMailModal={onComposeMailModal} />
        </aside>
        <main className="mail-index-main">
          {loading ? (
            <div className="loader-container">
              <Loader />
            </div>
          ) : (
            isMailDetailsRoute ? (
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
      </div>
    </section>
  );
}
