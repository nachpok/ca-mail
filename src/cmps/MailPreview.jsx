import StarCheckbox from "./StarCheckbox.jsx";
import { useState, useEffect } from "react";
import { utilService } from "../services/util.service.js";
import { Link, useLocation } from "react-router-dom";
import { mailService } from "../services/mail.service.js";
import { useNavigate } from "react-router-dom";
import { MailPreviewActions } from "./MailPreviewActions.jsx";
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';
import { useWindowSize } from "../hooks/useWindowSize.js";

export function MailPreview({ mail, checked, onCheckPreview, onOpenDraft, onUpdateSelectedMails, sidebarWidth }) {
  const [isHover, setIsHover] = useState(false);
  const { width } = useWindowSize();
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
    onCheckPreview(mail.id, checked);
  };

  const onClick = (e) => {
    e.stopPropagation();
  };

  const onPreviewClick = (e) => {
    if (mail.isDraft) {
      e.preventDefault();
      onOpenDraft(true)
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
      className={`mail-preview ${mail.isRead ? "mail-preview-read" : "mail-preview-unread"} `}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      // I have a css bug that i was not able to figur out, the width of the mail-preview is not correct 
      // when the sidebar is closed and doing the calc in the css file is not working as expected
      style={width > 425 ? { width: `calc(100% - ${sidebarWidth}px)` } : {}}
    >
      {/* <section className="responsive-container"> */}
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
        <p className="mail-preview-from-responsive">{isSent ? mail.to : mail.fromName}</p>
        <h3 className="mail-preview-subject">{mail.subject}</h3><span className="mail-preview-hyphen">&nbsp;-&nbsp;</span>
        <div className="mail-preview-body">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {mail.body}
          </ReactMarkdown>
        </div>
      </main>
      {/* </section> */}
      <aside className="mail-preview-date-container">
        {isHover ? <MailPreviewActions onUpdateSelectedMails={onUpdateSelectedMails} checkId={[mail.id]} isRead={mail.isRead} /> : (
          <p className="mail-preview-date">
            {utilService.formatDate(mail.sentAt)}
          </p>
        )}
      </aside>
      <aside className="responsive-date-start">
        <p className="mail-preview-date">
          {utilService.formatDate(mail.sentAt)}
        </p>
        <StarCheckbox
          cb={onStar}
          defaultChecked={mail.isStarred}
          className="mail-preview-star-checkbox"
        />
      </aside>
    </Link>
  );
}
