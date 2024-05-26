import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { mailService } from '../services/mail.service.js'

import StarCheckbox from './StarCheckbox.jsx';
import { IoReturnUpBack } from "react-icons/io5";
import { MailActions } from './MailActions.jsx';
import { useOutletContext } from 'react-router-dom';

export function MailDetails() {
    const [mail, setMail] = useState(null)
    const { reloadMails } = useOutletContext();
    const params = useParams()
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        loadMail()
    }, [params.mailId])

    async function loadMail() {
        const mail = await mailService.getById(params.mailId)
        setMail(mail)
    }
    const handleStar = (star) => {
        mail.isStarred = star
        mailService.updateMail(mail)
    }

    const handleUnread = async () => {
        mail.isRead = false
        await mailService.updateMail(mail)
        const targetPath = `/${location.pathname.split('/')[1]}`;
        console.log('targetPath: ', targetPath)
        await reloadMails()
        navigate(targetPath);
    }

    const handleDelete = async () => {
        mail.removedAt = new Date();
        await mailService.updateMail(mail)
        const targetPath = `/${location.pathname.split('/')[1]}`;
        console.log('targetPath: ', targetPath)
        await reloadMails()
        navigate(targetPath);
    }

    const goBack = () => {
        const targetPath = `/${location.pathname.split('/')[1]}`;
        console.log('targetPath: ', targetPath)
        navigate(targetPath);
    }

    if (!mail) return <div>Loading...</div>


    //TODO show full body
    return (
        <div className="mail-details-outlet">
            <MailActions goBack={goBack} handleDelete={handleDelete} handleUnread={handleUnread} />
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
