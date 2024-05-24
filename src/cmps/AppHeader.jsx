import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react';

export function AppHeader({ searchValue, handleSearchChange }) {

    return (
        <header className="app-header">
            <section className='container'>
                <NavLink className='header-home-link' to='/' >
                    <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" ></img>
                </NavLink>
                <div className='header-search-bar'>
                    <input
                        type="text"
                        placeholder='Search'
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                </div>
            </section>
        </header>
    )
}
