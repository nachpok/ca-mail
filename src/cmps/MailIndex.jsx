import { MailList } from './MailList.jsx';
import { useState, useEffect, useRef } from 'react';
import { mailService } from '../services/mail.service.js';
import { useLocation, Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader.jsx';
import { SideBar } from './SideBar.jsx';

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [searchValue, setSearchValue] = useState('');
    const [unreadCount, setUnreadCount] = useState(0)


    const location = useLocation()
    const currentUrl = location.pathname
    let filter = currentUrl.split('/')[1]

    useEffect(() => {
        const fetchMails = async () => {
            const filterBy = { status: filter, txt: searchValue };
            if (filter === '') filterBy.status = 'inbox';
            await loadMails(filterBy);
        };

        fetchMails();
    }, [filter, searchValue, unreadCount]);

    useEffect(() => {
        ('mails: ', mails)
        if (!mails) return
        const unreadCount = mails.filter(mail => mail.isRead === false).length
        setUnreadCount(unreadCount)
    }, [mails])

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


    const isMailDetailsRoute = currentUrl.split('/').length > 2;

    //TODO set loading wheel
    if (!mails) return <div>Loading...</div>

    return (
        <div className='mail-index'>
            <AppHeader searchValue={searchValue} handleSearchChange={handleSearchChange} unreadCount={unreadCount} />
            <div className="mail-index-content">
                <SideBar />
                {isMailDetailsRoute ? <Outlet /> : <MailList mails={mails} reloadMails={(filterBy) => loadMails(filterBy)} />}

            </div>
        </div>
    )
}

