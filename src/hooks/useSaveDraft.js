import { useEffect, useRef } from "react"

export function useSaveDraft(mailToEdit, onSaveDraft, setComposeTitle) {
    const timeoutRef = useRef()
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }

        timeoutRef.current = setTimeout(() => {
            onSaveDraft(mailToEdit)
            setComposeTitle('Draft Saved')
            setTimeout(() => {
                setComposeTitle(mailToEdit.subject)
            }, 1500)
        }, 5000)
    }, [mailToEdit])



    return () => clearTimeout(timeoutRef.current)
}