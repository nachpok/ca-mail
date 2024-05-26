import { MailPreview } from './MailPreview.jsx'
import { MailListHeader } from './MailListHeader.jsx'
import { useState, useEffect } from 'react';
import { mailService } from '../services/mail.service.js';
import { useLocation } from 'react-router-dom';

export function MailList({ mails, reloadMails }) {
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [checkIds, setCheckIds] = useState([]);

    const handleSelectAll = (e) => {
        const { checked } = e.target;
        setIsCheckAll(checked);
        if (checked) {
            setCheckIds(mails.map(mail => mail.id));
        } else {
            setCheckIds([]);
        }
    }


    useEffect(() => {
        console.log('reloadMails')
        reloadMails()
    }, [])

    const checkPreview = (id, checked) => {
        if (checked) {
            setCheckIds(prev => [...prev, id]);
        } else {
            setCheckIds(prev => prev.filter(prevId => prevId !== id));

        }
    }

    const handleDeleteSelected = async () => {
        let selectedMails = mails.filter(mail => checkIds.includes(mail.id))
        selectedMails.filter(mail => mail.removedAt !== null)
        for (let mail of selectedMails) {
            mail.removedAt = new Date();
            await mailService.updateMail(mail)
        }
        reloadMails();
    }
    const handleUnreadSelected = async () => {
        let selectedMails = mails.filter(mail => checkIds.includes(mail.id))
        selectedMails = selectedMails.filter(mail => mail.isRead === true)
        for (let mail of selectedMails) {
            mail.isRead = false
            await mailService.updateMail(mail)
        }
        reloadMails()
    }

    return (
        <div className='mail-list'>
            <MailListHeader reloadMails={reloadMails} handleSelectAll={handleSelectAll} checkIds={checkIds} handleUnread={handleUnreadSelected} handleDelete={handleDeleteSelected} />
            {mails.map(mail => (
                <MailPreview
                    key={mail.id}
                    mail={mail}
                    checked={checkIds.includes(mail.id)}
                    checkPreview={checkPreview}
                />
            ))}

        </div>
    )
}

