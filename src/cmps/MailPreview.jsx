import StarCheckbox from './StarCheckbox.jsx';
import { useState, useEffect } from 'react';
import { utilService } from '../services/util.service.js';
import { Link, useParams, useLocation } from 'react-router-dom';
import { mailService } from '../services/mail.service.js';

export function MailPreview({ mail, checked, checkPreview }) {
    const location = useLocation();
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);


    const handleStar = (star) => {
        mail.isStarred = star
        mailService.updateMail(mail)
    }

    const handleChange = (e) => {
        const { checked } = e.target;
        setIsChecked(checked);
        checkPreview(mail.id, checked);
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
                <input type="checkbox" className='mail-preview-checkbox' checked={isChecked} onClick={handleClick} onChange={handleChange} />
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

