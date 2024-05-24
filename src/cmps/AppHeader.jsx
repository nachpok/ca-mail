import { NavLink } from 'react-router-dom'

export function AppHeader() {

    return (
        <header className="app-header">
            <section className='container'>
                <NavLink className='header-home-link' to='/' >
                    <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" ></img>
                </NavLink>
                <h1>App header</h1>
            </section>
        </header>
    )
}
