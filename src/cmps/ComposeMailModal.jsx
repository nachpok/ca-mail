import { useEffect, useRef, useState } from "react";
import { mailService } from "../services/mail.service";
import minimise from '../assets/imgs/minimise.svg'
import expand from '../assets/imgs/expand.svg'
import trash from '../assets/imgs/trash.svg'
import { useSearchParams } from "react-router-dom";
import { useInitDraft } from "../hooks/useInitDraft";
import { useSaveDraft } from "../hooks/useSaveDraft";
import { utilService } from "../services/util.service";
import { MDXEditor, BlockTypeSelect, CreateLink, InsertImage, ListsToggle, CodeToggle, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin } from '@mdxeditor/editor'
import { listsPlugin, imagePlugin, linkDialogPlugin } from '@mdxeditor/editor'

export function ComposeMailModal({ onCloseCompose, onEditDraft }) {
    const [errorModal, setErrorModal] = useState(false);
    const [modalStateOpen, setModalStateOpen] = useState(true)
    const [modalWindowFull, setModalWindowFull] = useState(false)
    const [mail, setMail] = useState({ id: 'new', to: '', subject: '', body: '' })
    const [searchParams, setSearchParams] = useSearchParams();
    const [composeTitle, setComposeTitle] = useState('New Message')
    const [isInitComplete, setIsInitComplete] = useState(false)

    const ref = useRef(null)

    useInitDraft(setMail, setComposeTitle, setIsInitComplete)
    const clearSaveDraftTimeout = useSaveDraft(mail, onSaveDraft, setComposeTitle, isInitComplete)


    async function onSendMail() {
        if (!utilService.validateEmail(mail.to)) {
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

    async function onSaveDraft() {
        if (mail.id && mail.id.includes('MUIxx')) {
            try {
                await mailService.updateMail({ id: mail.id, to: mail.to, subject: mail.subject, body: mail.body })
                setMail(prevMail => ({ ...prevMail, to: mail.to, subject: mail.subject, body: mail.body }))
                onEditDraft(mail)
            } catch (err) {
                console.error("onSaveDraft.err", err)
            }
        } else {
            if (mail.to !== 'new' || mail.subject !== '' || mail.body !== '') {
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
                    console.error("onSaveDraft.err", err)
                }

            }
        }

        const currentSearchParams = searchParams.toString()
        if (currentSearchParams !== `compose=${mail.id}` && currentSearchParams !== 'compose=new') {
            searchParams.set('compose', mail.id);
        }

    }

    function onEditMailField(e) {
        const { name, value } = e.target;
        setMail(prevMail => ({ ...prevMail, [name]: value }));
    }

    function handleModalState(e, { stateOpen, windowFull }) {
        e.preventDefault();
        e.stopPropagation();
        if (stateOpen !== undefined) setModalStateOpen(stateOpen);
        if (windowFull !== undefined) setModalWindowFull(windowFull);
    }

    async function closeModal(e) {
        e.preventDefault();
        e.stopPropagation();
        clearSaveDraftTimeout();
        await onSaveDraft();
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
                    {modalStateOpen && <button className="btn" onClick={(e) => handleModalState(e, { stateOpen: false })}>_</button>}
                    {!modalStateOpen && <button className="btn flip-btn" onClick={(e) => handleModalState(e, { stateOpen: true })}>_</button>}
                    {(!modalWindowFull || !modalStateOpen) && <button className="btn svg-btn responsive-minimise-btn" onClick={(e) => handleModalState(e, { stateOpen: true, windowFull: true })}><img src={expand} alt="expand" /></button>}
                    {modalWindowFull && modalStateOpen && <button className="btn svg-btn responsive-minimise-btn" onClick={(e) => handleModalState(e, { stateOpen: true, windowFull: false })}><img src={minimise} alt="shrink" /></button>}
                    <button className='btn' onClick={(e) => closeModal(e)}>X</button>
                </div>
            </header>
            {modalStateOpen !== 'minimised' && <>
                <form className='form'>
                    <input type="email" name="to" placeholder='To' className={`form-item form-input`} value={mail.to} onChange={onEditMailField} />
                    <input type="text" name="subject" placeholder='Subject' className={`form-item form-input`} value={mail.subject} onChange={onEditMailField} />
                    {/* <textarea name="body" placeholder='Message' className={`form-item form-textarea`} value={mail.body} onChange={onEditMailField} ></textarea> */}
                    <MDXEditor ref={ref} markdown="# Hello world" plugins={[listsPlugin(), imagePlugin(), linkDialogPlugin(), toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <UndoRedo />
                                <BoldItalicUnderlineToggles />
                                <BlockTypeSelect />
                                <CodeToggle />
                                <ListsToggle />
                                <CreateLink />
                                <InsertImage />
                            </>
                        )
                    })]} />
                </form>
                <footer className={`footer ${modalStateOpen ? 'open' : 'closed'}`}>
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

