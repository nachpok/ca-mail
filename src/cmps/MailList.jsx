import { MailPreview } from "./MailPreview.jsx";
import { MailListHeader } from "./MailListHeader.jsx";
import { useState } from "react";

export function MailList({ mails, reloadMails, onUpdateSelectedMails, openDraft }) {
  const [checkIds, setCheckIds] = useState([]);

  function onSelectAll(e) {
    const { checked } = e.target;
    if (checked) {
      setCheckIds(mails.map((mail) => mail.id));
    } else {
      setCheckIds([]);
    }
  };

  function checkPreview(id, checked) {
    if (checked) {
      setCheckIds((prev) => [...prev, id]);
    } else {
      setCheckIds((prev) => prev.filter((prevId) => prevId !== id));
    }
  };

  return (
    <section className="mail-list">
      <MailListHeader
        reloadMails={reloadMails}
        onSelectAll={onSelectAll}
        checkIds={checkIds}
        onUpdateSelectedMails={onUpdateSelectedMails}
      />
      <div className="mail-preview-list">
        {mails.map((mail) => (
          <MailPreview
            key={mail.id}
            mail={mail}
            checked={checkIds.includes(mail.id)}
            checkPreview={checkPreview}
            openDraft={openDraft}
            onUpdateSelectedMails={onUpdateSelectedMails}
          />
        ))}
      </div>
    </section>
  );
}
