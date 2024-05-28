import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}
export const mailService = {
    query,
    getById,
    remove,
    save,
    createMail,
    updateMail,
    loggedinUser,
}


const MAIL_KEY = 'mail'

// const filterBy = {
//     status: 'inbox/sent/star/trash',
//     txt: 'puki',
//     isRead: true / false / null,
// }

_createMockMails()

async function query(filterBy) {
    let mails = await storageService.query(MAIL_KEY);
    if (filterBy) {
        const { txt, status, isRead } = filterBy
        if (txt && txt !== '') {
            const regex = new RegExp(`(${txt})`, 'gi')
            mails = mails.filter(mail => regex.test(mail.subject) || regex.test(mail.body))
        }
        if (status && status.length > 0) {
            if (status.includes('all-mail')) {
                mails = mails.filter(mail => mail.to === (loggedinUser.email))
            }
            if (status.includes('inbox')) {
                mails = mails.filter(mail => (mail.to === (loggedinUser.email) && mail.removedAt === null && mail.isArchived === false))
            }
            if (status.includes("sent")) {
                mails = mails.filter(mail => mail.from === (loggedinUser.email) && mail.removedAt === null)
            }
            if (status.includes('star')) {
                mails = mails.filter(mail => mail.isStarred && mail.removedAt === null)
            }
            if (status.includes('trash')) {
                mails = mails.filter(mail => mail.removedAt !== null)
            }
        }
        if (isRead !== undefined) {
            mails = mails?.filter(mail => mail.isRead === isRead)
        }
    } else {
        mails = mails.filter(mail => mail.to === (loggedinUser.email) && mail.removedAt === null)
    }
    return mails
}

function getById(mailId) {
    return storageService.get(MAIL_KEY, mailId)
}

function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_KEY, mail)
    } else {
        mail.id = utilService.makeId()
        return storageService.post(MAIL_KEY, mail)
    }
}

function createMail(mail) {
    mail.id = utilService.makeId()
    mail.sentAt = Date.now()
    mail.removedAt = null
    mail.isRead = false
    mail.isStarred = false
    mail.isArchived = false
    mail.from = loggedinUser.email
    mail.fromName = loggedinUser.fullname

    return storageService.post(MAIL_KEY, mail)
}

function updateMail(mail) {
    return storageService.put(MAIL_KEY, mail)
}

async function _createMockMails() {
    let mails = await storageService.query(MAIL_KEY);
    const mockEmails = [
        {
            id: 'e101',
            subject: 'Meeting Reminder',
            body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            isRead: false,
            isArchived: false,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'boss@company.com',
            to: 'user@appsus.com',
            fromName: 'Boss',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e102',
            subject: 'Project Update',
            body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            isRead: true,
            isStarred: true,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'manager@company.com',
            to: 'user@appsus.com',
            fromName: 'Manager',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e103',
            subject: 'Lunch Plans',
            body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'friend@social.com',
            to: 'user@appsus.com',
            fromName: 'Friend',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e104',
            subject: 'Invoice #12345',
            body: 'Please find attached the invoice for your recent purchase.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'billing@service.com',
            to: 'user@appsus.com',
            fromName: 'Billing Service',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e105',
            subject: 'Welcome to Our Service',
            body: 'Thank you for signing up for our service. We hope you enjoy it!',
            isRead: false,
            isStarred: true,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'support@service.com',
            to: 'user@appsus.com',
            fromName: 'Support Service',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e106',
            subject: 'Password Reset',
            body: 'Click the link below to reset your password.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'no-reply@service.com',
            to: 'user@appsus.com',
            fromName: 'No Reply Service',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e107',
            subject: 'Weekly Newsletter',
            body: 'Here is your weekly newsletter with the latest updates.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'newsletter@service.com',
            to: 'user@appsus.com',
            fromName: 'Newsletter Service',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e108',
            subject: 'Job Application Status',
            body: 'We are pleased to inform you that your application has been accepted.',
            isRead: true,
            isStarred: true,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'hr@company.com',
            to: 'user@appsus.com',
            fromName: 'HR Department',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e109',
            subject: 'Event Invitation',
            body: 'You are invited to our annual event. Please RSVP.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'events@company.com',
            to: 'user@appsus.com',
            fromName: 'Events Team',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e110',
            subject: 'Subscription Confirmation',
            body: 'Thank you for subscribing to our service.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'no-reply@service.com',
            to: 'user@appsus.com',
            fromName: 'No Reply Service',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e111',
            subject: 'Order Shipped',
            body: 'Your order has been shipped and is on its way.',
            isRead: false,
            isStarred: true,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'shipping@store.com',
            to: 'user@appsus.com',
            fromName: 'Shipping Department',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e113',
            subject: 'Feedback Request',
            body: 'We would love to hear your feedback on our service.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'feedback@service.com',
            to: 'user@appsus.com',
            fromName: 'Feedback Team',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e114',
            subject: 'Security Alert',
            body: 'We detected a new login to your account from an unknown device.',
            isRead: true,
            isStarred: true,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'security@service.com',
            to: 'user@appsus.com',
            fromName: 'Security Team',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'e115',
            subject: 'Promotion Offer',
            body: 'Get 20% off on your next purchase with this promo code.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'promotions@store.com',
            fromName: 'Mahatma Appsus',
            toName: 'Promotions Team'
        },
        {
            id: 'e116',
            subject: 'Service Downtime Notice',
            body: 'Our service will be down for maintenance on Saturday from 2 AM to 4 AM.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'support@service.com',
            fromName: 'Mahatma Appsus',
            toName: 'Support Team'
        },
        {
            id: 'e117',
            subject: 'New Feature Announcement',
            body: 'We are excited to announce a new feature in our app.',
            isRead: false,
            isStarred: true,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'updates@service.com',
            fromName: 'Mahatma Appsus',
            toName: 'Updates Team'
        },
        {
            id: 'e118',
            subject: 'Account Verification',
            body: 'Please verify your email address by clicking the link below.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'no-reply@service.com',
            fromName: 'Mahatma Appsus',
            toName: 'No Reply Service'
        },
        {
            id: 'e119',
            subject: 'Survey Invitation',
            body: 'We invite you to participate in our customer satisfaction survey.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'survey@service.com',
            fromName: 'Mahatma Appsus',
            toName: 'Survey Team'
        },
        {
            id: 'e120',
            subject: 'Thank You!',
            body: 'Thank you for being a valued customer.',
            isRead: true,
            isStarred: true,
            isArchived: false,
            sentAt: 1631133930594,
            removedAt: 1631133931594,
            from: 'user@appsus.com',
            to: 'support@service.com',
            fromName: 'Mahatma',
            toName: 'Support Team'
        }
    ];
    if (!mails || mails.length === 0) {
        for (const mail of mockEmails) {
            await storageService.post(MAIL_KEY, mail)
        }
    }
}

