function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    showTabContextMenuCopyUrls: document.querySelector("#showTabContextMenuCopyUrls").checked,
    openUrlsAlreadyOpened: document.querySelector("#openUrlsAlreadyOpened").checked,
  });
  browser.runtime.sendMessage({});
}

function restoreOptions() {
  browser.storage.sync.get().then(settings => {
    let showContextMenu = ('showTabContextMenuCopyUrls' in settings) ? settings.showTabContextMenuCopyUrls : true;
    let openTabs = ('openUrlsAlreadyOpened' in settings) ? settings.openUrlsAlreadyOpened : false;
    document.querySelector("#showTabContextMenuCopyUrls").checked = showContextMenu;
    document.querySelector("#openUrlsAlreadyOpened").checked = openTabs;
  }, error => {
    console.log(`Error: ${error}`);
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
