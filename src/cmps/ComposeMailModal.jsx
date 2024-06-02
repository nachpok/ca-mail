import { useRef, useState } from "react";
import { mailService } from "../services/mail.service";
import minimise from '../assets/imgs/minimise.svg'
import expand from '../assets/imgs/expand.svg'

//TODO on seve darft //audo save
//TODO expand & minimize
export function ComposeMailModal({ closeComposeMailModal }) {
    const [errorModal, setErrorModal] = useState(false);
    const [modalState, setModalState] = useState('open')
    const toRef = useRef()
    const subjectRef = useRef()
    const messageRef = useRef()

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    async function onSendMail() {
        if (!validateEmail(toRef.current.value)) {
            setErrorModal(true)

            return;
        }
        if (!toRef.current.value || !subjectRef.current.value || !messageRef.current.value) {
            const answer = confirm("Send this message without a subject or text in the body?");
            if (!answer) return;
        }

        await mailService.createMail({ to: toRef.current.value, subject: subjectRef.current.value, body: messageRef.current.value })
        closeComposeMailModal(false)
    };

    function minimiseModal() {
        setModalState('minimised')
    }

    function openModal() {
        setModalState('open')
    }

    function expandModal() {
        setModalState('expanded')
    }

    return (
        <article className={`compose-mail-modal ${modalState}`}>
            <header className='header'>
                <h1 className='title'>New Message</h1>
                <div className="btns">
                    {modalState !== 'minimised' && <button className="btn" onClick={minimiseModal}>_</button>}
                    {modalState === 'minimised' && <button className="btn flip-btn" onClick={openModal}>_</button>}
                    {modalState !== 'expanded' && <button className="btn svg-btn" onClick={expandModal}><img src={expand} alt="expand" /></button>}
                    {modalState === 'expanded' && <button className="btn svg-btn" onClick={openModal}><img src={minimise} alt="minimise" /></button>}
                    <button className='btn' onClick={() => closeComposeMailModal(false)}>X</button>
                </div>
            </header>
            {modalState !== 'minimised' && <>
                <form className='form'>
                    <input type="email" placeholder='To' className={`form-item form-input`} ref={toRef} />
                    <input type="text" placeholder='Subject' className={`form-item form-input`} ref={subjectRef} />
                    <textarea placeholder='Message' className={`form-item form-textarea`} ref={messageRef}></textarea>
                </form>
                <footer className='footer'>
                    <button className='send-btn' onClick={onSendMail}>Send</button>
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

