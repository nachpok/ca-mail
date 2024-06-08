import { useState, useEffect } from "react";
import { SearchMailListPreview } from "./MailListPreview";
import { useNavigate } from "react-router-dom";

//TODO incode the search text
export function SearchDropdown({ fetchMailsByText }) {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [filteredMails, setFilteredMails] = useState([]);
    const [searchValue, setSearchValue] = useState('')
    const [last7Days, setLast7Days] = useState(false);
    const [fromMe, setFromMe] = useState(false);
    const [hasAttachments, setHasAttachments] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (searchValue !== '' || hasAttachments || last7Days || fromMe) {
                try {
                    const filters = {
                        hasAttachments: hasAttachments,
                        last7Days: last7Days,
                        fromMe: fromMe
                    }
                    try {
                        const mails = await fetchMailsByText(searchValue, filters);
                        if (mails) {
                            setFilteredMails(mails.slice(0, 5));
                        }
                    } catch (e) {
                        console.error(e)
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }
        fetchData();
    }, [searchValue, hasAttachments, last7Days, fromMe]);

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
            {isSearchOpen && (
                <ul className="dropdown-list" onMouseDown={handleMouseDown}>
                    <li className="dropdown-header">
                        <button className={`dropdown-header-button ${hasAttachments ? "active" : ""}`} onClick={() => { setHasAttachments(prev => !prev) }}>Has Attachments</button>
                        <button className={`dropdown-header-button ${last7Days ? "active" : ""}`} onClick={() => { setLast7Days(prev => !prev) }}>Last 7 days</button>
                        <button className={`dropdown-header-button ${fromMe ? "active" : ""}`} onClick={() => { setFromMe(prev => !prev) }}>From me</button>
                    </li>
                    {filteredMails.map((mail) => (
                        <SearchMailListPreview key={mail.id} mail={mail} searchValue={searchValue} closeDropdown={closeDropdown} />
                    ))}
                    <li className="dropdown-footer" onClick={viewAllSearchResults}>{filteredMails.length > 0 && `All search results for "${searchValue}"`}</li>
                </ul>
            )}
        </section>
    )
}