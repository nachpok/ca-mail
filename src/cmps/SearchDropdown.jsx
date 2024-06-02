import { useState, useEffect } from "react";
import { MailListPreview } from "./MailListPreview";

export function SearchDropdown({ searchValue, onSearchChange, searchMails, viewMailBySearch }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [filteredMails, setFilteredMails] = useState([]);

    useEffect(() => {
        if (searchValue) {
            setFilteredMails(searchMails.slice(0, 5));
        } else {
            setFilteredMails([]);
        }
    }, [searchValue, searchMails]);

    function handleMouseDown(e) {
        e.preventDefault();
    };

    function closeDropdown() {
        setIsSearchOpen(false);
    }

    function viewAllSearchResults() {
        viewMailBySearch()
        setIsSearchOpen(false);
    }
    return (
        <section className="search-dropdown">
            <div className="search-bar">
                <div className={`search-container ${isSearchOpen ? "open" : ""} ${filteredMails.length > 0 ? "list" : ''}`}>
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
            {isSearchOpen && filteredMails.length > 0 && (
                <ul className="dropdown-list" onMouseDown={handleMouseDown}>
                    {filteredMails.map((mail, index) => (
                        <MailListPreview key={mail.id} mail={mail} closeDropdown={closeDropdown} />
                    ))}
                    <li className="dropdown-footer" onClick={viewAllSearchResults}>All search results for "{searchValue}"</li>
                </ul>
            )}
        </section>
    )
}