export const STORE_LOGGED_KEY = 'logged'
export const STORE_USER_KEY = 'user'
export const STORE_ACCESS_TOKEN_KEY = 'accessToken'
export const STORE_SHOW_NOTIFICATION_KEY = 'showNotification'

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

    get showNotification() {
        return new Promise((resolve) => {
            chrome.storage.local.get([STORE_SHOW_NOTIFICATION_KEY], r => resolve(r[STORE_SHOW_NOTIFICATION_KEY]))
        })
    }

    set [STORE_USER_KEY](user) {
        chrome.storage.local.set({ [STORE_USER_KEY]: user })
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

    get isLogged() {
        return this._store.isLogged
    }

    get accessToken() {
        return this._store.accessToken
    }

    set [STORE_LOGGED_KEY](status) {
        this._store[STORE_LOGGED_KEY] = status
    }

    set [STORE_USER_KEY](user) {
        this._store[STORE_USER_KEY] = user
    }

    set [STORE_ACCESS_TOKEN_KEY](token) {
        this._store[STORE_ACCESS_TOKEN_KEY] = token
    }

    set [STORE_SHOW_NOTIFICATION_KEY](status) {
        this._store[STORE_SHOW_NOTIFICATION_KEY] = status
    }
}
