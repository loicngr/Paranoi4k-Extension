import {DATA_AUTH_REQUIRED} from "./shared/const.js"
import {Api} from "./shared/api.js"
import {
    State,
    STORE_ACCESS_TOKEN_KEY,
    STORE_LOGGED_KEY,
    STORE_SHOW_NOTIFICATION_KEY,
    STORE_USER_KEY
} from "./shared/state.js"
import {Flow} from "./shared/flow.js"
import {extractTokenFromUrl} from "./shared/utils.js"

const UI_DOM_BTN_LOGIN = () => document.getElementById('btnLogin')
const UI_DOM_SETTINGS_NOTIFICATIONS = () => document.querySelector('#settings button[data-type=popup]')
const UI_DOM_STATUS_IS_ON_LIVE = () => document.querySelector('#isOnLive h5 span')
const UI_DOM_BTN_CREDIT = () => document.getElementById('btnCredit')
const UI_DOM_CREDIT = () => document.getElementById('credit')
const UI_DOM_CREDIT_CLOSE = () => document.querySelector('#credit > button')
const UI_DOM_BTN_TWITCH = () => document.querySelector('#social svg[data-id=twitch]')
const UI_DOM_BTN_TWITTER = () => document.querySelector('#social svg[data-id=twitter]')
const UI_DOM_BTN_YOUTUBE = () => document.querySelector('#social svg[data-id=youtube]')
const UI_DOM_BTN_INSTAGRAM = () => document.querySelector('#social svg[data-id=instagram]')

const state = new State()
const flow = new Flow()
let config = null
let api = null

function flipFlopCredit() {
    const blocElement = UI_DOM_CREDIT()

    if (blocElement.style.display === 'none' || blocElement.style.display === '') {
        blocElement.style.display = 'block'

        setTimeout(() => {
            blocElement.classList.toggle('active')
        }, 200)
    } else if (blocElement.style.display === 'block') {
        blocElement.classList.toggle('active')
        setTimeout(() => {
            blocElement.style.display = 'none'
        }, 200)
    }
}

async function EventListeners() {
    const btnLoginElement = UI_DOM_BTN_LOGIN()
    btnLoginElement.addEventListener('click', async () => {
        const isLogged = await state.isLogged
        const user = await state.user
        if (isLogged) {
            browser.tabs.create({active: true, url: `https://www.twitch.tv/${user.login}`})
            return
        }

        await App()
    })

    const btnToggleNotificationElement = UI_DOM_SETTINGS_NOTIFICATIONS()
    btnToggleNotificationElement.addEventListener('click', async () => {
        const newValue = !(await state.showNotification)
        state[STORE_SHOW_NOTIFICATION_KEY] = newValue
        btnToggleNotificationElement.innerHTML = `${newValue ? 'Activé' : 'Désactivé'}`
    })

    const btnCreditElement = UI_DOM_BTN_CREDIT()
    const btnCreditCloseElement = UI_DOM_CREDIT_CLOSE()
    btnCreditElement.addEventListener('click', flipFlopCredit)
    btnCreditCloseElement.addEventListener('click', flipFlopCredit)

    const btnTwitch = UI_DOM_BTN_TWITCH()
    btnTwitch.addEventListener('click', async () => {
        browser.tabs.create({active: true, url: `https://www.twitch.tv/paranoi4k`})
    })

    const btnTwitter = UI_DOM_BTN_TWITTER()
    btnTwitter.addEventListener('click', async () => {
        browser.tabs.create({active: true, url: `https://www.twitter.com/Paranoi4k`})
    })

    const btnYoutube = UI_DOM_BTN_YOUTUBE()
    btnYoutube.addEventListener('click', async () => {
        browser.tabs.create({active: true, url: `https://www.youtube.com/c/Paranoi4k`})
    })

    const btnInstagram = UI_DOM_BTN_INSTAGRAM()
    btnInstagram.addEventListener('click', async () => {
        browser.tabs.create({active: true, url: `https://www.instagram.com/paranoi4k`})
    })
}

async function UI() {
    const isLogged = await state.isLogged
    const stream = await state.stream
    const showNotification = await state.showNotification
    const user = await state.user

    const btnLoginElement = UI_DOM_BTN_LOGIN()
    btnLoginElement.innerHTML = `${isLogged ? user.display_name : 'Connexion à Twitch'}`

    const btnToggleNotificationElement = UI_DOM_SETTINGS_NOTIFICATIONS()
    btnToggleNotificationElement.innerHTML = `${showNotification ? 'Activé' : 'Désactivé'}`

    const isOnLiveElement = UI_DOM_STATUS_IS_ON_LIVE()
    isOnLiveElement.innerHTML = `${!stream ? 'Pas en live' : 'En live'}`
}

async function App() {
    api = api ?? new Api(config.auth.clientId, (await state.accessToken ?? null), (await config.streamerUID ?? null))
    const userIsLogged = await state.isLogged

    if (!userIsLogged) {
        if (!confirm(DATA_AUTH_REQUIRED)) {
            return
        }

        const flowRedirectUrl = await flow.launch(api.clientId)
        if (!flowRedirectUrl) {
            return
        }

        api.init()
        const accessToken = extractTokenFromUrl(flowRedirectUrl)
        api.accessToken = accessToken
        state[STORE_ACCESS_TOKEN_KEY] = accessToken

        api.user
            .then(async r => {
                state[STORE_USER_KEY] = r.data[0]
                state[STORE_LOGGED_KEY] = true

                await App()
            })
            .catch(console.error)

        return
    }

    await UI()
}

state
    .config
    .then(async (response) => {
        config = response

        await EventListeners()
        await App()
    })
