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
    loggedinUser
}

const MAIL_KEY = 'mail'

// const filterBy = {
//     status: 'inbox/sent/star/trash',
//     txt: 'puki',
//     isRead: true / false / null,
// }

async function query(filterBy) {
    let mails = await storageService.query(MAIL_KEY);
    if (!mails || mails.length === 0) {
        mails = _createMockMails()
    }
    if (filterBy) {
        const { txt, status, isRead } = filterBy
        if (txt) {
            const regex = new RegExp(`(${txt})`, 'gi')
            mails = mails.filter(mail => regex.test(mail.subject) || regex.test(mail.body))
        }
        if (status && status.length > 0) {
            if (status.includes('inbox')) {
                mails = mails.filter(mail => mail.from === (loggedinUser.email))
            }
            if (status.includes("sent")) {
                mails = mails.filter(mail => mail.to === (loggedinUser.email))
            }
            if (status.includes('star')) {
                mails = mails.filter(mail => mail.isStarred)
            }
            if (status.includes('trash')) {
                mails = mails.filter(mail => mail.removedAt !== null)
            }
        }
        if (isRead !== undefined) {
            mails = mails?.filter(mail => mail.isRead === isRead)
        }
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
    return storageService.post(MAIL_KEY, mail)
}

async function _createMockMails() {
    const mockEmails = [
        {
            id: 'e101',
            subject: 'Meeting Reminder',
            body: 'Don\'t forget about the meeting tomorrow at 10 AM.',
            isRead: false,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'boss@company.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e102',
            subject: 'Project Update',
            body: 'The project is on track and will be completed by the end of the month.',
            isRead: true,
            isStarred: true,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'manager@company.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e103',
            subject: 'Lunch Plans',
            body: 'How about lunch at 1 PM today?',
            isRead: false,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'friend@social.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e104',
            subject: 'Invoice #12345',
            body: 'Please find attached the invoice for your recent purchase.',
            isRead: true,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'billing@service.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e105',
            subject: 'Welcome to Our Service',
            body: 'Thank you for signing up for our service. We hope you enjoy it!',
            isRead: false,
            isStarred: true,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'support@service.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e106',
            subject: 'Password Reset',
            body: 'Click the link below to reset your password.',
            isRead: true,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'no-reply@service.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e107',
            subject: 'Weekly Newsletter',
            body: 'Here is your weekly newsletter with the latest updates.',
            isRead: false,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'newsletter@service.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e108',
            subject: 'Job Application Status',
            body: 'We are pleased to inform you that your application has been accepted.',
            isRead: true,
            isStarred: true,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'hr@company.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e109',
            subject: 'Event Invitation',
            body: 'You are invited to our annual event. Please RSVP.',
            isRead: false,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'events@company.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e110',
            subject: 'Subscription Confirmation',
            body: 'Thank you for subscribing to our service.',
            isRead: true,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'no-reply@service.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e111',
            subject: 'Order Shipped',
            body: 'Your order has been shipped and is on its way.',
            isRead: false,
            isStarred: true,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'shipping@store.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e113',
            subject: 'Feedback Request',
            body: 'We would love to hear your feedback on our service.',
            isRead: false,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'feedback@service.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e114',
            subject: 'Security Alert',
            body: 'We detected a new login to your account from an unknown device.',
            isRead: true,
            isStarred: true,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'security@service.com',
            to: 'user@appsus.com'
        },
        {
            id: 'e115',
            subject: 'Promotion Offer',
            body: 'Get 20% off on your next purchase with this promo code.',
            isRead: false,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'promotions@store.com'
        },
        {
            id: 'e116',
            subject: 'Service Downtime Notice',
            body: 'Our service will be down for maintenance on Saturday from 2 AM to 4 AM.',
            isRead: true,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'support@service.com'
        },
        {
            id: 'e117',
            subject: 'New Feature Announcement',
            body: 'We are excited to announce a new feature in our app.',
            isRead: false,
            isStarred: true,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'updates@service.com'
        },
        {
            id: 'e118',
            subject: 'Account Verification',
            body: 'Please verify your email address by clicking the link below.',
            isRead: true,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'no-reply@service.com'
        },
        {
            id: 'e119',
            subject: 'Survey Invitation',
            body: 'We invite you to participate in our customer satisfaction survey.',
            isRead: false,
            isStarred: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'survey@service.com'
        },
        {
            id: 'e120',
            subject: 'Thank You!',
            body: 'Thank you for being a valued customer.',
            isRead: true,
            isStarred: true,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'support@service.com'
        }
    ];
    for (const mail of mockEmails) {
        await storageService.post(MAIL_KEY, mail)
    }
}

