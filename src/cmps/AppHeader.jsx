import { HomeButton } from "./HomeButton";
import { SearchDropdown } from "./SearchDropdown";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdHelpCircleOutline } from "react-icons/io";

export function AppHeader({ fetchMailsByText, fetchMailsByAdvancedSearch, onSideBarToggle }) {
  const [isMenuBtnFocus, setIsMenuBtnFocus] = useState(false);
  const [isMouseOverMenu, setIsMouseOverMenu] = useState(false);
  const { folder } = useParams();
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
      <SearchDropdown fetchMailsByText={fetchMailsByText} fetchMailsByAdvancedSearch={fetchMailsByAdvancedSearch} onSideBarToggle={onSideBarToggle} />
      <Link to={`/${folder}?compose=new&to=help@gmail.com&subject=Help`} className="help-btn">
        <IoMdHelpCircleOutline size={24} />
      </Link>
    </header>
  );
}
