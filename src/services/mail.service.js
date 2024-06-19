import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import dayjs from 'dayjs'
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
            mails = mails.filter(mail => mail.removedAt === null && !mail.isDraft);
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

    mails = mails.sort((a, b) => b.sentAt - a.sentAt);

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
    if (text !== "") {
        const searchRegex = new RegExp(text);

        mailsToFilter = mailsToFilter.filter(mail =>
            searchRegex.test(mail.subject) ||
            searchRegex.test(mail.body) ||
            searchRegex.test(mail.fromName) ||
            searchRegex.test(mail.toName) ||
            searchRegex.test(mail.from) ||
            searchRegex.test(mail.to)
        );
    }

    if (filters.hasWords && filters.hasWords !== "") {
        const decodedHasWords = decodeURIComponent(filters.hasWords);
        const searchText = decodedHasWords.toLowerCase();
        const searchRegex = new RegExp(searchText);

        mailsToFilter = mailsToFilter.filter(mail =>
            searchRegex.test(mail.subject) ||
            searchRegex.test(mail.body) ||
            searchRegex.test(mail.fromName) ||
            searchRegex.test(mail.toName) ||
            searchRegex.test(mail.from) ||
            searchRegex.test(mail.to)
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
        const inputDate = dayjs(filters.dateWithinInput).toDate();
        const startDate = dayjs(inputDate).subtract(filters.dateWithinSelect, 'day').toDate().setHours(0, 0, 0, 0);
        const endDate = dayjs(inputDate).add(filters.dateWithinSelect, 'day').toDate().setHours(23, 59, 59, 999);
        mailsToFilter = mailsToFilter.filter(mail => mail.sentAt >= startDate && mail.sentAt <= endDate);
    }

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
    const newMail = { id: utilService.makeId(), sentAt: Date.now(), removedAt: null, isRead: false, isStarred: false, isArchived: false, from: loggedinUser.email, to: mail.to, fromName: loggedinUser.fullname, toName: mail.toName, isDraft: true, subject: mail.subject, body: mail.body }
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
            "id": "MUIxx-e101",
            "subject": "Meeting Reminder",
            "body": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "isRead": false,
            "isArchived": false,
            "isStarred": false,
            "isDraft": false,
            "sentAt": 1715457028597,
            "removedAt": null,
            "from": "boss@company.com",
            "to": "user@appsus.com",
            "fromName": "Boss",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e102",
            "subject": "Project Update",
            "body": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "isRead": true,
            "isStarred": true,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1715456028597,
            "removedAt": null,
            "from": "manager@company.com",
            "to": "user@appsus.com",
            "fromName": "Manager",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e103",
            "subject": "Lunch Plans",
            "body": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "isRead": false,
            "isStarred": false,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1715555028597,
            "removedAt": null,
            "from": "friend@social.com",
            "to": "user@appsus.com",
            "fromName": "Friend",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e104",
            "subject": "Invoice #12345",
            "body": "Please find attached the invoice for your recent purchase.",
            "isRead": true,
            "isStarred": false,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1715654228597,
            "removedAt": null,
            "from": "billing@service.com",
            "to": "user@appsus.com",
            "fromName": "Billing Service",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e105",
            "subject": "Welcome to Our Service",
            "body": "Thank you for signing up for our service. We hope you enjoy it!",
            "isRead": false,
            "isStarred": true,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1715753628597,
            "removedAt": null,
            "from": "support@service.com",
            "to": "user@appsus.com",
            "fromName": "Support Service",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e106",
            "subject": "Password Reset",
            "body": "Click the link below to reset your password.",
            "isRead": true,
            "isStarred": false,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1715853028597,
            "removedAt": null,
            "from": "no-reply@service.com",
            "to": "user@appsus.com",
            "fromName": "No Reply Service",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e107",
            "subject": "Weekly Newsletter",
            "body": "Here is your weekly newsletter with the latest updates.",
            "isRead": false,
            "isStarred": false,
            "isArchived": false,
            "sentAt": 1715952428597,
            "removedAt": null,
            "from": "newsletter@service.com",
            "to": "user@appsus.com",
            "fromName": "Newsletter Service",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e108",
            "subject": "Job Application Status",
            "body": "We are pleased to inform you that your application has been accepted.",
            "isRead": true,
            "isStarred": true,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1716052028597,
            "removedAt": null,
            "from": "hr@company.com",
            "to": "user@appsus.com",
            "fromName": "HR Department",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e109",
            "subject": "Event Invitation",
            "body": "You are invited to our annual event. Please RSVP.",
            "isRead": false,
            "isStarred": false,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1716151428597,
            "removedAt": null,
            "from": "events@company.com",
            "to": "user@appsus.com",
            "fromName": "Events Team",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e110",
            "subject": "Subscription Confirmation",
            "body": "Thank you for subscribing to our service.",
            "isRead": true,
            "isStarred": false,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1716251028597,
            "removedAt": null,
            "from": "no-reply@service.com",
            "to": "user@appsus.com",
            "fromName": "No Reply Service",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e111",
            "subject": "Order Shipped",
            "body": "Your order has been shipped and is            order has been shipped and is on its way.",
            "isRead": false,
            "isStarred": true,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1716350628597,
            "removedAt": null,
            "from": "shipping@store.com",
            "to": "user@appsus.com",
            "fromName": "Shipping Department",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e113",
            "subject": "Feedback Request",
            "body": "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Why do we use it?It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).Where does it come from?Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
            "isRead": false,
            "isStarred": false,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1716450228597,
            "removedAt": null,
            "from": "feedback@service.com",
            "to": "user@appsus.com",
            "fromName": "Feedback Team",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e114",
            "subject": "Security Alert",
            "body": "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Why do we use it?It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).Where does it come from?Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
            "isRead": true,
            "isStarred": true,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1716549828597,
            "removedAt": null,
            "from": "security@service.com",
            "to": "user@appsus.com",
            "fromName": "Security Team",
            "toName": "Mahatma Appsus"
        },
        {
            "id": "MUIxx-e115",
            "subject": "Promotion Offer",
            "body": "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Why do we use it?It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).Where does it come from?Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
            "isRead": false,
            "isStarred": false,
            "isArchived": false,
            "sentAt": 1716649428597,
            "removedAt": null,
            "from": "user@appsus.com",
            "to": "promotions@store.com",
            "fromName": "Mahatma Appsus",
            "toName": "Promotions Team"
        },
        {
            "id": "MUIxx-e116",
            "subject": "Service Downtime Notice",
            "body": "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Why do we use it?It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).Where does it come from?Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
            "isRead": true,
            "isStarred": false,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1716749028597,
            "removedAt": null,
            "from": "user@appsus.com",
            "to": "support@service.com",
            "fromName": "Mahatma Appsus",
            "toName": "Support Team"
        },
        {
            "id": "MUIxx-e117",
            "subject": "New Feature Announcement",
            "body": "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Why do we use it?It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).Where does it come from?Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
            "isRead": false,
            "isStarred": true,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1716848628597,
            "removedAt": null,
            "from": "user@appsus.com",
            "to": "updates@service.com",
            "fromName": "Mahatma Appsus",
            "toName": "Updates Team"
        },
        {
            "id": "MUIxx-e118",
            "subject": "Account Verification",
            "body": "Please verify your email address by clicking the link below.",
            "isRead": true,
            "isStarred": false,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 1716948228597,
            "removedAt": null,
            "from": "user@appsus.com",
            "to": "no-reply@service.com",
            "fromName": "Mahatma Appsus",
            "toName": "No Reply Service"
        },
        {
            "id": "MUIxx-e119",
            "subject": "Survey Invitation",
            "body": "We invite you to participate in our customer satisfaction survey.",
            "isRead": false,
            "isStarred": false,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 14604400285,
            "removedAt": null,
            "from": "user@appsus.com",
            "to": "survey@service.com",
            "fromName": "Mahatma Appsus",
            "toName": "Survey Team"
        },
        {
            "id": "MUIxx-e120",
            "subject": "Thank You!",
            "body": "Thank you for being a valued customer.",
            "isRead": true,
            "isStarred": true,
            "isArchived": false,
            "isDraft": false,
            "sentAt": 169211982859,
            "removedAt": 171803992859,
            "from": "user@appsus.com",
            "to": "support@service.com",
            "fromName": "Mahatma",
            "toName": "Support Team"
        }
    ]

    if (!mails || mails.length === 0) {
        for (const mail of mockEmails) {

            await storageService.post(MAIL_KEY, mail)
        }
    }
}

