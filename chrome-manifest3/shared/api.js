export class Api {
    constructor(clientId, accessToken = null, streamerUID = null) {
        this._accessToken = accessToken
        this._clientId = clientId
        this._streamerUID = streamerUID
        this._headers = new Headers()
        this._opts = {}
    }

    set accessToken (accessToken) {
        this._accessToken = accessToken
        this._headers.set('Authorization', 'Bearer ' + this._accessToken)
        this._opts.headers = this._headers
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

    set streamerUID(streamerUID) {
        this._streamerUID = streamerUID
    }

    get clientId () {
        return this._clientId
    }

    get stream () {
        if (!this._streamerUID) {
            throw new Error('streamerUID must be define in config.json file')
        }

        return new Promise((resolve, reject) => {
            fetch(`https://api.twitch.tv/helix/streams?user_id=${this._streamerUID}`, this._opts)
                .then(r => r.json())
                .then(resolve)
                .catch(reject)
        })
    }

    get user () {
        if (!this._clientId) {
            throw new Error('clientID must be define in config.json file')
        }

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
