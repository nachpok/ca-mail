import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { mailService } from "../services/mail.service.js"
export function useInitDraft(setMail, setComposeTitle, setIsInitComplete) {
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const currentDraftId = searchParams.get('compose');

        async function initDraft() {
            try {
                const draft = await mailService.getById(currentDraftId)
                setMail({ ...draft, to: draft.to || '', subject: draft.subject || '', body: draft.body || '' })
                if (draft.subject !== '') {
                    setComposeTitle(draft.subject)
                } else {
                    setComposeTitle('New Message')
                }
                setIsInitComplete(true)

            } catch (err) {
                console.error("initDraft.err", err)
            }
        }

        if (currentDraftId && currentDraftId.includes('MUIxx')) {
            initDraft()

        } else if (currentDraftId && currentDraftId.includes('new')) {
            const to = searchParams.get('to');
            const subject = searchParams.get('subject');
            if (to && subject) {
                setMail({ to, subject, body: '' })
                setComposeTitle(subject)
            }
            setIsInitComplete(true)
        }
    }, [searchParams, setIsInitComplete])
}