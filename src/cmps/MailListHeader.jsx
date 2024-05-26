import { IoRefreshOutline } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { MailActions } from "./MailActions.jsx";

export function MailListHeader({ reloadMails, handleSelectAll, checkIds, handleUnread, handleDelete }) {
    const goBack = () => {
        history.back()
    }

    return (
        <div className="mail-list-header">
            <div className=".mail-details-btn-no-hover">
                <input type='checkbox' onChange={(e) => handleSelectAll(e)} />
            </div>
            {
                checkIds.length > 0 ? <MailActions goBack={goBack} handleDelete={handleDelete} handleUnread={handleUnread} /> : <>
                    <div className="mail-details-btn" onClick={reloadMails}>
                        <IoRefreshOutline />
                    </div>
                    <div className="mail-details-btn">
                        <IoMdMore />
                    </div>
                </>
            }

        </div>
    )
}

