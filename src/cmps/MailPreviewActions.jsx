import { IoMailUnreadOutline, IoTrashOutline } from "react-icons/io5";
import { IoArchiveOutline } from "react-icons/io5";
export function MailPreviewActions({ onUpdateSelectedMails, checkId }) {

    function onPreviewAction(e, action) {
        e.stopPropagation();
        e.preventDefault();
        onUpdateSelectedMails(action, checkId)
    }
    return (
        <div className="mail-preview-actions">
            <div className='btn mail-preview-actions-btn' onClick={(e) => onPreviewAction(e, "archive")}>
                <IoArchiveOutline />
            </div>
            <div className='btn mail-preview-actions-btn' onClick={(e) => onPreviewAction(e, "delete")}>
                <IoTrashOutline />
            </div>
            <div className='btn mail-preview-actions-btn' onClick={(e) => onPreviewAction(e, "unread")}>
                <IoMailUnreadOutline />
            </div>
        </div>
    )
}


