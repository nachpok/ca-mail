import { useEffect, useRef, useState } from "react";
import { mailService } from "../services/mail.service";
import minimise from '../assets/imgs/minimise.svg'
import expand from '../assets/imgs/expand.svg'
import trash from '../assets/imgs/trash.svg'
import { useSearchParams } from "react-router-dom";

//TODO test drafts with search params form advance filtering
export function ComposeMailModal({ onCloseCompose, onEditDraft }) {
    const [errorModal, setErrorModal] = useState(false);
    const [modalStateOpen, setModalStateOpen] = useState(true)
    const [modalWindowFull, setModalWindowFull] = useState(false)
    const [mail, setMail] = useState({ id: 'new', to: '', subject: '', body: '' })
    const [searchParams, setSearchParams] = useSearchParams();
    const [composeTitle, setComposeTitle] = useState('New Message')

    useEffect(() => {
        const currentDraftId = searchParams.get('compose');

        async function initDraft() {
            try {
                const draft = await mailService.getById(currentDraftId)
                setMail({ ...draft, to: draft.to || '', subject: draft.subject || '', body: draft.body || '' })
            } catch (err) {
                console.error("initDraft.err", err)
            }
        }

        if (currentDraftId && currentDraftId.includes('MUIxx')) {
            initDraft()
        }
    }, [searchParams])

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    async function onSendMail() {
        if (!validateEmail(mail.to)) {
            setErrorModal(true)
            return;
        }
        if (!mail.subject || !mail.body) {
            const answer = confirm("Send this message without a subject or text in the body?");
            if (!answer) return;
        }

        try {
            await mailService.updateMail({ id: mail.id, to: mail.to, subject: mail.subject, body: mail.body, isDraft: false, sentAt: Date.now() })
            onCloseCompose(false)
        } catch (err) {
            console.error("onSendMail.err", err)
        }
    };

    async function onFormFieldBlur() {
        if (mail.id && mail.id.includes('MUIxx')) {
            try {
                await mailService.updateMail({ id: mail.id, to: mail.to, subject: mail.subject, body: mail.body })
                setMail(prevMail => ({ ...prevMail, to: mail.to, subject: mail.subject, body: mail.body }))
                onEditDraft(mail)
            } catch (err) {
                console.error("onFormFieldBlur.err", err)
            }
        } else {
            try {
                const newDraft = await mailService.createDraft({ to: mail.to, subject: mail.subject, body: mail.body })
                setMail({
                    ...newDraft,
                    to: newDraft.to || '',
                    subject: newDraft.subject || '',
                    body: newDraft.body || ''
                });
                onEditDraft(newDraft)
                setSearchParams({ compose: newDraft.id });
            } catch (err) {
                console.error("onFormFieldBlur.err", err)
            }
        }

        const currentSearchParams = searchParams.toString()
        if (currentSearchParams !== `compose=${mail.id}` && currentSearchParams !== 'compose=new') {
            searchParams.set('compose', mail.id);
        }

        setComposeTitle('Draft Saved')
        setTimeout(() => {
            if (mail.subject !== "") {
                setComposeTitle(mail.subject)
            } else {
                setComposeTitle('New Message')
            }
        }, 1500)
    }

    function onEditMailField(e) {
        const { name, value } = e.target;
        setMail(prevMail => ({ ...prevMail, [name]: value }));
    }

    function minimiseModal(e) {
        e.preventDefault();
        e.stopPropagation();
        setModalStateOpen(false)
    }

    function openModal(e) {
        e.preventDefault();
        e.stopPropagation();
        setModalStateOpen(true)
    }

    function expandModal(e) {
        e.preventDefault();
        e.stopPropagation();
        setModalStateOpen(true)
        setModalWindowFull(true)
    }

    function shrinkModal(e) {
        e.preventDefault();
        e.stopPropagation();
        setModalWindowFull(false)
        setModalStateOpen(true)
    }

    function closeModal(e) {
        e.preventDefault();
        e.stopPropagation();
        onCloseCompose(false)
    }

    function onModalHeaderClick(e) {
        setModalStateOpen((prev) => !prev)
    }

    async function trashDraft() {
        await onEditDraft({ ...mail, isDraft: true, removedAt: Date.now() })
        onCloseCompose(false)
    }

    return (
        <article className={`compose-mail-modal ${modalStateOpen ? modalWindowFull ? 'expanded' : 'open' : 'minimised'}`}>
            <header className='header' onClick={onModalHeaderClick}>
                <h1 className='title'>{composeTitle}</h1>
                <div className="btns">
                    {modalStateOpen && <button className="btn" onClick={(e) => minimiseModal(e)}>_</button>}
                    {!modalStateOpen && <button className="btn flip-btn" onClick={(e) => openModal(e)}>_</button>}
                    {(!modalWindowFull || !modalStateOpen) && <button className="btn svg-btn" onClick={(e) => expandModal(e)}><img src={expand} alt="expand" /></button>}
                    {modalWindowFull && modalStateOpen && <button className="btn svg-btn" onClick={(e) => shrinkModal(e)}><img src={minimise} alt="shrink" /></button>}
                    <button className='btn' onClick={(e) => closeModal(e)}>X</button>
                </div>
            </header>
            {modalStateOpen !== 'minimised' && <>
                <form className='form'>
                    <input type="email" name="to" placeholder='To' className={`form-item form-input`} value={mail.to} onChange={onEditMailField} onBlur={onFormFieldBlur} />
                    <input type="text" name="subject" placeholder='Subject' className={`form-item form-input`} value={mail.subject} onChange={onEditMailField} onBlur={onFormFieldBlur} />
                    <textarea name="body" placeholder='Message' className={`form-item form-textarea`} value={mail.body} onChange={onEditMailField} onBlur={onFormFieldBlur}></textarea>
                </form>
                <footer className='footer'>
                    <button className='send-btn' onClick={onSendMail}>Send</button>
                    <button className="btn trash-btn" onClick={trashDraft}><img src={trash} alt="trash" /></button>
                </footer>
                {errorModal &&
                    <article className="compose-mail-modal error-modal">
                        <main className="error-modal-content">
                            <h1>Error</h1>
                            <p>Please enter a valid email address.</p>
                            <button onClick={() => setErrorModal(false)} className="modal-close-btn">Close</button>
                        </main>
                    </article>
                }
            </>}
        </article>

    )
}

