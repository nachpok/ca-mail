import { useState } from 'react';

export default function AdvanceFilterPopover({ onClose, onSubmit }) {
    //TODO get list of sent from and sent to, use for autocomplete
    const [filters, setFilters] = useState({});

    function onChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    function clearFilter(e) {
        e.preventDefault();
        const emptyFilters = Object.fromEntries(Object.entries(filters).map(([key]) => [key, '']));
        setFilters(emptyFilters);
    }

    function searchFilter(e) {
        e.preventDefault();
        onSubmit(filters);
    }

    return (
        <form className="advanced-filter-popover" onSubmit={searchFilter}>
            <div className="input-field">
                <label className="input-label">From</label>
                <input type="text" className="popover-input" name="from" value={filters.from} onChange={onChange} />
            </div>
            <div className="input-field">
                <label className="input-label">To</label>
                <input type="text" className="popover-input" name="to" value={filters.to} onChange={onChange} />
            </div>
            <div className="input-field">
                <label className="input-label">Subject</label>
                <input type="text" className="popover-input" name="subject" value={filters.subject} onChange={onChange} />
            </div>
            <div className="input-field">
                <label className="input-label">Has the words</label>
                <input type="text" className="popover-input" name="hasWords" value={filters.hasWords} onChange={onChange} />
            </div>
            <div className="input-field">
                <label className="input-label">Doesn't have</label>
                <input type="text" className="popover-input" name="doesntHave" value={filters.doesntHave} onChange={onChange} />
            </div>
            <div className="input-field">
                <label className="input-label">Date within</label>
                <select className="popover-select" name="dateWithinSelect" value={filters.dateWithinSelect} onChange={onChange}>
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">1 week</option>
                    <option value="14">2 weeks</option>
                    <option value="30">1 month</option>
                    <option value="60">2 months</option>
                    <option value="180">6 months</option>
                    <option value="365">1 year</option>
                </select>
                <input type="date" className="popover-date" name="dateWithinInput" value={filters.dateWithinInput} onChange={onChange} />
            </div>
            <div className="input-field">
                <label className="input-label">Search</label>
                <select className="popover-select" name="search" value={filters.search} onChange={onChange}>
                    <option value="all-mail">All mail</option>
                    <option value="inbox">Inbox</option>
                    <option value="starred">Starred</option>
                    <option value="sent">Sent</option>
                    <option value="drafts">Drafts</option>
                    <option value="trash">Trash</option>
                </select>
            </div>
            <div className="button-container">
                <button className="btn" onClick={onClose}>
                    Close
                </button>
                <button className="btn" onClick={(e) => clearFilter(e)}>
                    Clear filter
                </button>
                <button className="btn search-btn" onClick={(e) => searchFilter(e)}>
                    Search
                </button>
            </div>
        </form>
    )
}

