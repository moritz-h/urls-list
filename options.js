function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    showTabContextMenuCopyUrls: document.querySelector("#showTabContextMenuCopyUrls").checked
  });
  browser.runtime.sendMessage({});
}

function restoreOptions() {
  browser.storage.sync.get().then(settings => {
    let showEntry = ('showTabContextMenuCopyUrls' in settings) ? settings.showTabContextMenuCopyUrls : true;
    document.querySelector("#showTabContextMenuCopyUrls").checked = showEntry;
  }, error => {
    console.log(`Error: ${error}`);
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
