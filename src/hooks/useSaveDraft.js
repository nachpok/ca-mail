import { useEffect, useRef } from "react"

export function useSaveDraft(mailToEdit, onSaveDraft, setComposeTitle) {
    const timeoutRef = useRef()
    const previousMailRef = useRef()

    useEffect(() => {
        previousMailRef.current = mailToEdit
    }, [])

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }

        timeoutRef.current = setTimeout(() => {
            if (JSON.stringify(previousMailRef.current) !== JSON.stringify(mailToEdit)) {
                onSaveDraft(mailToEdit)
                if (previousMailRef.current.id !== 'new') {
                    setComposeTitle('Draft Saved')
                    setTimeout(() => {
                        if (mailToEdit.subject !== '') {
                            console.log('mailToEdit.subject', mailToEdit.subject)
                            setComposeTitle(mailToEdit.subject)
                        } else {
                            setComposeTitle('New Message')
                        }
                    }, 1500)
                }
                previousMailRef.current = mailToEdit
            }
        }, 2000)
    }, [mailToEdit])



    return () => clearTimeout(timeoutRef.current)
}