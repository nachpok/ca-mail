import { MailList } from "./MailList.jsx";
import { useState, useEffect, useRef } from "react";
import { mailService } from "../services/mail.service.js";
import { useLocation, Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader.jsx";
import { SideBar } from "./SideBar.jsx";
import { ComposeMailModal } from "./ComposeMailModal.jsx";

export function MailIndex() {
  const [mails, setMails] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isComposeMailOpen, setIsComposeMailOpen] = useState(false);

  const location = useLocation();
  const currentUrl = location.pathname;
  const filter = currentUrl.split("/")[1];

  const fetchMails = async () => {
    const filterBy = { status: filter, txt: searchValue };
    if (filter === "") filterBy.status = "inbox";
    await loadMails(filterBy);
  };

  useEffect(() => {
    fetchMails();
  }, [filter, searchValue]);

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

  const loadMails = async (filterBy) => {
    try {
      const mails = await mailService.query(filterBy);
      setMails(mails);
    } catch (error) {
      console.error("Having issues with loading mails:", error);
      // showUserMsg('Problem!')
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleComposeMailModal = (action) => {
    setIsComposeMailOpen(action);
  };
  const isMailDetailsRoute = currentUrl.split("/").length > 2;

  //TODO set loading wheel
  if (!mails) return <div>Loading...</div>;

  return (
    <div className="mail-index">
      <AppHeader
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        unreadCount={unreadCount}
      />
      <div className="mail-index-content">
        <SideBar handleComposeMailModal={handleComposeMailModal} />
        {isMailDetailsRoute ? (
          <Outlet context={{ reloadMails: loadMails }} />
        ) : (
          <MailList
            mails={mails}
            reloadMails={(filterBy) => loadMails(filterBy)}
          />
        )}
        {isComposeMailOpen && (
          <ComposeMailModal closeComposeMailModal={handleComposeMailModal} />
        )}
      </div>
    </div>
  );
}
