let resetBtn = document.querySelector('.reset');
let openBtn = document.querySelector('.open');
let copyBtn = document.querySelector('.copy');
let saveBtn = document.querySelector('.save');
let moreBtn = document.querySelector('.more');
let moreBtnsDiv = document.querySelector('.moreBtns');
let urlText = document.querySelector('.urlText');
let sortAscBtn = document.querySelector('.sortAsc');
let sortDescBtn = document.querySelector('.sortDesc');

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

function save(){
  let dl = document.createElement('a');

  dl.download = 'urls-list-' + Date.now() + '.txt'; // filename
  dl.href = window.URL.createObjectURL(
    new Blob([urlText.value], {type: 'text/plain'}) // file content
  );
  dl.onclick = event => document.body.removeChild(event.target);
  dl.style.display = 'none';
  document.body.appendChild(dl);
  dl.click();
}

function more() {
  if (moreBtnsDiv.classList.contains('hide')) {
    moreBtnsDiv.classList.remove('hide');
  } else {
    moreBtnsDiv.classList.add('hide');
  }
}

function sort(desc = false) {
  let urls = urlText.value.split("\n");
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
  urlText.value = cleanUrls.join("\n") + "\n";
}

function sortAsc() {
  sort(false);
}

function sortDesc() {
  sort(true);
}

document.addEventListener("DOMContentLoaded", listTabs);
resetBtn.addEventListener("click", listTabs);
openBtn.addEventListener("click", open);
copyBtn.addEventListener("click", copy);
saveBtn.addEventListener("click", save);
moreBtn.addEventListener("click", more);
sortAscBtn.addEventListener("click", sortAsc);
sortDescBtn.addEventListener("click", sortDesc);
