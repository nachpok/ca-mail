import { NavLink } from "react-router-dom";
import { useState } from "react";

export function AppHeader({ searchValue, onSearchChange }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="app-header">
      <section className="container">
        <NavLink className="header-home-link" to="/">
          <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png"></img>
        </NavLink>
        <div className="header-search-bar">
          <div className={`search-container ${isSearchOpen ? "open" : ""}`}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search mail"
              value={searchValue}
              onChange={onSearchChange}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        </div>
      </section>
    </header>
  );
}
