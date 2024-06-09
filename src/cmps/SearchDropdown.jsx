import { useState, useEffect } from "react";
import { SearchMailListPreview } from "./MailListPreview";
import { useNavigate } from "react-router-dom";
import { mailService } from "../services/mail.service";
import AdvanceFilterPopover from "./AdvanceFilterPopover";
import { IoMdOptions } from "react-icons/io";

//TODO incode the search text
//TODO on advance search put filters in the url, for example last 7 days and text 'abc':
//https://mail.google.com/mail/u/1/#advanced-search/from=nachpok%40gmail.com&attach_or_drive=true&query=abc&isrefinement=true&fromdisplay=nachliel+pokroy&datestart=2024-06-03&daterangetype=custom_range
//https://mail.google.com/mail/u/1/#advanced-search?query=so&hasAttachments=false&last7Days=true&fromMe=false
export function SearchDropdown({ fetchMailsByText, fetchMailsByAdvancedSearch }) {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [filteredMails, setFilteredMails] = useState([]);
    const [searchValue, setSearchValue] = useState('')
    const [last7Days, setLast7Days] = useState(false);
    const [fromMe, setFromMe] = useState(false);
    const [hasAttachments, setHasAttachments] = useState(false);
    const [isAdvanceFilterPopoverOpen, setIsAdvanceFilterPopoverOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (searchValue !== '' || hasAttachments || last7Days || fromMe) {
                try {
                    let mails = []
                    if (searchValue !== "" && !isFilterShortcutSelected()) {
                        mails = await fetchMailsByText(searchValue, 5);
                    } else {
                        const filters = {}

                        if (searchValue !== "") {
                        }
                        if (hasAttachments) {
                            filters.attach_or_drive = hasAttachments;
                        }
                        if (last7Days) {
                            filters.datestart = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                            filters.daterangetype = "custom_range";
                        }
                        if (fromMe) {
                            filters.from = mailService.loggedinUser.email;
                        }

                        mails = await fetchMailsByAdvancedSearch(searchValue, filters, 5);
                    }
                    if (mails) {
                        setFilteredMails(mails);
                    }
                } catch (e) {
                    console.error(`SearchDropdown.fetchData.Error fetching mails: ${e}`)
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
        if (searchValue !== "" && !isFilterShortcutSelected()) {
            navigate(`/search/${searchValue}`)
        } else if (isFilterShortcutSelected()) {
            const paramsObj = {
                isrefinement: true
            }
            if (searchValue !== "") {
                paramsObj.query = searchValue;
            }
            if (hasAttachments) {
                paramsObj.attach_or_drive = hasAttachments;
            }
            if (last7Days) {
                paramsObj.datestart = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                paramsObj.daterangetype = "custom_range";
            }
            if (fromMe) {
                paramsObj.from = mailService.loggedinUser.email;
                paramsObj.fromdisplay = mailService.loggedinUser.fullname;
            }
            const advancedSearchParams = new URLSearchParams(paramsObj).toString();
            navigate(`/advanced-search/${advancedSearchParams}`);
        }
        setIsSearchOpen(false);
    }

    function onClear() {
        setSearchValue('');
        setFilteredMails([]);
        setIsSearchOpen(false);
    }

    function handleInput(e) {
        const value = e.target.value;
        setSearchValue(value);
        if (value === '') {
            onClear();
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && (searchValue !== "" || isFilterShortcutSelected())) {
            e.preventDefault();
            viewAllSearchResults();
        }
    }

    function isFilterShortcutSelected() {
        return hasAttachments || last7Days || fromMe;
    }

    function showSearchDropdown() {
        setIsSearchOpen(true);
        setIsAdvanceFilterPopoverOpen(false);
    }

    function onSearchBlur() {
        setIsSearchOpen(false);
        setIsAdvanceFilterPopoverOpen(false);
    }

    function showAdvanceFilterPopover() {
        setIsAdvanceFilterPopoverOpen(true);
        setIsSearchOpen(false);
    }

    function onAdvanceFilterPopoverBlur() {
        setIsAdvanceFilterPopoverOpen(false);
        setIsSearchOpen(false);
    }

    function onAdvanceFilterPopoverSubmit(filters) {
        setIsAdvanceFilterPopoverOpen(false);
        setIsSearchOpen(false);

        const paramsObj = {
            isrefinement: true,
            ...filters
        };

        const advancedSearchParams = new URLSearchParams(paramsObj).toString();
        navigate(`/advanced-search/${advancedSearchParams}`);
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
                        onFocus={showSearchDropdown}
                        onBlur={onSearchBlur}
                        onKeyDown={handleKeyDown}
                    />
                    <span onClick={showAdvanceFilterPopover} className='advance-filter-icon'>
                        <IoMdOptions />
                    </span>
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
                    {filteredMails.length > 0 && <li className="dropdown-footer" onClick={viewAllSearchResults}>
                        <span className="dropdown-footer-summary">{searchFotterText !== "" && searchFotterText}</span>
                        <span className="dropdown-footer-press-enter">Press ENTER</span>
                    </li>}
                </ul>
            )}
            {isAdvanceFilterPopoverOpen && <article style={{ position: 'relative' }}>
                <AdvanceFilterPopover onFormBlur={onAdvanceFilterPopoverBlur} submitSearchFrom={onAdvanceFilterPopoverSubmit} />
            </article>}
        </section>
    )
}