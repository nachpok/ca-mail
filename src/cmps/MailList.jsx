import { MailPreview } from './MailPreview.jsx'
import { MailListHeader } from './MailListHeader.jsx'
import { useParams, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export function MailList({ mails }) {

    return (
        <div className='mail-list'>
            <MailListHeader />
            {mails.map(mail => <MailPreview key={mail.id} mail={mail} />)}
            {/* <MailListFooter /> */}
        </div>
    )
}

