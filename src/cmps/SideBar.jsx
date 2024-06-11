import { NavLink, useLocation } from "react-router-dom";
import { MdInbox } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { BiSend } from "react-icons/bi";
import { LuMails } from "react-icons/lu";
import { FaRegFile } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { useState } from "react";

export function SideBar({ onCompose, unreadCounters, isSideBarOpen, onSideBarToggle }) {
  const [isSideBarHover, setIsSideBarHover] = useState(false);
  const location = useLocation();
  const currentSearchParams = location.search;

  const expandedSideBar = isSideBarOpen || isSideBarHover;
  return (
    <div className="parent-container">
      <section
        className={`app-side-bar ${isSideBarOpen ? "open" : "closed"} ${isSideBarHover && "focus"}`}
        onMouseEnter={() => setIsSideBarHover(true)}
        onMouseLeave={() => setIsSideBarHover(false)}
      >
        <button
          className={`side-bar-btn ${expandedSideBar ? "open" : "closed"}`}
          onClick={onCompose}
        >
          <span className="side-bar-btn-icon">
            <MdOutlineModeEdit />
          </span>
          {expandedSideBar && "Compose"}
        </button>
        <nav>
          <SideBarLink to={`/inbox${currentSearchParams}`} icon={<MdInbox />} label="Inbox" unreadCount={unreadCounters.inbox} expandedSideBar={expandedSideBar} onSideBarToggle={onSideBarToggle} />
          <SideBarLink to={`/starred${currentSearchParams}`} icon={<FaRegStar />} label="Starred" unreadCount={unreadCounters.starred} expandedSideBar={expandedSideBar} onSideBarToggle={onSideBarToggle} />
          <SideBarLink to={`/sent${currentSearchParams}`} icon={<BiSend />} label="Sent" expandedSideBar={expandedSideBar} onSideBarToggle={onSideBarToggle} />
          <SideBarLink to={`/all-mail${currentSearchParams}`} icon={<LuMails />} label="All Mail" unreadCount={unreadCounters.allMail} expandedSideBar={expandedSideBar} onSideBarToggle={onSideBarToggle} />
          <SideBarLink to={`/drafts${currentSearchParams}`} icon={<FaRegFile />} label="Drafts" unreadCount={unreadCounters.drafts} expandedSideBar={expandedSideBar} onSideBarToggle={onSideBarToggle} />
          <SideBarLink to={`/trash${currentSearchParams}`} icon={<FaRegTrashAlt />} label="Trash" unreadCount={unreadCounters.trash} expandedSideBar={expandedSideBar} onSideBarToggle={onSideBarToggle} />
        </nav>
      </section>
      <div className={`side-bar-filler ${!isSideBarOpen && isSideBarHover && 'active'}`}></div>
    </div>
  );
}

const SideBarLink = ({ to, icon, label, unreadCount, expandedSideBar, onSideBarToggle }) => {
  const handleClick = () => {
    if (window.matchMedia("(max-width: 425px)").matches) {
      onSideBarToggle();
    }
  };

  return (
    <NavLink className={`side-bar-link`} to={to} onClick={handleClick}>
      <span className="side-bar-link-title">
        <span className="icon-wrapper">
          {icon}
          {!expandedSideBar && unreadCount > 0 && (
            <span className="notification-bubble"></span>
          )}
        </span>
        &nbsp;
        {expandedSideBar && <h3>{label}</h3>}
      </span>
      {expandedSideBar && unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
    </NavLink>
  );
};