class Flow {
    constructor() {
        this._redirectUrl = chrome.identity.getRedirectURL()
    }

    launch(clientID, callBack) {
        const scopes = []
        let authURL = "https://id.twitch.tv/oauth2/authorize"
        authURL += `?client_id=${clientID}`
        authURL += `&response_type=token`
        authURL += `&redirect_uri=${encodeURIComponent(this._redirectUrl)}`
        authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`

        chrome.identity.launchWebAuthFlow({
            url: authURL, interactive: true
        }, callBack)
    }
}

export { Flow }
