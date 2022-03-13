const modelNotification = (opt) => ({
    title: (chrome.runtime.getManifest()).name,
    iconUrl: '/icons/icon48.png',
    priority: 2,
    type: 'basic',
    ...opt
})

export function launchNotification (id, opt) {
    chrome.notifications.create(id, { ...modelNotification(opt) })
}
