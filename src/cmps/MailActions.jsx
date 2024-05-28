import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMailUnreadOutline, IoTrashOutline } from "react-icons/io5";
import { BsExclamationOctagon } from "react-icons/bs";
import { IoArchiveOutline } from "react-icons/io5";
export function MailActions({ goBack, onUpdateSelectedMails, checkIds }) {
    return (
        <div className="mail-actions">
            <div className='btn mail-details-btn' onClick={goBack}>
                <IoMdArrowRoundBack />
            </div>
            <div className='btn mail-details-btn' onClick={() => onUpdateSelectedMails("archive", checkIds)}>
                <IoArchiveOutline />
            </div>
            <div className='btn mail-details-btn' onClick={() => onUpdateSelectedMails("delete", checkIds)}>
                <BsExclamationOctagon />
            </div>
            <div className='btn mail-details-btn' onClick={() => onUpdateSelectedMails("delete", checkIds)}>
                <IoTrashOutline />
            </div>
            <div className='btn mail-details-btn' onClick={() => onUpdateSelectedMails("unread", checkIds)}>
                <IoMailUnreadOutline />
            </div>
        </div>
    )
}

