import { useEffect, useRef, useState } from "react";
import { mailService } from "../services/mail.service";
import minimise from '../assets/imgs/minimise.svg'
import expand from '../assets/imgs/expand.svg'
import trash from '../assets/imgs/trash.svg'
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

//TODO on seve darft //audo save
export function ComposeMailModal({ closeComposeMailModal, refeshDrafsOnComposeEdit }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [errorModal, setErrorModal] = useState(false);
    const [modalStateOpen, setModalStateOpen] = useState(true)
    const [modalWindowFull, setModalWindowFull] = useState(false)
    //TODO null mail
    const [mail, setMail] = useState({})
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [draftId, setDraftId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [composeTitle, setComposeTitle] = useState('New Message')

    useEffect(() => {
        const currentDraftId = searchParams.get('compose');

        async function initDraft() {
            const draft = await mailService.getById(currentDraftId)
            const { to, subject, body } = draft
            setMail(draft)
            setTo(to || '')
            setSubject(subject || '')
            setMessage(body || '')
            setDraftId(currentDraftId)
        }
        if (currentDraftId && currentDraftId.includes('MUIxx')) {
            initDraft()
        }
    }, [location.search])



    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    async function onSendMail() {
        if (!validateEmail(to)) {
            setErrorModal(true)
            return;
        }
        if (!to || !subject || !message) {
            const answer = confirm("Send this message without a subject or text in the body?");
            if (!answer) return;
        }

        await mailService.updateMail({ id: draftId, to: to, subject: subject, body: message, isDraft: false, sentAt: Date.now() })
        closeComposeMailModal(false)
    };

    async function onToBlur(e) {
        const currentDraftId = searchParams.get('compose');

        if (currentDraftId || to || subject || message) {
            if (currentDraftId && currentDraftId.includes('MUIxx')) {
                await mailService.updateMail({ id: currentDraftId, to: to, subject: subject, body: message })
                setMail({ ...mail, to: to, subject: subject, body: message })
                refeshDrafsOnComposeEdit({ ...mail, to: to, subject: subject, body: message })
            } else {
                const newDraft = await mailService.createDraft({ to: to, subject: subject, body: message })
                setDraftId(newDraft.id);
                setMail(newDraft)
                refeshDrafsOnComposeEdit(newDraft)
                setSearchParams({ compose: newDraft.id });

            }

            const searchParams = new URLSearchParams(location.search);
            const currentSearchParams = searchParams.toString()
            if (currentSearchParams !== `compose=${draftId}` && currentSearchParams !== 'compose=new') {
                searchParams.set('compose', draftId);
            }
        }
        setComposeTitle('Draft Saved')
        //TODO cleanup 
        setTimeout(() => {
            if (subject !== "") {
                setComposeTitle(subject)
            } else {
                setComposeTitle('New Message')
            }
        }, 1500)
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
        closeComposeMailModal(false)
    }

    function onModalHeaderClick(e) {
        setModalStateOpen((prev) => !prev)
    }

    function trashDraft() {
        refeshDrafsOnComposeEdit({ ...mail, isDraft: true, removedAt: Date.now() })
        closeComposeMailModal(false)
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
                    <input type="email" placeholder='To' className={`form-item form-input`} value={to} onChange={(e) => setTo(e.target.value)} onBlur={(e) => onToBlur(e)} />
                    <input type="text" placeholder='Subject' className={`form-item form-input`} value={subject} onChange={(e) => setSubject(e.target.value)} onBlur={(e) => onToBlur(e)} />
                    <textarea placeholder='Message' className={`form-item form-textarea`} value={message} onChange={(e) => setMessage(e.target.value)} onBlur={(e) => onToBlur(e)}></textarea>
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

