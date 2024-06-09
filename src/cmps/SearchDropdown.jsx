import { useState, useEffect } from "react";
import { SearchMailListPreview } from "./MailListPreview";
import { useNavigate } from "react-router-dom";

//TODO incode the search text
//TODO on advance search put filters in the url, for example last 7 days and text 'abc':
//https://mail.google.com/mail/u/1/#advanced-search/from=nachpok%40gmail.com&attach_or_drive=true&query=abc&isrefinement=true&fromdisplay=nachliel+pokroy&datestart=2024-06-03&daterangetype=custom_range
export function SearchDropdown({ fetchMailsByText, fetchMailsByAdvancedSearch }) {
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
                        let mails = []
                        if (searchValue !== "" && !filterSelected()) {
                            mails = await fetchMailsByText(searchValue);
                        } else {
                            mails = await fetchMailsByAdvancedSearch(searchValue, filters);
                        }
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
        if (searchValue !== "" && !filterSelected()) {
            navigate(`/search/${searchValue}`)
        } else if (filterSelected()) {
            navigate(`/advanced-search/${searchValue}`)
        }
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
        if (e.key === 'Enter' && (searchValue !== "" || filterSelected())) {
            e.preventDefault();
            viewAllSearchResults();
        }
    }

    function filterSelected() {
        return hasAttachments || last7Days || fromMe;
    }
    const numOfSelectedFilters = Number(!!hasAttachments + !!last7Days + !!fromMe);
    let searchFotterText = ""
    if (searchValue !== "" && numOfSelectedFilters > 0) {
        searchFotterText += `All search results for "${searchValue}" +${numOfSelectedFilters} filter`;
        numOfSelectedFilters > 1 && (searchFotterText += `s`);
    } else if (searchValue !== "" && numOfSelectedFilters === 0) {
        searchFotterText += `All search results for "${searchValue}"`
    } else if (searchValue === "" && numOfSelectedFilters !== 0) {
        searchFotterText += `All search results for ${numOfSelectedFilters} filter`
        numOfSelectedFilters > 1 && (searchFotterText += `s`);
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
                    <li className="dropdown-footer" onClick={viewAllSearchResults}>{searchFotterText !== "" && searchFotterText}</li>
                </ul>
            )}
        </section>
    )
}