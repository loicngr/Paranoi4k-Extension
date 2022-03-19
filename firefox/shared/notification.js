const modelNotification = (opt) => ({
    title: (browser.runtime.getManifest()).name,
    iconUrl: '/icons/icon48.png',
    priority: 2,
    type: 'basic',
    ...opt
})

export function launchNotification (id, opt) {
    browser.notifications.create(id, { ...modelNotification(opt) })
}
