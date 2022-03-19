export function extractTokenFromUrl(url) {
    const rawAccessToken = url.substring(url.indexOf('access_token=') + 13)
    return rawAccessToken.substring(0, rawAccessToken.indexOf('&'))
}

export async function loadFile(path) {
    const response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET',
    })

    return response.json()
}

/**
 * With Manifest version 3 we can't play audio simply in service worker,
 * so i make a simple function for create fake window and play sound in it
 *
 * @returns {Promise<void>}
 */
export async function createAudioWindow () {
    browser.windows.create({
        type: 'popup',
        focused: false,
        state: 'minimized',
        url: browser.runtime.getURL('audio.html')
    }, (newWindow) => {
        setTimeout(async () => {
            await browser.windows.remove(newWindow.id)
        }, 3500)
    })
}
