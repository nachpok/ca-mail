import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { mailService } from "../services/mail.service.js"
export function useInitDraft(setMail, setComposeTitle) {
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const currentDraftId = searchParams.get('compose');

        async function initDraft() {
            try {
                const draft = await mailService.getById(currentDraftId)
                setMail({ ...draft, to: draft.to || '', subject: draft.subject || '', body: draft.body || '' })
                setComposeTitle(draft.subject)
            } catch (err) {
                console.error("initDraft.err", err)
            }
        }

        if (currentDraftId && currentDraftId.includes('MUIxx')) {
            initDraft()
        }
    }, [searchParams])
}