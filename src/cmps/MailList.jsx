import { MailPreview } from "./MailPreview.jsx";
import { MailListHeader } from "./MailListHeader.jsx";
import { useState } from "react";
import { mailService } from "../services/mail.service.js";

//TODO move relaod to index, just call from here
export function MailList({ mails, reloadMails }) {
  const [checkIds, setCheckIds] = useState([]);

  const handleSelectAll = (e) => {
    const { checked } = e.target;
    if (checked) {
      setCheckIds(mails.map((mail) => mail.id));
    } else {
      setCheckIds([]);
    }
  };

  const checkPreview = (id, checked) => {
    if (checked) {
      setCheckIds((prev) => [...prev, id]);
    } else {
      setCheckIds((prev) => prev.filter((prevId) => prevId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    let selectedMails = mails.filter((mail) => checkIds.includes(mail.id));
    selectedMails.filter((mail) => mail.removedAt !== null);
    for (let mail of selectedMails) {
      mail.removedAt = new Date();
      await mailService.updateMail(mail);
    }
    reloadMails();
  };

  const handleUnreadSelected = async () => {
    let selectedMails = mails.filter((mail) => checkIds.includes(mail.id));
    selectedMails = selectedMails.filter((mail) => mail.isRead === true);
    for (let mail of selectedMails) {
      mail.isRead = false;
      await mailService.updateMail(mail);
    }
    reloadMails();
  };

  const handleArchivedSelected = async () => {
    let selectedMails = mails.filter((mail) => checkIds.includes(mail.id));
    selectedMails = selectedMails.filter((mail) => mail.isArchived === false);
    for (let mail of selectedMails) {
      mail.isArchived = true;
      await mailService.updateMail(mail);
    }
    reloadMails();
  };
  return (
    <section className="mail-list">
      <MailListHeader
        reloadMails={reloadMails}
        handleSelectAll={handleSelectAll}
        checkIds={checkIds}
        handleUnread={handleUnreadSelected}
        handleDelete={handleDeleteSelected}
        handleArchived={handleArchivedSelected}
      />
      {mails.map((mail) => (
        <MailPreview
          key={mail.id}
          mail={mail}
          checked={checkIds.includes(mail.id)}
          checkPreview={checkPreview}
        />
      ))}
    </section>
  );
}
