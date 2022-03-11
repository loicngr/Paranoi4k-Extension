import {DATA_AUTH_REQUIRED, MSG_GET_CONFIG} from "./shared/const.js";
import {Api} from "./shared/api.js";
import {State, STORE_ACCESS_TOKEN_KEY, STORE_LOGGED_KEY, STORE_USER_KEY} from "./shared/state.js";
import {Flow} from "./shared/flow.js";
import {extractTokenFromUrl} from "./shared/utils.js";

const state = new State()
const flow = new Flow()
let config = null
let api = null

async function App() {
    api = api ?? new Api(config.auth.clientId, await state.accessToken)
    const userIsLogged = await state.isLogged

    if (!userIsLogged && confirm(DATA_AUTH_REQUIRED)) {
        flow.launch(api.clientId, async (flowRedirectUrl) => {
            const accessToken = extractTokenFromUrl(flowRedirectUrl)
            api.accessToken = accessToken
            state[STORE_ACCESS_TOKEN_KEY] = accessToken

            api.init()
            api.user
                .then(async r => {
                    state[STORE_USER_KEY] = r.data[0]
                    state[STORE_LOGGED_KEY] = true

                    await App()
                })
                .catch(console.error)
        })

        return
    }

    if (await state.isLogged) {
        console.log(await state.user)
    }
}

chrome.runtime.sendMessage({type: MSG_GET_CONFIG}, async (response) => {
    config = response.config
    await App()
});
