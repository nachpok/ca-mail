import { IoRefreshOutline } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { MailActions } from "./MailActions.jsx";
import { useLocation, useNavigate } from 'react-router-dom';

export function MailListHeader({ reloadMails, onSelectAll, checkIds, onUnread, onDelete, onArchived }) {
    const location = useLocation();
    const navigate = useNavigate();

    const goBack = () => {
        const targetPath = `/${location.pathname.split('/')[1]}`;
        navigate(targetPath);
    }

    return (
        <section className="mail-list-header">
            <div className=".mail-details-btn-no-hover">
                <input type='checkbox' onChange={(e) => onSelectAll(e)} />
            </div>
            {
                checkIds.length > 0 ?
                    <MailActions goBack={goBack} onDelete={onDelete} onUnread={onUnread} onArchived={onArchived} />
                    : <>
                        <div className="mail-details-btn" onClick={reloadMails}>
                            <IoRefreshOutline />
                        </div>
                        {/* <div className="mail-details-btn">
                        <IoMdMore />
                    </div> */}
                    </>
            }

        </section>
    )
}

