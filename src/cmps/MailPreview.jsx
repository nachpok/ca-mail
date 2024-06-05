import StarCheckbox from "./StarCheckbox.jsx";
import { useState, useEffect } from "react";
import { utilService } from "../services/util.service.js";
import { Link, useLocation } from "react-router-dom";
import { mailService } from "../services/mail.service.js";
import { useNavigate } from "react-router-dom";

export function MailPreview({ mail, checked, checkPreview, openDraftById }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const onStar = (star) => {
    mail.isStarred = star;
    mailService.updateMail(mail);
  };

  const onChange = (e) => {
    const { checked } = e.target;
    setIsChecked(checked);
    checkPreview(mail.id, checked);
  };

  const onClick = (e) => {
    e.stopPropagation();
  };

  const onPreviewClick = (e) => {
    if (mail.isDraft) {
      e.preventDefault();
      openDraftById(true, mail.id)
      navigate({
        pathname: location.pathname,
        search: `?compose=${mail.id}`
      });
    } else {
      if (mail.isRead) return;
      mail.isRead = true;
      mailService.updateMail(mail);
    }
  };

  const isSent = mail.from === mailService.loggedinUser.email;

  return (
    <Link
      onClick={(e) => onPreviewClick(e)}
      to={!mail.isDraft && `${location.pathname}/${mail.id}`}
      className={`mail-preview ${mail.isRead || isSent ? "mail-preview-read" : "mail-preview-unread"
        }`}
    >
      <aside className="mail-preview-aside">
        <div className="mail-preview-checkbox-container" onClick={e => e.preventDefault()}>
          <input
            type="checkbox"
            className="mail-preview-checkbox"
            checked={isChecked}
            onClick={onClick}
            onChange={onChange}
          />
          <StarCheckbox
            cb={onStar}
            defaultChecked={mail.isStarred}
            className="mail-preview-star-checkbox"
          />
        </div>
        <p className="mail-preview-from">{isSent ? mail.to : mail.fromName}</p>
      </aside>
      <main className="mail-preview-main">
        <h3 className="mail-preview-subject">{mail.subject}</h3>&nbsp;-&nbsp;
        <p className="mail-preview-body">{mail.body}</p>
      </main>
      <aside className="mail-preview-date-container">
        <p className="mail-preview-date">
          {utilService.formatDate(mail.sentAt)}
        </p>
      </aside>
    </Link>
  );
}
