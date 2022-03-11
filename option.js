import {State, STORE_SHOW_NOTIFICATION_KEY} from "./shared/state.js";

const DOM_BTN_TOGGLE_NOTIFICATION_ID = 'toggleNotification'
const DOM_BTN_TOGGLE_NOTIFICATION = () => document.getElementById(DOM_BTN_TOGGLE_NOTIFICATION_ID)

let state = new State()

DOM_BTN_TOGGLE_NOTIFICATION().addEventListener('click', async () => {
    const newValue = !(await state.showNotification)
    console.log(newValue)
    state[STORE_SHOW_NOTIFICATION_KEY] = newValue

    alert(`Les notifications sont ${newValue ? 'activés' : 'désactivés'}`)
})
