import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function SideBar() {

    return (
        <header className="app-side-bar">
            <section className="container">
                <button className='side-bar-btn'>Compose</button>
                <nav>
                    <NavLink className={`side-bar-link `} to='/' >Inbox</NavLink>
                    <NavLink className={`side-bar-link `} to='/starred'  >Starred</NavLink>
                    <NavLink className={`side-bar-link `} to='/sent'  >Sent</NavLink>
                    <NavLink className={`side-bar-link `} to='/all-mail'  >All Mail</NavLink>
                </nav>
            </section>
        </header>
    )
}
