import { useState, useEffect } from "react";
import { SearchMailListPreview } from "./MailListPreview";
import { useNavigate } from "react-router-dom";

//TODO incode the search text
export function SearchDropdown({ fetchMailsByText }) {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [filteredMails, setFilteredMails] = useState([]);
    const [searchValue, setSearchValue] = useState('')
    useEffect(() => {
        async function fetchData() {
            if (searchValue.length > 2) {
                try {
                    const mails = await fetchMailsByText(searchValue);
                    setFilteredMails(mails.slice(0, 5));
                } catch (err) {
                    console.error(err);
                }
            }
        }
        fetchData();
    }, [searchValue]);

    function handleMouseDown(e) {
        e.preventDefault();
    };

    function closeDropdown() {
        setIsSearchOpen(false);
    }

    function viewAllSearchResults() {
        navigate(`/search/${searchValue}`)
        setIsSearchOpen(false);
    }

    function onClear() {
        setSearchValue('');
        setFilteredMails([]);
    }
    function handleInput(e) {
        const value = e.target.value;
        setSearchValue(value);
        if (value === '') {
            onClear();
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            viewAllSearchResults();
        }
    }
    return (
        <section className="search-dropdown">
            <div className="search-bar">
                <div className={`search-container ${isSearchOpen ? "open" : ""} ${filteredMails.length > 0 ? "list" : ''}`}>
                    <span className="search-icon">🔍</span>
                    <input
                        type="search"
                        className="search-input"
                        placeholder="Search mail"
                        onChange={handleInput}
                        onFocus={() => setIsSearchOpen(true)}
                        onBlur={() => setIsSearchOpen(false)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
            {isSearchOpen && filteredMails.length > 0 && (
                <ul className="dropdown-list" onMouseDown={handleMouseDown}>
                    {filteredMails.map((mail) => (
                        <SearchMailListPreview key={mail.id} mail={mail} searchValue={searchValue} closeDropdown={closeDropdown} />
                    ))}
                    <li className="dropdown-footer" onClick={viewAllSearchResults}>All search results for "{searchValue}"</li>
                </ul>
            )}
        </section>
    )
}