import { Link, NavLink } from "react-router-dom";

export function SideBar({ onComposeMailModal }) {
  return (
    <header className="app-side-bar">
      <section className="container">
        <button
          className="side-bar-btn"
          onClick={() => onComposeMailModal(true)}
        >
          Compose
        </button>
        <nav>
          <NavLink className={`side-bar-link `} to="/">
            Inbox
          </NavLink>
          <NavLink className={`side-bar-link `} to="/starred">
            Starred
          </NavLink>
          <NavLink className={`side-bar-link `} to="/sent">
            Sent
          </NavLink>
          <NavLink className={`side-bar-link `} to="/all-mail">
            All Mail
          </NavLink>
          <NavLink className={`side-bar-link `} to="/trash">
            Trash
          </NavLink>
        </nav>
      </section>
    </header>
  );
}
