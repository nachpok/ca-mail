
export default function AdvanceFilterPopover() {
    return (
        <div className="advance-filter-popover">
            <div>
                <span>From</span><input type="text" placeholder="Search" />
            </div>
            <div>
                <span>To</span><input type="text" placeholder="Search" />
            </div>
            <div>
                <span>Subject</span><input type="text" placeholder="Search" />
            </div>
            <div>
                <span>Has the words</span><input type="text" placeholder="Search" />
            </div>
            <div>
                <span>Doesn't have</span><input type="text" placeholder="Search" />
            </div>
            <div>
                <span>Date within</span>
                <select>
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">1 week</option>
                    <option value="14">2 weeks</option>
                    <option value="30">1 month</option>
                    <option value="60">2 months</option>
                    <option value="180">6 months</option>
                    <option value="365">1 year</option>
                </select>
                <input type="date" placeholder="Search" />
            </div>
            <div>
                <span>Search</span>
                <select>
                    <option value="all-mail">All mail</option>
                    <option value="inbox">Inbox</option>
                    <option value="starred">Starred</option>
                    <option value="sent">Sent</option>
                    <option value="drafts">Drafts</option>
                    <option value="trash">Trash</option>
                </select>
            </div>
            <button>
                Clear
            </button>
            <button>
                Search
            </button>
        </div>
    )
}

