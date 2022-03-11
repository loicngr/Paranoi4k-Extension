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
