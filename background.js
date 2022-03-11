import {Api} from "./shared/api.js";
import {
    State,
    STORE_SHOW_NOTIFICATION_KEY,
    STORE_LOGGED_KEY,
    STORE_USER_KEY,
    STORE_ACCESS_TOKEN_KEY
} from "./shared/state.js";
import {
    API_FETCH_INTERVAL,
    DATA_AUTH_REQUIRED_NOTIFICATION,
    MSG_GET_CONFIG,
    NOTIFiCATION_NEED_LOGIN
} from "./shared/const.js";
import {loadFile} from "./shared/utils.js";
import {launchNotification} from "./shared/notification.js";

const state = new State()
let api = null
let apiInterval = null

function launchApiInterval() {
    apiInterval = setInterval(async () => {
        const accessToken = await state.accessToken

        if (!api.hasAccessToken && accessToken) {
            api.accessToken = accessToken
            state[STORE_ACCESS_TOKEN_KEY] = accessToken
        }

        await checkUser()
    }, API_FETCH_INTERVAL)
}

function stopApiInterval() {
    clearInterval(apiInterval)
    apiInterval = null
}

async function checkUser() {
    const user = await api.user

    if (!user || !user.data) {
        state[STORE_LOGGED_KEY] = false

        if (!(await state.showNotification))
            return

        launchNotification(NOTIFiCATION_NEED_LOGIN, {
            message: DATA_AUTH_REQUIRED_NOTIFICATION,
            buttons: [{title: 'Ne plus me notifier'}, {title: 'Fermer'}],
        })
        return
    }

    state[STORE_LOGGED_KEY] = true
    state[STORE_USER_KEY] = user.data[0]
}

async function Init(config) {
    const accessToken = await state.accessToken
    api = new Api(config.auth.clientId, accessToken)
    api.init()

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case MSG_GET_CONFIG:
                sendResponse({config})
                break
            default:
                break
        }
    })

    await checkUser()
    launchApiInterval()
}


async function handleNotification(notification, buttonId = null) {
    switch (notification) {
        case NOTIFiCATION_NEED_LOGIN:
            if (buttonId === 0) {
                state[STORE_SHOW_NOTIFICATION_KEY] = false
            }
            break
        default:
            break
    }
}

chrome.notifications.onButtonClicked.addListener(handleNotification)
chrome.notifications.onClicked.addListener(handleNotification)

loadFile('config.json')
    .then(Init)
