import { NavLink } from "react-router-dom";

export function SideBar({ onComposeClick, unreadCounters }) {

  return (
    <header className="app-side-bar">
      <section className="container">
        <button
          className="side-bar-btn"
          onClick={onComposeClick}
        >
          Compose
        </button>
        <nav>
          <NavLink className={`side-bar-link `} to="/inbox">
            <h3>Inbox</h3>
            {unreadCounters.inbox > 0 && <span className="unread-count">{unreadCounters.inbox}</span>}
          </NavLink>
          <NavLink className={`side-bar-link `} to="/starred">
            <h3>Starred</h3>
            {unreadCounters.starred > 0 && <span className="unread-count">{unreadCounters.starred}</span>}
          </NavLink>
          <NavLink className={`side-bar-link `} to="/sent">
            <h3>Sent</h3>
          </NavLink>
          <NavLink className={`side-bar-link `} to="/all-mail">
            <h3>All Mail</h3>
            {unreadCounters.allMail > 0 && <span className="unread-count">{unreadCounters.allMail}</span>}
          </NavLink>
          <NavLink className={`side-bar-link `} to="/drafts">
            <h3>Drafts</h3>
          </NavLink>
          <NavLink className={`side-bar-link `} to="/trash">
            <h3>Trash</h3>
            {unreadCounters.trash > 0 && <span className="unread-count">{unreadCounters.trash}</span>}
          </NavLink>
        </nav>
      </section>
    </header>
  );
}
