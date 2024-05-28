import { MailList } from "./MailList.jsx";
import { useState, useEffect, useRef } from "react";
import { mailService } from "../services/mail.service.js";
import { useLocation, Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader.jsx";
import { SideBar } from "./SideBar.jsx";
import { ComposeMailModal } from "./ComposeMailModal.jsx";
import { Loader } from "./Loader.jsx";

export function MailIndex() {
  const [mails, setMails] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isComposeMailOpen, setIsComposeMailOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const currentUrl = location.pathname;

  const fetchMails = async () => {
    setLoading(true);
    const filter = currentUrl.split("/")[1];
    const filterBy = { status: filter, txt: searchValue };
    if (filter === "") filterBy.status = "inbox";
    try {
      const mails = await mailService.query(filterBy);
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


  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleComposeMailModal = async (isOpen) => {
    if (isOpen === false && currentUrl.includes("/sent")) {
      await fetchMails();
    }
    setIsComposeMailOpen(isOpen);
  };

  const isMailDetailsRoute = currentUrl.split("/").length > 2;

  return (
    <section className="mail-index-section">
      <header>
        <AppHeader
          searchValue={searchValue}
          handleSearchChange={handleSearchChange}
          unreadCount={unreadCount}
        />
      </header>
      <div className="mail-index-content">
        <aside>
          <SideBar handleComposeMailModal={handleComposeMailModal} />
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
            <ComposeMailModal closeComposeMailModal={handleComposeMailModal} />
          )}
        </main>
      </div>
    </section>
  );
}
