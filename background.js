if (!window.chrome) {
    browser.contextMenus.create({
      id: "url-list-copy-urls",
      title: "Copy URLs (all tabs)",
      contexts: ["tab"],
    });
}
browser.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "url-list-copy-urls") {
    browser.tabs.query({currentWindow: true}).then((tabs) => {
      // Use active tab for copy to clipboard, so it is possible to open
      // the context menu on inactive tabs. Save clicked tab as fallback.
      let activeTabId = tab.id;
      let urls = '';
      for (let tab of tabs) {
        urls += tab.url + "\r\n";
        if (tab.active) {
          activeTabId = tab.id;
        }
      }

      // example source: https://github.com/mdn/webextensions-examples/tree/master/context-menu-copy-link-with-types

      // The example will show how data can be copied, but since background
      // pages cannot directly write to the clipboard, we will run a content
      // script that copies the actual content.

      // clipboard-helper.js defines function copyToClipboard.
      const code = "copyToClipboard(" + JSON.stringify(urls) + ");";

      browser.tabs.executeScript({
        code: "typeof copyToClipboard === 'function';",
      }).then(function (results) {
        // The content script's last expression will be true if the function
        // has been defined. If this is not the case, then we need to run
        // clipboard-helper.js to define function copyToClipboard.
        if (!results || results[0] !== true) {
          return browser.tabs.executeScript(activeTabId, {
            file: "clipboard-helper.js",
          });
        }
      }).then(function () {
        return browser.tabs.executeScript(activeTabId, {
          code,
        });
      }).catch(function (error) {
        // This could happen if the extension is not allowed to run code in
        // the page, for example if the tab is a privileged page.
        console.error("Failed to copy text: " + error);
        notifyError();
      });
    });
  }
});

function notifyError() {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/error.svg"),
    "title": "Error!",
    "message": "Cannot write to clipboard on settings tab!"
  });
}
