import { MailList } from './MailList.jsx';
import { useState, useEffect, useRef } from 'react';
import { mailService } from '../services/mail.service.js';
import { useLocation } from 'react-router-dom'
import { AppHeader } from './AppHeader.jsx';
import { SideBar } from './SideBar.jsx';

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [searchValue, setSearchValue] = useState('');
    const location = useLocation()
    const currentUrl = location.pathname
    let filter = currentUrl.split('/')[1]

    useEffect(() => {
        const filterBy = { status: filter, txt: searchValue }
        if (filter === '') filterBy.status = 'inbox'
        loadMails(filterBy)
    }, [filter, searchValue])

    async function loadMails(filterBy) {
        try {
            const mails = await mailService.query(filterBy)
            setMails(mails)
        } catch (error) {
            console.error('Having issues with loading mails:', error)
            // showUserMsg('Problem!')
        }
    }

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };
    //TODO set loading wheel
    if (!mails) return <div>Loading...</div>

    return (
        <div className='mail-index'>
            <AppHeader searchValue={searchValue} handleSearchChange={handleSearchChange} />
            <div className="mail-index-content">
                <SideBar />
                <MailList mails={mails} />
            </div>
        </div>
    )
}

