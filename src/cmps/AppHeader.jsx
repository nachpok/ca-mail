import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react';

export function AppHeader({ searchValue, handleSearchChange, unreadCount }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    let message = 'You have no unread mails'
    if (unreadCount === 1) message = 'You have 1 unread mail'
    if (unreadCount > 1) message = `You have ${unreadCount} unread mails`
    return (
        <header className="app-header">
            <section className='container'>
                <NavLink className='header-home-link' to='/' >
                    <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" ></img>
                </NavLink>
                <div className='header-search-bar'>
                    <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder='Search mail'
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={() => setIsSearchOpen(true)}
                            onBlur={() => setIsSearchOpen(false)}
                        />
                        {/* <span className="filter-icon">⚙️</span> */}
                    </div>
                </div>
                {unreadCount !== 0 && <div className='app-header-unread-count'>
                    {message}
                </div>}
            </section>
        </header>
    )
}
