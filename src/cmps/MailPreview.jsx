import StarCheckbox from './StarCheckbox.jsx';
import { useState } from 'react';
import { utilService } from '../services/util.service.js';
import { Link, useParams, useLocation } from 'react-router-dom';
import { mailService } from '../services/mail.service.js';

export function MailPreview({ mail }) {
    const [isStarred, setIsStarred] = useState(false);
    const location = useLocation();

    const handleStar = (star) => {
        console.log('handleStar:', star);
        mail.isStarred = star
        mailService.updateMail(mail)
        setIsStarred(star);
    }
    const handleClick = (e) => {
        e.stopPropagation();
    }

    const handleOpenMail = () => {
        if (mail.isRead) return;
        mail.isRead = true;
        mailService.updateMail(mail);
    }
    let pathname = location.pathname.split('/')[1]
    if (pathname === '') pathname = 'inbox'

    //TODO style body text
    return (
        <Link onClick={handleOpenMail} to={`/${pathname}/${mail.id}`} className={`mail-preview ${mail.isRead ? 'mail-preview-read' : 'mail-preview-unread'}`}>
            <div className='mail-preview-left'>
                <input type="checkbox" className='mail-preview-checkbox ' onClick={handleClick} />
                <StarCheckbox cb={handleStar} defaultChecked={mail.isStarred} className='mail-preview-star-checkbox' />
                <p className='mail-preview-from'>{mail.fromName}</p>
            </div>
            <div className='mail-preview-center'>
                <h3 className='mail-preview-subject'>{mail.subject}</h3>&nbsp;-&nbsp;
                <p className='mail-preview-body'>{mail.body}</p>
            </div>
            <div className='mail-preview-right'>
                <p className='mail-preview-date'>{utilService.formatDate(mail.sentAt)}</p>
            </div>
        </Link >
    )
}

