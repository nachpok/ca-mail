import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { mailService } from '../services/mail.service.js'
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMailUnreadOutline, IoTrashOutline } from "react-icons/io5";
import { BsExclamationOctagon } from "react-icons/bs";
import { IoArchiveOutline } from "react-icons/io5";
import StarCheckbox from './StarCheckbox.jsx';
import { IoReturnUpBack } from "react-icons/io5";

export function MailDetails() {
    const [mail, setMail] = useState(null)
    const params = useParams()
    console.log(params)
    useEffect(() => {
        loadMail()
    }, [params.mailId])

    async function loadMail() {
        const mail = await mailService.getById(params.mailId)
        setMail(mail)
    }
    function handleStar() {
        // mailService.toggleStar(mail._id)
        // setMail(prevMail => ({ ...prevMail, isStarred: !prevMail.isStarred }))
    }
    if (!mail) return <div>Loading...</div>
    return (
        <div className="mail-details-outlet">
            <div className="mail-details-header">
                <div className='btn mail-details-btn'>
                    <IoMdArrowRoundBack />
                </div>
                <div className='btn mail-details-btn'>
                    <IoArchiveOutline />
                </div>
                <div className='btn mail-details-btn'>
                    <BsExclamationOctagon />
                </div>
                <div className='btn mail-details-btn'>
                    <IoTrashOutline />
                </div>
                <div className='btn mail-details-btn'>
                    <IoMailUnreadOutline />
                </div>
            </div>
            <div className="mail-details-header">
                <h1>{mail.subject}</h1>
            </div>
            <div className="mail-details-meta">
                <div className='mail-details-meta-sub'>
                    <p className="mail-details-meta-item">{mail.fromName} &lt;{mail.from}&gt;</p>

                </div>
                <div className='mail-details-meta-sub'>
                    <p className="mail-details-meta-item">{parseDate(mail.sentAt)}</p>
                    <StarCheckbox cb={handleStar} defaultChecked={mail.isStarred} className='mail-preview-star-checkbox mail-details-meta-item' />
                    <div className='btn mail-details-btn'> <IoReturnUpBack /></div>
                </div>
            </div>
            <div className="mail-details-body">
                <p>{mail.body}</p>
            </div>

        </div>
    )
}
function parseDate(date) {
    return new Date(date).toLocaleDateString()
}
