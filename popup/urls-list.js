let resetBtn = document.querySelector('.reset');
let openBtn = document.querySelector('.open');
let copyBtn = document.querySelector('.copy');
let urlText = document.querySelector('.urlText');

function listTabs() {
  browser.tabs.query({currentWindow: true}).then((tabs) => {
    let urls = '';
    for (let tab of tabs) {
      urls += tab.url + "\n";
    }
    urlText.value = urls;
  });
}

function open() {
  browser.tabs.query({currentWindow: true}).then((tabs) => {
    // save list of current urls
    let currentUrls = [];
    for (let tab of tabs) {
      currentUrls.push(tab.url);
    }
    let newUrls = urlText.value.split("\n");
    for (let url of newUrls) {
      // only open if new url is not empty string and is not already opened
      if (url !== "" && currentUrls.indexOf(url) < 0) {
        // prefix "http://" if it is not an url already
        if (url.indexOf("://") < 0) {
          url = "http://" + url;
        }
        browser.tabs.create({url: url});
      }
    }
  });
}

function copy() {
  let tmp = urlText.value;
  urlText.select();
  document.execCommand("Copy");

  // workaround to not have text selected after button click
  urlText.value = "";
  urlText.value = tmp;
}

document.addEventListener("DOMContentLoaded", listTabs);
resetBtn.addEventListener("click", listTabs);
openBtn.addEventListener("click", open);
copyBtn.addEventListener("click", copy);
