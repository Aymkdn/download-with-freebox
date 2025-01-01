var _defaultDomain = "http://mafreebox.freebox.fr";

// pour enregistrer les settings
function setSettings(settings) {
  // on demande à background.js d'enregistrer les settings
  return new Promise(promiseOK => {
    chrome.runtime.sendMessage({ action: "setSettings", data:settings }, () => promiseOK());
  });
}

// pour récupérer les settings
function getSettings() {
  // on demande à background.js de nous envoyer les settings
  return new Promise(promiseOK => {
    chrome.runtime.sendMessage({ action: "getSettings" }, settings => promiseOK(settings));
  });
}
