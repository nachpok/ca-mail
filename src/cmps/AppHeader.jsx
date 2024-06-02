import { useState } from "react";
import { HomeButton } from "./HomeButton";
export function AppHeader({ searchValue, onSearchChange }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="app-header">
      <section className="container">
        <HomeButton />
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
