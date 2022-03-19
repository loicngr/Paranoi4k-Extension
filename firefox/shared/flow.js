class Flow {
    constructor() {
        this._redirectUrl = browser.identity.getRedirectURL()
    }

    async launch(clientID) {
        const scopes = []
        let authURL = "https://id.twitch.tv/oauth2/authorize"
        authURL += `?client_id=${clientID}`
        authURL += `&response_type=token`
        authURL += `&redirect_uri=${encodeURIComponent(this._redirectUrl)}`
        authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`

        const authorizing = await browser.identity.launchWebAuthFlow({
            url: authURL, interactive: true
        })

        return authorizing
    }
}

export { Flow }
