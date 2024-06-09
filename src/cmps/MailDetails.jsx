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
    onUpdateSelectedMails(mail.isStarred ? "unstar" : "star", [mail.id]);
  }

  const goBack = () => {
    const targetPath = `/${location.pathname.split("/")[1]}`;

    if (location.pathname.includes("search")) {
      const newPath = location.pathname.split('/').slice(0, -1).join('/');
      navigate(newPath);
    } else {
      navigate(targetPath);
    }
  };

  if (!mail) return <div className="loader-container"><Loader /></div>;

  const breakBody = mail.body.split("\n");

  return (
    <article className="mail-details">
      <MailActions
        goBack={goBack}
        onUpdateSelectedMails={onUpdateSelectedMails}
        checkIds={[mail.id]}
      />
      <header className="header">
        <article className="title">
          <h1>{mail.subject}</h1>
        </article>
        <article className="meta">
          <div className="from">
            {mail.fromName} &lt;{mail.from}&gt;
          </div>
          <div className="sub-header">
            <div className="">{parseDate(mail.sentAt)}</div>
            <StarCheckbox
              cb={onStar}
              defaultChecked={mail.isStarred}
              className="item btn"
            />
            <div className="item btn">
              <IoReturnUpBack />
            </div>
          </div>
        </article>
      </header>
      <main className="body">
        {breakBody.map((line, idx) => (
          <p key={idx} className="text-line">{line}<br /></p>
        ))}
      </main>
    </article>
  );
}

function parseDate(date) {
  return new Date(date).toLocaleDateString();
}
