import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMailUnreadOutline, IoTrashOutline } from "react-icons/io5";
import { BsExclamationOctagon } from "react-icons/bs";
import { IoArchiveOutline } from "react-icons/io5";
export function MailActions({ goBack, onDelete, onUnread, onArchived }) {
    return (
        <div className="mail-actions">
            <div className='btn mail-details-btn' onClick={goBack}>
                <IoMdArrowRoundBack />
            </div>
            <div className='btn mail-details-btn' onClick={onArchived}>
                <IoArchiveOutline />
            </div>
            <div className='btn mail-details-btn' onClick={onDelete}>
                <BsExclamationOctagon />
            </div>
            <div className='btn mail-details-btn' onClick={onDelete}>
                <IoTrashOutline />
            </div>
            <div className='btn mail-details-btn' onClick={onUnread}>
                <IoMailUnreadOutline />
            </div>
        </div>
    )
}

