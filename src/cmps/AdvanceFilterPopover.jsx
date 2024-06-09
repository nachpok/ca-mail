import { useRef } from 'react';
export default function AdvanceFilterPopover({ onFormBlur, submitSearchFrom }) {
    //TODO get list of sent from and sent to, use for autocomplete
    const fromRef = useRef(null);
    const toRef = useRef(null);
    const subjectRef = useRef(null);
    const hasWordsRef = useRef(null);
    const doesntHaveRef = useRef(null);
    const dateWithinSelectRef = useRef(null);
    const dateWithinInputRef = useRef(null);
    const searchRef = useRef(null);

    function clearFilter(e) {
        e.preventDefault();
        fromRef.current.value = '';
        toRef.current.value = '';
        subjectRef.current.value = '';
        hasWordsRef.current.value = '';
        doesntHaveRef.current.value = '';
        dateWithinSelectRef.current.value = '';
        dateWithinInputRef.current.value = '';
        searchRef.current.value = '';
    }

    function searchFilter(e) {
        e.preventDefault();
        const filters = {
            from: fromRef.current.value,
            to: toRef.current.value,
            subject: subjectRef.current.value,
            hasWords: hasWordsRef.current.value,
            doesntHave: doesntHaveRef.current.value,
            dateWithinSelect: dateWithinSelectRef.current.value,
            dateWithinInput: dateWithinInputRef.current.value,
            search: searchRef.current.value,
        };
        submitSearchFrom(filters);
    }


    return (
        <form className="advance-filter-popover">
            <div className="advance-filter-popover-input-container">
                <span className="advance-filter-popover-input-label">From</span>
                <input type="text" className="advance-filter-popover-input" ref={fromRef} />
            </div>
            <div className="advance-filter-popover-input-container">
                <span className="advance-filter-popover-input-label">To</span>
                <input type="text" className="advance-filter-popover-input" ref={toRef} />
            </div>
            <div className="advance-filter-popover-input-container">
                <span className="advance-filter-popover-input-label">Subject</span>
                <input type="text" className="advance-filter-popover-input" ref={subjectRef} />
            </div>
            <div className="advance-filter-popover-input-container">
                <span className="advance-filter-popover-input-label">Has the words</span>
                <input type="text" className="advance-filter-popover-input" ref={hasWordsRef} />
            </div>
            <div className="advance-filter-popover-input-container">
                <span className="advance-filter-popover-input-label">Doesn't have</span>
                <input type="text" className="advance-filter-popover-input" ref={doesntHaveRef} />
            </div>
            <div className="advance-filter-popover-input-container">
                <span className="advance-filter-popover-input-label">Date within</span>
                <select className="advance-filter-popover-select" ref={dateWithinSelectRef}>
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">1 week</option>
                    <option value="14">2 weeks</option>
                    <option value="30">1 month</option>
                    <option value="60">2 months</option>
                    <option value="180">6 months</option>
                    <option value="365">1 year</option>
                </select>
                <input type="date" className="advance-filter-popover-date" ref={dateWithinInputRef} />
            </div>
            <div className="advance-filter-popover-input-container">
                <span className="advance-filter-popover-input-label">Search</span>
                <select className="advance-filter-popover-select" ref={searchRef}>
                    <option value="all-mail">All mail</option>
                    <option value="inbox">Inbox</option>
                    <option value="starred">Starred</option>
                    <option value="sent">Sent</option>
                    <option value="drafts">Drafts</option>
                    <option value="trash">Trash</option>
                </select>
            </div>
            <div className="advance-filter-popover-button-container">
                <button className="advance-filter-popover-btn clear-btn" onClick={(e) => clearFilter(e)}>
                    Clear filter
                </button>
                <button className="advance-filter-popover-btn search-btn" onClick={(e) => searchFilter(e)}>
                    Search
                </button>
            </div>
        </form>
    )
}

