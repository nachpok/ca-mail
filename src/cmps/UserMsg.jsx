import { useEffect, useState } from "react"
import { eventBusService } from "../services/event-bus.service"

export function UserMsg() {
    const [msg, setMsg] = useState(null)
    const [text, setText] = useState(null)
    const [timeoutId, setTimeoutId] = useState(null)

    useEffect(() => {
        eventBusService.on('show-user-msg', msg => {
            setMsg(msg)
            setText(msg.txt)
            clearTimeout(timeoutId)
            const id = setTimeout(closeMsg, 3000)
            setTimeoutId(id)
        })
    }, [timeoutId])

    useEffect(() => {
        if (msg) {
            setText(msg.txt)
        }
    }, [msg])

    function closeMsg() {
        setMsg(null)
    }

    function undo() {
        msg.undo()
        setText("Action undone.")
        clearTimeout(timeoutId)
        const id = setTimeout(closeMsg, 3000)
        setTimeoutId(id)
    }

    const showUndoButton = msg && msg.undo && text !== "Action undone."

    if (!msg) return <></>
    return (
        <div className={"user-msg " + msg.type}>
            <div className="user-msg-container">
                <h4>{text}</h4>
                {showUndoButton && <button onClick={undo} className="undo-btn">Undo</button>}
                <button onClick={closeMsg} className="close-btn">X</button>
            </div>
        </div>
    )
}
