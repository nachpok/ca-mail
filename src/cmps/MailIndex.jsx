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
  //TODO replace with redirect
  const location = useLocation();
  const currentUrl = location.pathname;
  console.log(location)

  //TODO replace status to folder
  async function fetchMails() {
    setLoading(true);
    const folder = currentUrl.split("/")[1];
    const filterBy = { folder: folder, txt: searchValue };
    //TODO repalce with redirect
    if (folder === "") filterBy.folder = "inbox";
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
  //TODO all on... not handle...
  //TODO whats gooing on
  const handleComposeMailModal = async (isOpen) => {
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
        handleSearchChange={handleSearchChange}
        unreadCount={unreadCount}
      />
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
