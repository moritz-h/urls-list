function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    showTabContextMenuCopyUrls: document.querySelector("#showTabContextMenuCopyUrls").checked,
    openUrlsAlreadyOpened: document.querySelector("#openUrlsAlreadyOpened").checked,
    openTabsAsDiscarded: document.querySelector("#openTabsAsDiscarded").checked,
  });
  browser.runtime.sendMessage({});
}

function restoreOptions() {
  browser.storage.sync.get().then(settings => {
    let showContextMenu = ('showTabContextMenuCopyUrls' in settings) ? settings.showTabContextMenuCopyUrls : true;
    let openTabs = ('openUrlsAlreadyOpened' in settings) ? settings.openUrlsAlreadyOpened : false;
    let discardTabs = ('openTabsAsDiscarded' in settings) ? settings.openTabsAsDiscarded : false;
    document.querySelector("#showTabContextMenuCopyUrls").checked = showContextMenu;
    document.querySelector("#openUrlsAlreadyOpened").checked = openTabs;
    document.querySelector("#openTabsAsDiscarded").checked = discardTabs;
  }, error => {
    console.log(`Error: ${error}`);
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
