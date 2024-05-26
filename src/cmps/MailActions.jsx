import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMailUnreadOutline, IoTrashOutline } from "react-icons/io5";
import { BsExclamationOctagon } from "react-icons/bs";
import { IoArchiveOutline } from "react-icons/io5";
export function MailActions({ goBack, handleDelete, handleUnread }) {
    return (
        <div className="mail-actions">
            <div className='btn mail-details-btn' onClick={goBack}>
                <IoMdArrowRoundBack />
            </div>
            <div className='btn mail-details-btn'>
                <IoArchiveOutline />
            </div>
            <div className='btn mail-details-btn' onClick={handleDelete}>
                <BsExclamationOctagon />
            </div>
            <div className='btn mail-details-btn' onClick={handleDelete}>
                <IoTrashOutline />
            </div>
            <div className='btn mail-details-btn' onClick={handleUnread}>
                <IoMailUnreadOutline />
            </div>
        </div>
    )
}

