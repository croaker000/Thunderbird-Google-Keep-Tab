const is_release = true;
var browser = browser;
var myTitle = "Google Keep";
var myurl = "https://keep.google.com";
var iconPath = "skin/google_keep_icon.svg";
var spacesToolbarButtonId = "fom_gk_" + (Math.floor(Math.random() * 99999999)).toString();
var isSpacesToolbarButtonOn = false;

function debug_msg(message){
  if(is_release){
    return;
  }
  console.debug("Google-Keep-Tab: " + message);
}

function initialize() {
   debug_msg("Loading");
   createContextMenu();
   setSpacesToolbarButton();

   if ("browserAction" in browser) {
     debug_msg("Has permision for browserAction");

     browser.browserAction.onClicked.addListener(async () => {
       openNewTab(myurl);
     });
   } else {
     openNewTab(myurl);
   }

   debug_msg("Loaded");
}

function getButtonProperties() {
    return {
        defaultIcons: {
            16: iconPath,
            32: iconPath
        },
        title: myTitle,
        url: myurl
    };
}

function createContextMenu() {
    browser.menus.create({
        id: "contextMenuEntry",
        title: myTitle,
        type: "normal",
        contexts: ["browser_action"],
        onclick: openNewTab
    }, console.log("Google Keep Web context menu created."));
}

function setSpacesToolbarButton() {
    var getWaInThMode = browser.storage.local.get("fom-gk-spaces-toolbar");
    getWaInThMode.then(function (storedValue) {
        if (storedValue["fom-gk-spaces-toolbar"] === "true") {
            if (isSpacesToolbarButtonOn) {
                refreshSpacesToolbar();
            }
            else {
                addSpacesToolbarButton();
            }
            return;
        }
        if (storedValue["fom-gk-spaces-toolbar"] === "false") {
            if (isSpacesToolbarButtonOn) {
                removeSpacesToolbarButton();
            }
            return;
        }
        browser.storage.local.set({"fom-gk-spaces-toolbar":"true"});
        addSpacesToolbarButton();
    });
}

function addSpacesToolbarButton() {
    try {
        browser.spacesToolbar.addButton(spacesToolbarButtonId, getButtonProperties());
        isSpacesToolbarButtonOn = true;
        console.log("Google Keep Web spaces toolbar menu created.");
    }
    catch (e) {
        console.log("spacesToolbar is not defined...\n", e);
    }
}
function removeSpacesToolbarButton() {
    try {
        browser.spacesToolbar.removeButton(spacesToolbarButtonId);
        isSpacesToolbarButtonOn = false;
        console.log("Google Keep Web spaces toolbar menu removed.");
    }
    catch (e) {
        console.log("spacesToolbar is not defined...\n", e);
    }
}
function refreshSpacesToolbar() {
    try {
        if (isSpacesToolbarButtonOn) {
            browser.spacesToolbar.updateButton(spacesToolbarButtonId, getButtonProperties());
        }
        console.log("Google Keep Web spaces toolbar menu refreshed.");
    }
    catch (e) {
        console.log("spacesToolbar is not defined...\n", e);
    }
}

function openNewTab(tab_url){
  debug_msg(`Opening tab with url: ${tab_url}`);
  browser.tabs.create({ url: tab_url });
}

initialize();
