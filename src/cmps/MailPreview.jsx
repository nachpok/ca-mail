import StarCheckbox from './StarCheckbox.jsx';
import { useState } from 'react';
import { utilService } from '../services/util.service.js';
import { Link, useParams, useLocation } from 'react-router-dom';

export function MailPreview({ mail }) {
    const [isStarred, setIsStarred] = useState(false);
    const location = useLocation();

    const handleStar = (star) => {
        setIsStarred(star);
    }

    let pathname = location.pathname.split('/')[1]
    if (pathname === '') pathname = 'inbox'

    //TODO style body text
    return (
        <Link to={`/${pathname}/${mail.id}`} className={`mail-preview ${mail.isRead ? 'mail-preview-read' : 'mail-preview-unread'}`}>
            <div className='mail-preview-left'>
                <input type="checkbox" className='mail-preview-checkbox' />
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
        </Link>
    )
}

