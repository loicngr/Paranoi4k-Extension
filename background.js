import {Api} from "./shared/api.js"
import {
    State,
    STORE_ACCESS_TOKEN_KEY,
    STORE_CONFIG_KEY,
    STORE_LOGGED_KEY,
    STORE_SHOW_NOTIFICATION_KEY,
    STORE_STREAM_KEY,
    STORE_USER_KEY
} from "./shared/state.js"
import {
    ALARM_API_FETCH_INTERVAL,
    ALARM_FETCH_USER_KEY,
    DATA_AUTH_REQUIRED_NOTIFICATION,
    NOTIFiCATION_NEED_LOGIN
} from "./shared/const.js"
import {loadFile} from "./shared/utils.js"
import {launchNotification} from "./shared/notification.js"

let state = new State()
let api = null

const getState = () => {
    return state ? state : new State()
}

const getApi = async () => {
    if (!api) {
        const _config = await state.config
        const _accessToken = await state.accessToken

        api = new Api(_config.auth.clientId, _accessToken)
        api.init()
    }

    return api
}

const serviceWorkerWakeUp = async () => {
    getState()
    await getApi()
}

async function checkStream() {
    if (!(await state.isLogged)) {
        state[STORE_STREAM_KEY] = null
        return
    }

    const stream = await api.stream
    state[STORE_STREAM_KEY] = stream.data
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

    await checkStream()
}

async function Init(config) {
    state[STORE_CONFIG_KEY] = config
    const accessToken = await state.accessToken
    api = new Api(config.auth.clientId, accessToken, config.streamerUID)
    api.init()

    await checkUser()
    chrome.alarms.create(ALARM_FETCH_USER_KEY, {
        periodInMinutes: ALARM_API_FETCH_INTERVAL
    })
    chrome.storage.onChanged.addListener((changes) => {
        for (const [key, {newValue}] of Object.entries(changes)) {
            switch (key) {
                case STORE_ACCESS_TOKEN_KEY:
                    api.accessToken = newValue
                    break
                default:
                    break
            }
        }
    })
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
chrome.alarms.onAlarm.addListener(async ({name}) => {
    await serviceWorkerWakeUp()

    switch (name) {
        case ALARM_FETCH_USER_KEY:
            const accessToken = await state.accessToken
            if (!api.hasAccessToken && accessToken) {
                api.accessToken = accessToken
                state[STORE_ACCESS_TOKEN_KEY] = accessToken
            }
            await checkUser()
            break
        default:
            break
    }
})

loadFile('config.json')
    .then(Init)
