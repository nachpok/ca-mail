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
    queryByText,
    createDraft,
    queryByAdvancedSearch
}


const MAIL_KEY = 'mail'


_createMockMails()


async function query(folder) {
    let mails = await storageService.query(MAIL_KEY);

    const unreadCounters = countUnreadMailsByFolder(mails)

    switch (folder) {
        case 'all-mail':
            break;
        case 'inbox':
            mails = mails.filter(mail => mail.to === loggedinUser.email && mail.removedAt === null && mail.isArchived === false);
            break;
        case 'sent':
            mails = mails.filter(mail => mail.from === loggedinUser.email && mail.removedAt === null && mail.isDraft === false);
            break;
        case 'starred':
            mails = mails.filter(mail => mail.isStarred && mail.removedAt === null);
            break;
        case 'trash':
            mails = mails.filter(mail => mail.removedAt !== null);
            break;
        case 'drafts':
            mails = mails.filter(mail => mail.isDraft);
            break;
        default:
            throw new Error(`Invalid folder: ${folder}`)
    }
    return { mails, unreadCounters }
}

async function queryByText(text, limit = 0) {
    let mails = []
    try {
        mails = await storageService.query(MAIL_KEY);
    } catch (err) {
        console.log(err)
    }

    if (text !== "") {
        mails = mails.filter(mail =>
            mail.subject?.toLowerCase().includes(text.toLowerCase()) ||
            mail.body?.toLowerCase().includes(text.toLowerCase()) ||
            mail.fromName?.toLowerCase().includes(text.toLowerCase()) ||
            mail.toName?.toLowerCase().includes(text.toLowerCase()) ||
            mail.from?.toLowerCase().includes(text.toLowerCase()) ||
            mail.to?.toLowerCase().includes(text.toLowerCase())
        );
    }

    mails = mails.sort((a, b) => b.sentAt - a.sentAt);
    if (limit >= 1) {
        mails = mails.slice(0, limit);
    }
    return mails;
}

async function queryByAdvancedSearch(text, filters, limit = 0) {

    if (!filters) return [];

    let mailsToFilter = []
    try {
        if (filters.search) {
            const { mails } = await query(filters.search);
            mailsToFilter = mails;
        } else {
            mailsToFilter = await storageService.query(MAIL_KEY);
        }

    } catch (err) {
        console.log(err)
    }

    if (text !== "" || filters.hastWords) {
        let searchText = text.toLowerCase();
        if (filters.hastWords) {
            searchText = filters.hastWords.toLowerCase();
        }
        mailsToFilter = mailsToFilter.filter(mail =>
            mail.subject?.toLowerCase().includes(searchText) ||
            mail.body?.toLowerCase().includes(searchText) ||
            mail.fromName?.toLowerCase().includes(searchText) ||
            mail.toName?.toLowerCase().includes(searchText) ||
            mail.from?.toLowerCase().includes(searchText) ||
            mail.to?.toLowerCase().includes(searchText)
        );
    }



    if (filters.from) {
        mailsToFilter = mailsToFilter.filter(mail => mail.from === filters.from);
    }

    if (filters.to) {
        mailsToFilter = mailsToFilter.filter(mail => mail.to === filters.to);
    }

    if (filters.subject) {
        mailsToFilter = mailsToFilter.filter(mail => mail.subject.toLowerCase().includes(filters.subject.toLowerCase()));
    }

    if (filters.doesntHave) {
        mailsToFilter = mailsToFilter.filter(mail => !mail.subject.toLowerCase().includes(filters.doesntHave.toLowerCase()));
    }

    if (filters.datestart && filters.daterangetype === "custom_range") {
        const startDate = new Date(filters.datestart);
        mailsToFilter = mailsToFilter.filter(mail => mail.sentAt >= startDate);
    }

    if (filters.dateWithinSelect && filters.dateWithinInput) {
        const startDate = new Date(filters.dateWithinInput);
        const endDate = new Date(filters.dateWithinInput);
        mailsToFilter = mailsToFilter.filter(mail => mail.sentAt >= startDate && mail.sentAt <= endDate);
    }


    console.log(mailsToFilter);
    mailsToFilter = mailsToFilter.sort((a, b) => b.sentAt - a.sentAt);
    if (limit >= 1) {
        mailsToFilter = mailsToFilter.slice(0, limit);
    }
    return mailsToFilter;
}

function countUnreadMailsByFolder(mails) {
    const unreadCounters = {
        inbox: 0,
        starred: 0,
        trash: 0,
        allMail: 0,
    }
    const userUnreadMails = mails.filter(mail => mail.to === loggedinUser.email && mail.isRead === false);
    unreadCounters.allMail = userUnreadMails.length || 0;
    unreadCounters.inbox = userUnreadMails.filter(mail => mail.removedAt === null && mail.isArchived === false).length || 0;
    unreadCounters.starred = userUnreadMails.filter(mail => mail.isStarred && mail.removedAt === null).length || 0;
    unreadCounters.trash = userUnreadMails.filter(mail => mail.removedAt !== null).length || 0;
    return unreadCounters;

}

function getById(mailId) {
    return storageService.get(MAIL_KEY, mailId)
}

async function remove(mailId) {
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

function createDraft(mail) {
    const newMail = { id: utilService.makeId(), sentAt: null, removedAt: null, isRead: false, isStarred: false, isArchived: false, from: loggedinUser.email, to: mail.to, fromName: loggedinUser.fullname, toName: mail.toName, isDraft: true }
    return storageService.post(MAIL_KEY, newMail)
}

function createMail(mail) {
    const newMail = { id: mail.id, sentAt: Date.now(), removedAt: null, isRead: false, isStarred: false, isArchived: false, from: loggedinUser.email, to: mail.to, fromName: loggedinUser.fullname, toName: mail.toName, isDraft: mail.isDraft }
    return storageService.post(MAIL_KEY, newMail)
}

function updateMail(mail) {
    return storageService.put(MAIL_KEY, mail)
}

async function _createMockMails() {
    let mails = await storageService.query(MAIL_KEY);
    const mockEmails = [
        {
            id: 'MUIxx-e101',
            subject: 'Meeting Reminder',
            body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            isRead: false,
            isArchived: false,
            isStarred: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'boss@company.com',
            to: 'user@appsus.com',
            fromName: 'Boss',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e102',
            subject: 'Project Update',
            body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            isRead: true,
            isStarred: true,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'manager@company.com',
            to: 'user@appsus.com',
            fromName: 'Manager',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e103',
            subject: 'Lunch Plans',
            body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'friend@social.com',
            to: 'user@appsus.com',
            fromName: 'Friend',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e104',
            subject: 'Invoice #12345',
            body: 'Please find attached the invoice for your recent purchase.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'billing@service.com',
            to: 'user@appsus.com',
            fromName: 'Billing Service',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e105',
            subject: 'Welcome to Our Service',
            body: 'Thank you for signing up for our service. We hope you enjoy it!',
            isRead: false,
            isStarred: true,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'support@service.com',
            to: 'user@appsus.com',
            fromName: 'Support Service',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e106',
            subject: 'Password Reset',
            body: 'Click the link below to reset your password.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'no-reply@service.com',
            to: 'user@appsus.com',
            fromName: 'No Reply Service',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e107',
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
            id: 'MUIxx-e108',
            subject: 'Job Application Status',
            body: 'We are pleased to inform you that your application has been accepted.',
            isRead: true,
            isStarred: true,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'hr@company.com',
            to: 'user@appsus.com',
            fromName: 'HR Department',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e109',
            subject: 'Event Invitation',
            body: 'You are invited to our annual event. Please RSVP.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'events@company.com',
            to: 'user@appsus.com',
            fromName: 'Events Team',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e110',
            subject: 'Subscription Confirmation',
            body: 'Thank you for subscribing to our service.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'no-reply@service.com',
            to: 'user@appsus.com',
            fromName: 'No Reply Service',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e111',
            subject: 'Order Shipped',
            body: 'Your order has been shipped and is on its way.',
            isRead: false,
            isStarred: true,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'shipping@store.com',
            to: 'user@appsus.com',
            fromName: 'Shipping Department',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e113',
            subject: 'Feedback Request',
            body: 'We would love to hear your feedback on our service.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'feedback@service.com',
            to: 'user@appsus.com',
            fromName: 'Feedback Team',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e114',
            subject: 'Security Alert',
            body: 'We detected a new login to your account from an unknown device.',
            isRead: true,
            isStarred: true,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'security@service.com',
            to: 'user@appsus.com',
            fromName: 'Security Team',
            toName: 'Mahatma Appsus'
        },
        {
            id: 'MUIxx-e115',
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
            id: 'MUIxx-e116',
            subject: 'Service Downtime Notice',
            body: 'Our service will be down for maintenance on Saturday from 2 AM to 4 AM.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'support@service.com',
            fromName: 'Mahatma Appsus',
            toName: 'Support Team'
        },
        {
            id: 'MUIxx-e117',
            subject: 'New Feature Announcement',
            body: 'We are excited to announce a new feature in our app.',
            isRead: false,
            isStarred: true,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'updates@service.com',
            fromName: 'Mahatma Appsus',
            toName: 'Updates Team'
        },
        {
            id: 'MUIxx-e118',
            subject: 'Account Verification',
            body: 'Please verify your email address by clicking the link below.',
            isRead: true,
            isStarred: false,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'no-reply@service.com',
            fromName: 'Mahatma Appsus',
            toName: 'No Reply Service'
        },
        {
            id: 'MUIxx-e119',
            subject: 'Survey Invitation',
            body: 'We invite you to participate in our customer satisfaction survey.',
            isRead: false,
            isStarred: false,
            isArchived: false,
            isDraft: false,
            sentAt: 1631133930594,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'survey@service.com',
            fromName: 'Mahatma Appsus',
            toName: 'Survey Team'
        },
        {
            id: 'MUIxx-e120',
            subject: 'Thank You!',
            body: 'Thank you for being a valued customer.',
            isRead: true,
            isStarred: true,
            isArchived: false,
            isDraft: false,
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

