import StarCheckbox from './StarCheckbox.jsx';
import { useState } from 'react';

export function MailPreview({ mail }) {
    const [isStarred, setIsStarred] = useState(false);
    const handleStar = (star) => {
        setIsStarred(star);
    }

    return (
        <div className="mail-preview">
            <input type="checkbox" />
            <StarCheckbox cb={handleStar} />

            <h3>{mail.subject}</h3>
            <p>{mail.body}</p>
        </div>
    )
}

