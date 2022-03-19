import {Api} from "./shared/api.js"
import {
    State,
    STORE_ACCESS_TOKEN_KEY,
    STORE_CONFIG_KEY,
    STORE_LAST_NOTIFIED_AT_KEY,
    STORE_LOGGED_KEY,
    STORE_STREAM_KEY,
    STORE_USER_KEY
} from "./shared/state.js"
import {
    ALARM_API_FETCH_INTERVAL,
    ALARM_FETCH_USER_KEY,
    DATA_AUTH_REQUIRED_NOTIFICATION,
    DATA_STREAMER_ON_LIVE_NOTIFICATION,
    NOTIFiCATION_NEED_LOGIN,
    NOTIFiCATION_STREAMER_ON_LIVE
} from "./shared/const.js"
import {createAudioWindow, loadFile} from "./shared/utils.js"
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

        api = new Api(_config.auth.clientId, _accessToken, _config.streamerUID)
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

    const streamData = await api.stream
    const stream = (streamData.data && streamData.data.length !== 0) ? streamData.data[0] : null
    state[STORE_STREAM_KEY] = stream

    const lastNotifiedAt = await state.lastNotifiedAt
    if (stream && lastNotifiedAt !== stream.started_at) {
        state[STORE_LAST_NOTIFIED_AT_KEY] = stream.started_at

        if (!(await state.showNotification))
            return

        launchNotification(NOTIFiCATION_STREAMER_ON_LIVE, {
            message: DATA_STREAMER_ON_LIVE_NOTIFICATION
        })

        await createAudioWindow()
    }
}

async function checkUser() {
    const user = await api.user

    if (!user || !user.data) {
        state[STORE_LOGGED_KEY] = false

        if (!(await state.showNotification))
            return

        launchNotification(NOTIFiCATION_NEED_LOGIN, {
            message: DATA_AUTH_REQUIRED_NOTIFICATION
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
    browser.alarms.create(ALARM_FETCH_USER_KEY, {
        periodInMinutes: ALARM_API_FETCH_INTERVAL
    })
    browser.storage.onChanged.addListener((changes) => {
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

browser.alarms.onAlarm.addListener(async ({name}) => {
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
