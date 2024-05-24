import { MailList } from './MailList.jsx';
import { useState, useEffect } from 'react';
import { mailService } from '../services/mail.service.js';
import { useLocation } from 'react-router-dom'

export function MailIndex() {

    const [mails, setMails] = useState(null)



    const location = useLocation()
    const currentUrl = location.pathname
    let filter = currentUrl.split('/')[1]
    useEffect(() => {
        filter === '' && (filter = 'inbox')
        loadMails({ status: filter })
    }, [filter])

    async function loadMails(filterBy) {
        try {
            const mails = await mailService.query(filterBy)
            setMails(mails)
        } catch (error) {
            console.error('Having issues with loading mails:', error)
            // showUserMsg('Problem!')
        }
    }


    //TODO set loading wheel
    if (!mails) return <div>Loading...</div>

    return (
        <div className='mail-index'>
            <MailList mails={mails} />
        </div>
    )
}

