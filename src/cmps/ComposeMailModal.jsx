import { useRef, useState } from "react";
import { mailService } from "../services/mail.service";


//TODO new line
//TODO on send hover
//TODO on seve darft //audo save
//TODO expand & minimize
export function ComposeMailModal({ closeComposeMailModal }) {
    const [errorModal, setErrorModal] = useState(false)
    const toRef = useRef()
    const subjectRef = useRef()
    const messageRef = useRef()

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const onSendMail = async () => {
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

    return (
        <article className='compose-mail-modal'>
            <header className='compose-mail-modal-header'>
                <h1 className='compose-mail-modal-title'>New Message</h1>
                <button className='compose-mail-modal-close-btn' onClick={() => closeComposeMailModal(false)}>X</button>
            </header>
            <main className='compose-mail-modal-body'>
                <form className='compose-mail-modal-form'>
                    <input type="email" placeholder='To' className={`compose-mail-modal-form-item compose-mail-modal-form-input`} ref={toRef} />
                    <input type="text" placeholder='Subject' className={`compose-mail-modal-form-item compose-mail-modal-form-input`} ref={subjectRef} />
                    <textarea placeholder='Message' className={`compose-mail-modal-form-item compose-mail-modal-form-textarea`} ref={messageRef}></textarea>
                </form>
            </main>
            <footer className='compose-mail-modal-footer'>
                <button className='compose-mail-modal-send-btn' onClick={onSendMail}>Send</button>
            </footer>
            {errorModal &&
                <article className="compose-mail-modal-error-modal">
                    <main className="compose-mail-modal-error-modal-content">
                        <h1>Error</h1>
                        <p>Please enter a valid email address.</p>
                        <button onClick={() => setErrorModal(false)} className="compose-mail-modal-error-modal-close-btn">Close</button>
                    </main>
                </article>
            }
        </article>

    )
}

