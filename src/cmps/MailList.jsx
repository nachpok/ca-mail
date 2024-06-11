import { MailPreview } from "./MailPreview.jsx";
import { MailListHeader } from "./MailListHeader.jsx";
import { useState } from "react";

export function MailList({ mails, reloadMails, onUpdateSelectedMails, onOpenDraft }) {
  const [checkIds, setCheckIds] = useState([]);

  function onSelectAll(e) {
    const { checked } = e.target;
    if (checked) {
      setCheckIds(mails.map((mail) => mail.id));
    } else {
      setCheckIds([]);
    }
  };

  function onCheckPreview(id, checked) {
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
      <div className="">
        {mails.map((mail) => (
          <MailPreview
            key={mail.id}
            mail={mail}
            checked={checkIds.includes(mail.id)}
            onCheckPreview={onCheckPreview}
            onOpenDraft={onOpenDraft}
            onUpdateSelectedMails={onUpdateSelectedMails}
          />
        ))}
      </div>
    </section>
  );
}
