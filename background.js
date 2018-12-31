function initContextMenu() {
  browser.storage.sync.get().then(settings => {
    let showEntry = ('showTabContextMenuCopyUrls' in settings) ? settings.showTabContextMenuCopyUrls : true;
    if (showEntry) {
      browser.contextMenus.create({
        id: "url-list-copy-urls",
        title: "Copy URLs (all tabs)",
        contexts: ["tab"],
      });
      browser.contextMenus.onClicked.addListener(onContextMenuClick);
    }
  }, error => {
    console.log(`Error: ${error}`);
  });
}

function clearContextMenu() {
  browser.contextMenus.onClicked.removeListener(onContextMenuClick);
  browser.contextMenus.remove('url-list-copy-urls');
}

function onContextMenuClick(info, tab) {
  if (info.menuItemId === "url-list-copy-urls") {
    browser.tabs.query({currentWindow: true}).then((tabs) => {
      let urls = tabs.map(tab => tab.url).join('\r\n');

      navigator.clipboard.writeText(urls).then(() => {
        // success
      }, () => {
        notifyError();
      });
    });
  }
}

function notifyError() {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/error.svg"),
    "title": "Error!",
    "message": "Writing to clipboard is not possible!"
  });
}

function settingsChanged(message) {
  clearContextMenu();
  initContextMenu();
}

browser.runtime.onMessage.addListener(settingsChanged);
initContextMenu();
