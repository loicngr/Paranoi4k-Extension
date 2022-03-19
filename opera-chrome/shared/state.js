export const STORE_LOGGED_KEY = 'logged'
export const STORE_USER_KEY = 'user'
export const STORE_STREAM_KEY = 'stream'
export const STORE_ACCESS_TOKEN_KEY = 'accessToken'
export const STORE_CONFIG_KEY = 'config'
export const STORE_SHOW_NOTIFICATION_KEY = 'showNotification'
export const STORE_LAST_NOTIFIED_AT_KEY = 'lastNotifiedAt'

class Store {
    constructor() {}

    get isLogged() {
        return new Promise((resolve) => {
            chrome.storage.local.get([STORE_LOGGED_KEY], r => resolve(r[STORE_LOGGED_KEY]))
        })
    }

    get user() {
        return new Promise((resolve) => {
            chrome.storage.local.get([STORE_USER_KEY], r => resolve(r[STORE_USER_KEY]))
        })
    }

    get accessToken() {
        return new Promise((resolve) => {
            chrome.storage.local.get([STORE_ACCESS_TOKEN_KEY], r => resolve(r[STORE_ACCESS_TOKEN_KEY]))
        })
    }

    get config() {
        return new Promise((resolve) => {
            chrome.storage.local.get([STORE_CONFIG_KEY], r => resolve(r[STORE_CONFIG_KEY]))
        })
    }

    get stream() {
        return new Promise((resolve) => {
            chrome.storage.local.get([STORE_STREAM_KEY], r => resolve(r[STORE_STREAM_KEY]))
        })
    }

    get showNotification() {
        return new Promise((resolve) => {
            chrome.storage.local.get([STORE_SHOW_NOTIFICATION_KEY], r => resolve(r[STORE_SHOW_NOTIFICATION_KEY]))
        })
    }

    get lastNotifiedAt() {
        return new Promise((resolve) => {
            chrome.storage.local.get([STORE_LAST_NOTIFIED_AT_KEY], r => resolve(r[STORE_LAST_NOTIFIED_AT_KEY]))
        })
    }

    set [STORE_USER_KEY](user) {
        chrome.storage.local.set({ [STORE_USER_KEY]: user })
    }

    set [STORE_STREAM_KEY](stream) {
        chrome.storage.local.set({ [STORE_STREAM_KEY]: stream })
    }

    set [STORE_LOGGED_KEY](status) {
        chrome.storage.local.set({ [STORE_LOGGED_KEY]: status })
    }

    set [STORE_ACCESS_TOKEN_KEY](token) {
        chrome.storage.local.set({ [STORE_ACCESS_TOKEN_KEY]: token })
    }

    set [STORE_SHOW_NOTIFICATION_KEY](status) {
        chrome.storage.local.set({ [STORE_SHOW_NOTIFICATION_KEY]: status })
    }

    set [STORE_CONFIG_KEY](config) {
        chrome.storage.local.set({ [STORE_CONFIG_KEY]: config })
    }

    set [STORE_LAST_NOTIFIED_AT_KEY](date) {
        chrome.storage.local.set({ [STORE_LAST_NOTIFIED_AT_KEY]: date })
    }
}

export class State {
    constructor() {
        this._store = new Store()

        this._init()
    }

    _init() {
        this.isLogged.then(status => {
            if (status === undefined)
                this[STORE_LOGGED_KEY] = false
        })

        this.showNotification.then(status => {
            if (status === undefined)
                this[STORE_SHOW_NOTIFICATION_KEY] = true
        })
    }

    get showNotification() {
        return this._store.showNotification
    }

    get user() {
        return this._store.user
    }

    get stream() {
        return this._store.stream
    }

    get isLogged() {
        return this._store.isLogged
    }

    get accessToken() {
        return this._store.accessToken
    }

    get config() {
        return this._store.config
    }

    get lastNotifiedAt() {
        return this._store.lastNotifiedAt
    }

    set [STORE_LOGGED_KEY](status) {
        this._store[STORE_LOGGED_KEY] = status
    }

    set [STORE_USER_KEY](user) {
        this._store[STORE_USER_KEY] = user
    }

    set [STORE_STREAM_KEY](stream) {
        this._store[STORE_STREAM_KEY] = stream
    }

    set [STORE_ACCESS_TOKEN_KEY](token) {
        this._store[STORE_ACCESS_TOKEN_KEY] = token
    }

    set [STORE_SHOW_NOTIFICATION_KEY](status) {
        this._store[STORE_SHOW_NOTIFICATION_KEY] = status
    }

    set [STORE_CONFIG_KEY](config) {
        this._store[STORE_CONFIG_KEY] = config
    }

    set [STORE_LAST_NOTIFIED_AT_KEY](date) {
        this._store[STORE_LAST_NOTIFIED_AT_KEY] = date
    }
}
