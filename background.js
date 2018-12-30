browser.contextMenus.create({
  id: "url-list-copy-urls",
  title: "Copy URLs (all tabs)",
  contexts: ["tab"],
});
browser.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "url-list-copy-urls") {
    browser.tabs.query({currentWindow: true}).then((tabs) => {
      let urls = tabs.map(tab => tab.url).join('\r\n');

      navigator.clipboard.writeText(urls).then(function() {
        // success
      }, function() {
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
    "message": "Writing to clipboard is not possible!"
  });
}
