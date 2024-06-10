let resetBtn = document.querySelector('.reset');
let openBtn = document.querySelector('.open');
let copyBtn = document.querySelector('.copy');
let saveBtn = document.querySelector('.save');
let sortAscBtn = document.querySelector('.sortAsc');
let sortDescBtn = document.querySelector('.sortDesc');
let resetFilterBtn = document.querySelector('.resetFilter');
let urlText = document.querySelector('.urlText');
let filterInput = document.querySelector('.filterInput');
let filterWarning = document.querySelector('.filterWarning');

let alwaysOpenAllTabs = false;
let discardTabs = false;
browser.storage.sync.get().then(settings => {
  alwaysOpenAllTabs = ('openUrlsAlreadyOpened' in settings) ? settings.openUrlsAlreadyOpened : false;
  discardTabs = ('openTabsAsDiscarded' in settings) ? settings.openTabsAsDiscarded : false;
}, error => {
  console.log(`Error: ${error}`);
});

function listTabs() {
  disableFilterMode();

  browser.tabs.query({currentWindow: true}).then((tabs) => {
    let urls = '';
    for (let tab of tabs) {
      urls += tab.url + '\n';
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
    let newUrls = urlText.value.split('\n');
    for (let url of newUrls) {
      // only open if new url is not empty string and is not already opened
      if (url !== '' && (alwaysOpenAllTabs || currentUrls.indexOf(url) < 0)) {
        // prefix "http://" if it is not an url already
        if (url.indexOf('://') < 0) {
          url = 'http://' + url;
        }
        browser.tabs.create({
          active: false,
          discarded: discardTabs,
          url: url
        });
      }
    }
  });
}

function copy() {
  let tmp = urlText.value;
  urlText.select();
  document.execCommand('Copy');

  // workaround to not have text selected after button click
  urlText.value = '';
  urlText.value = tmp;
}

function save() {
  let d = new Date();
  let year = d.getFullYear();
  let month = ('0' + (d.getMonth() + 1)).slice(-2);
  let day = ('0' + d.getDate()).slice(-2);
  let hour = ('0' + d.getHours()).slice(-2);
  let min = ('0' + d.getMinutes()).slice(-2);
  let sec = ('0' + d.getSeconds()).slice(-2);
  let dateString = [year, month, day, hour, min, sec].join('-');

  let dl = document.createElement('a');

  dl.download = 'urls-list-' + dateString + '.txt'; // filename
  dl.href = window.URL.createObjectURL(
    new Blob([urlText.value], {type: 'text/plain'}) // file content
  );
  dl.onclick = event => document.body.removeChild(event.target);
  dl.style.display = 'none';
  document.body.appendChild(dl);
  dl.click();
}

function sort(desc = false) {
  let urls = urlText.value.split('\n');
  let cleanUrls = [];
  for (let i in urls) {
    let clean = urls[i].trim();
    if (clean !== '') {
      cleanUrls.push(clean);
    }
  }
  cleanUrls.sort();
  if (desc) {
    cleanUrls.reverse();
  }
  urlText.value = cleanUrls.join('\n') + '\n';
}

function sortAsc() {
  sort(false);
}

function sortDesc() {
  sort(true);
}

let filterBackup = '';
let filterMode = false;

function enableFilterMode() {
  if (!filterMode) {
    filterBackup = urlText.value;
    urlText.readOnly = true;
    urlText.classList.add("urlTextFilterMode")
    filterWarning.classList.remove("hide");
    filterMode = true;
  }
}

function disableFilterMode() {
  if (filterMode) {
    urlText.value = filterBackup;
    urlText.readOnly = false;
    urlText.classList.remove("urlTextFilterMode");
    filterWarning.classList.add("hide");
    filterInput.classList.remove("filterInputError");
    filterInput.value = '';
    filterMode = false;
  }
}

function filter(e) {
  let val = e.target.value;
  filterInput.classList.remove("filterInputError");
  if (val !== '') {
    enableFilterMode();
    try {
      let re = new RegExp(val, 'i');
      let urls = filterBackup.split('\n');
      let filteredUrls = [];
      for (let i in urls) {
        let clean = urls[i].trim();
        if (clean !== '' && re.test(clean)) {
          filteredUrls.push(clean);
        }
      }
      urlText.value = filteredUrls.join('\n') + '\n';
    } catch (ex) {
      filterInput.classList.add("filterInputError");
    }
  } else {
    disableFilterMode();
  }
}

function resetFilter() {
  disableFilterMode();
}

document.addEventListener('DOMContentLoaded', listTabs);
resetBtn.addEventListener('click', listTabs);
openBtn.addEventListener('click', open);
copyBtn.addEventListener('click', copy);
saveBtn.addEventListener('click', save);
sortAscBtn.addEventListener('click', sortAsc);
sortDescBtn.addEventListener('click', sortDesc);
resetFilterBtn.addEventListener('click', resetFilter);
filterInput.addEventListener('input', filter);
