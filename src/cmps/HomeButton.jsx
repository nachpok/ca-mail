import { NavLink } from "react-router-dom";

export function HomeButton() {
    return (
        <NavLink className="header-home-link" to="/">
            <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" alt="Home" />
        </NavLink>
    );
}