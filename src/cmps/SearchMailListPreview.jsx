
import { utilService } from "../services/util.service.js";
import { useNavigate } from "react-router-dom";
import { mailService } from "../services/mail.service.js";

export function SearchMailListPreview({ mail, searchValue, handleCloseDropdown }) {
    const navigate = useNavigate();

    const onOpenMail = () => {
        navigate(`/search/${searchValue}/${mail.id}`);
        handleCloseDropdown();
    };

    const isSent = mail.from === mailService.loggedinUser.email;

    return (
        <section
            onClick={onOpenMail}
            className={`mail-list-preview ${mail.isRead || isSent ? "read" : "unread"}`}
            key={mail.id}
        >
            <main className="main">
                <h3 className="subject">{mail.subject}</h3>
                <p className="recipients">
                    <span >{mail.fromName ? mail.fromName : mail.from}</span>, &nbsp;<span>{mail.toName ? mail.toName : mail.to}</span>
                </p>
            </main>
            <aside className="date-container">
                <p className="date">
                    {utilService.formatDate(mail.sentAt)}
                </p>
            </aside>
        </section>
    );
}
