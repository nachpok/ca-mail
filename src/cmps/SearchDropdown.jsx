import { useState, useEffect } from "react";
import { SearchMailListPreview } from "./MailListPreview";
import { useNavigate } from "react-router-dom";
import { mailService } from "../services/mail.service";
import AdvanceFilterPopover from "./AdvanceFilterPopover";
import { IoMdOptions } from "react-icons/io";

export function SearchDropdown({ fetchMailsByText, fetchMailsByAdvancedSearch }) {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchedMails, setSearchedMails] = useState([]);
    const [filterTags, setFilterTags] = useState({});
    const [searchValue, setSearchValue] = useState('')
    const [isAdvanceFilterPopoverOpen, setIsAdvanceFilterPopoverOpen] = useState(false);

    useEffect(() => {
        async function getMailsOnSearch() {
            if (searchValue !== '' || Object.values(filterTags).some(Boolean)) {
                try {
                    let mails = []
                    if (searchValue !== "" && !isFilterTagSelected()) {
                        mails = await fetchMailsByText(searchValue, 5);
                    } else {
                        const filters = {}

                        if (searchValue !== "") {
                        }
                        if (filterTags.hasAttachments) {
                            filters.attach_or_drive = filterTags.hasAttachments;
                        }
                        if (filterTags.last7Days) {
                            filters.datestart = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                            filters.daterangetype = "custom_range";
                        }
                        if (filterTags.fromMe) {
                            filters.from = mailService.loggedinUser.email;
                        }

                        mails = await fetchMailsByAdvancedSearch(searchValue, filters, 5);
                    }
                    if (mails) {
                        setSearchedMails(mails);
                    }
                } catch (e) {
                    console.error(`SearchDropdown.fetchData.Error fetching mails: ${e}`)
                }
            }
        }

        getMailsOnSearch();
    }, [searchValue, filterTags]);

    function handleMouseDown(e) {
        e.preventDefault();
        //the mail preview does not open without this
        //TODO figure out the issue and better name the method
    };

    function onCloseDropdown() {
        setIsSearchOpen(false);
    }

    function onViewAllSearchResults() {
        if (searchValue !== "" && !isFilterTagSelected()) {
            navigate(`/search/${searchValue}`)
        } else if (isFilterTagSelected()) {
            const paramsObj = {
                isrefinement: true
            }
            if (searchValue !== "") {
                paramsObj.query = searchValue;
            }
            if (filterTags.hasAttachments) {
                paramsObj.attach_or_drive = filterTags.hasAttachments;
            }
            if (filterTags.last7Days) {
                paramsObj.datestart = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                paramsObj.daterangetype = "custom_range";
            }
            if (filterTags.fromMe) {
                paramsObj.from = mailService.loggedinUser.email;
                paramsObj.fromdisplay = mailService.loggedinUser.fullname;
            }
            const advancedSearchParams = new URLSearchParams(paramsObj).toString();
            navigate(`/advanced-search/${advancedSearchParams}`);
        }
        setIsSearchOpen(false);
    }

    function onClearSearch() {
        setSearchValue('');
        setSearchedMails([]);
        setIsSearchOpen(false);
    }

    function onSearchInputChange(e) {
        const value = e.target.value;
        setSearchValue(value);
        if (value === '') {
            onClearSearch();
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && (searchValue !== "" || isFilterTagSelected())) {
            e.preventDefault();
            onViewAllSearchResults();
        }
    }

    function onFilterTagClick(e) {
        const name = e.target.name;
        setFilterTags(prev => {
            const newFilterButtons = { ...prev };
            newFilterButtons[name] = !newFilterButtons[name];
            return newFilterButtons;
        });
    }

    function isFilterTagSelected() {
        return filterTags.hasAttachments || filterTags.last7Days || filterTags.fromMe;
    }

    function showSearchDropdown() {
        setIsSearchOpen(true);
        setIsAdvanceFilterPopoverOpen(false);
    }

    function showAdvanceFilterPopover() {
        setIsSearchOpen(false);
        setIsAdvanceFilterPopoverOpen(true);
    }

    function closeSearch() {
        setIsSearchOpen(false);
        setIsAdvanceFilterPopoverOpen(false);
    }

    function onAdvanceFilterPopoverSubmit(filters) {
        closeSearch()

        const paramsObj = {
            isrefinement: true,
            ...filters
        };

        const advancedSearchParams = new URLSearchParams(paramsObj).toString();
        navigate(`/advanced-search/${advancedSearchParams}`);
    }

    const searchFooterText = formatSearchFooterText(searchValue, filterTags);

    return (
        <section className="search-dropdown">
            <div className="search-bar">
                <div className={`search-container ${isSearchOpen && "open"} ${searchedMails.length > 0 && "list"}`}>
                    <span className="search-icon" onClick={onViewAllSearchResults}>🔍</span>
                    <input
                        type="search"
                        className="search-input"
                        placeholder="Search mail"
                        onChange={onSearchInputChange}
                        onFocus={showSearchDropdown}
                        onBlur={closeSearch}
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
                        <button className={`${filterTags.hasAttachments && "active"}`} name="hasAttachments" onClick={onFilterTagClick}>Has Attachments</button>
                        <button className={`${filterTags.last7Days && "active"}`} name="last7Days" onClick={onFilterTagClick}>Last 7 days</button>
                        <button className={`${filterTags.fromMe && "active"}`} name="fromMe" onClick={onFilterTagClick}>From me</button>
                    </li>
                    {searchedMails.map((mail) => (
                        <SearchMailListPreview key={mail.id} mail={mail} searchValue={searchValue} handleCloseDropdown={onCloseDropdown} />
                    ))}
                    {searchedMails.length > 0 &&
                        <li className="dropdown-footer" onClick={onViewAllSearchResults}>
                            <span>{searchFooterText !== "" && searchFooterText}</span>
                            <span>Press ENTER</span>
                        </li>}
                </ul>
            )}
            {isAdvanceFilterPopoverOpen &&
                <article style={{ position: 'relative' }}>
                    <AdvanceFilterPopover onClose={closeSearch} onSubmit={onAdvanceFilterPopoverSubmit} />
                </article>
            }
        </section>
    )
}

function formatSearchFooterText(searchValue, filterButtons) {
    const numOfSelectedFilters = Number(!!filterButtons.hasAttachments + !!filterButtons.last7Days + !!filterButtons.fromMe);
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
    return searchFotterText;
}

