function extractTokenFromUrl (url) {
    const rawAccessToken = url.substring(url.indexOf('access_token=') + 13)
    return rawAccessToken.substring(0, rawAccessToken.indexOf('&'))
}

class Api {
    constructor(clientId) {
        this._accessToken = null
        this._clientId = clientId
        this._headers = new Headers()
        this._opts = {}
    }

    set accessToken (accessToken) {
        this._accessToken = accessToken
    }

    _initHeaders () {
        this._headers.append("Content-Type", "application/json")
        this._headers.append("Authorization", 'Bearer ' + this._accessToken)
        this._headers.append("Client-ID", this._clientId)
    }

    _initOpts (method = 'GET') {
        this._opts = {
            method,
            headers: this._headers,
            mode: 'cors',
            cache: 'default'
        }
    }

    init () {
        this._initHeaders()
        this._initOpts()
    }

    get clientId () {
        return this._clientId
    }

    get user () {
        return new Promise((resolve, reject) => {
            fetch('https://api.twitch.tv/helix/users', this._opts)
                .then(r => r.json())
                .then(resolve)
                .catch(reject)
        })
    }
}

class Flow {
    constructor() {
        this._redirectUrl = chrome.identity.getRedirectURL()
    }

    launch (clientID, callBack) {
        const scopes = []
        let authURL = "https://id.twitch.tv/oauth2/authorize"
        authURL += `?client_id=${clientID}`
        authURL += `&response_type=token`
        authURL += `&redirect_uri=${encodeURIComponent(this._redirectUrl)}`
        authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`

        chrome.identity.launchWebAuthFlow({
            url: authURL,
            interactive: true
        }, callBack)
    }
}

const api = new Api('applicationClientId')
const flow = new Flow()

flow.launch(api.clientId, (flowRedirectUrl) => {
    api.accessToken = extractTokenFromUrl(flowRedirectUrl)
    api.init()
    api.user
        .then(r => console.log(r.data))
        .catch(console.error)
})
