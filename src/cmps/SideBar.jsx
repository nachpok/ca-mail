import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function SideBar({ handleComposeMailModal }) {

    return (
        <header className="app-side-bar">
            <section className="container">
                <button className='side-bar-btn' onClick={() => handleComposeMailModal(true)}>Compose</button>
                <nav>
                    <NavLink className={`side-bar-link `} to='/' >Inbox</NavLink>
                    <NavLink className={`side-bar-link `} to='/starred'  >Starred</NavLink>
                    <NavLink className={`side-bar-link `} to='/sent'  >Sent</NavLink>
                    <NavLink className={`side-bar-link `} to='/all-mail'  >All Mail</NavLink>
                    <NavLink className={`side-bar-link `} to='/trash'  >Trash</NavLink>
                </nav>
            </section>
        </header>
    )
}
