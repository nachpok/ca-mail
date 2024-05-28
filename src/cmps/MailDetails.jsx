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
  const { onUpdateSelectedMails } = useOutletContext();
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

  function onStar() {
    onUpdateSelectedMails("star", [mail.id]);
  }

  const goBack = () => {
    const targetPath = `/${location.pathname.split("/")[1]}`;
    navigate(targetPath);
  };

  if (!mail) return <div className="loader-container"><Loader /></div>;

  const breakBody = mail.body.split("\n");
  return (
    <article className="mail-details-outlet">
      <MailActions
        goBack={goBack}
        onUpdateSelectedMails={onUpdateSelectedMails}
        checkIds={[mail.id]}
      />
      <header className="mail-details-header">
        <h1>{mail.subject}</h1>
      </header>
      <header className="mail-details-meta">
        <div className="mail-details-meta-subject">
          <p className="mail-details-meta-item">
            {mail.fromName} &lt;{mail.from}&gt;
          </p>
        </div>
        <div className="mail-details-meta-subject">
          <p className="mail-details-meta-item">{parseDate(mail.sentAt)}</p>
          <StarCheckbox
            cb={onStar}
            defaultChecked={mail.isStarred}
            className="mail-preview-star-checkbox mail-details-meta-item"
          />
          <div className="btn mail-details-btn">
            <IoReturnUpBack />
          </div>
        </div>
      </header>
      <main className="mail-details-body">
        {breakBody.map((line, idx) => (
          <p key={idx} className="mail-details-body-line">{line}</p>
        ))}
      </main>
    </article>
  );
}
function parseDate(date) {
  return new Date(date).toLocaleDateString();
}
