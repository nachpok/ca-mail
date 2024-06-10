import { HomeButton } from "./HomeButton";
import { SearchDropdown } from "./SearchDropdown";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

export function AppHeader({ fetchMailsByText, fetchMailsByAdvancedSearch, onSideBarToggle }) {
  const [isMenuBtnFocus, setIsMenuBtnFocus] = useState(false);
  return (
    <header className="app-header">
      <button
        className={`menu-btn ${isMenuBtnFocus && "focus"}`}
        onClick={onSideBarToggle}
        onFocus={() => setIsMenuBtnFocus(true)}
        onBlur={() => setIsMenuBtnFocus(false)}
      >
        <IoMenu />
      </button>
      <HomeButton />
      <SearchDropdown fetchMailsByText={fetchMailsByText} fetchMailsByAdvancedSearch={fetchMailsByAdvancedSearch} />
    </header>
  );
}
