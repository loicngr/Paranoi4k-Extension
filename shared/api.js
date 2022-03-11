export class Api {
    constructor(clientId, accessToken = null) {
        this._accessToken = accessToken
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

    get hasAccessToken() {
        return this._accessToken !== null
    }
}
