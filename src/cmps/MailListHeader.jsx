import { IoRefreshOutline } from "react-icons/io5";
import { MailActions } from "./MailActions.jsx";

export function MailListHeader({ reloadMails, onSelectAll, checkIds, onUpdateSelectedMails }) {

    return (
        <section className="mail-list-header">
            <div className="select-all">
                <input type='checkbox' onChange={(e) => onSelectAll(e)} />
            </div>
            {
                checkIds.length > 0 ?
                    <MailActions onUpdateSelectedMails={onUpdateSelectedMails} checkIds={checkIds} />
                    : <>
                        <div className="mail-actions-btn" onClick={reloadMails}>
                            <IoRefreshOutline />
                        </div>
                    </>
            }
        </section>
    )
}

