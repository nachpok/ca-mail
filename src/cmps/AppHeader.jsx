import { HomeButton } from "./HomeButton";
import { SearchDropdown } from "./SearchDropdown";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

export function AppHeader({ fetchMailsByText, fetchMailsByAdvancedSearch, onSideBarToggle }) {
  const [isMenuBtnFocus, setIsMenuBtnFocus] = useState(false);
  const [isMouseOverMenu, setIsMouseOverMenu] = useState(false);

  const isMenuBtnActive = isMenuBtnFocus || isMouseOverMenu;
  return (
    <header className="app-header">
      <button
        className={`menu-btn ${isMenuBtnActive && "focus"}`}
        onClick={onSideBarToggle}
        onFocus={() => setIsMenuBtnFocus(true)}
        onBlur={() => setIsMenuBtnFocus(false)}
        onMouseEnter={() => setIsMouseOverMenu(true)}
        onMouseLeave={() => setIsMouseOverMenu(false)}
      >
        <IoMenu />
      </button>
      <HomeButton />
      <SearchDropdown fetchMailsByText={fetchMailsByText} fetchMailsByAdvancedSearch={fetchMailsByAdvancedSearch} />
    </header>
  );
}
