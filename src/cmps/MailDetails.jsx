import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { mailService } from "../services/mail.service.js";
import { Loader } from "./Loader.jsx";
import StarCheckbox from "./StarCheckbox.jsx";
import { IoReturnUpBack } from "react-icons/io5";
import { MailActions } from "./MailActions.jsx";
import { useOutletContext } from "react-router-dom";

export function MailDetails() {
  const [mail, setMail] = useState(null);
  const { reloadMails } = useOutletContext();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadMail();
  }, [params.mailId]);

  async function loadMail() {
    const mail = await mailService.getById(params.mailId);
    setMail(mail);
  }
  const onStar = (star) => {
    mail.isStarred = star;
    mailService.updateMail(mail);
  };

  const onUnread = async () => {
    mail.isRead = false;
    await mailService.updateMail(mail);
    await reloadMails();
    const targetPath = `/${location.pathname.split("/")[1]}`;
    console.log("targetPath: ", targetPath);
    navigate(targetPath);
  };

  const onDelete = async () => {
    mail.removedAt = new Date();
    await mailService.updateMail(mail);
    const targetPath = `/${location.pathname.split("/")[1]}`;
    await reloadMails();
    navigate(targetPath);
  };

  const onArchived = async () => {
    mail.isArchived = true;
    await mailService.updateMail(mail);
    await reloadMails();
  };

  const goBack = () => {
    const targetPath = `/${location.pathname.split("/")[1]}`;
    navigate(targetPath);
  };

  if (!mail) return <div className="loader-container"><Loader /></div>;

  return (
    <article className="mail-details-outlet">
      <MailActions
        goBack={goBack}
        onDelete={onDelete}
        onUnread={onUnread}
        onArchived={onArchived}
      />
      <header className="mail-details-header">
        <h1>{mail.subject}</h1>
      </header>
      <header className="mail-details-meta">
        <div className="mail-details-meta-sub">
          <p className="mail-details-meta-item">
            {mail.fromName} &lt;{mail.from}&gt;
          </p>
        </div>
        <div className="mail-details-meta-sub">
          <p className="mail-details-meta-item">{parseDate(mail.sentAt)}</p>
          <StarCheckbox
            cb={onStar}
            defaultChecked={mail.isStarred}
            className="mail-preview-star-checkbox mail-details-meta-item"
          />
          <div className="btn mail-details-btn">
            {" "}
            <IoReturnUpBack />
          </div>
        </div>
      </header>
      <main className="mail-details-body">
        <p>{mail.body}</p>
      </main>
    </article>
  );
}
function parseDate(date) {
  return new Date(date).toLocaleDateString();
}
