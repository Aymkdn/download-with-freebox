/**
 * Crée un context (clic droit de la souris) pour les liens
 * Documentation : https://developer.chrome.com/apps/contextMenus
 *
 * @param {Object} options:
 *   @param  {String} options.id:       "copy-link-to-clipboard"                      Unique ID utilisé pour identifier ce menu
 *   @param  {String} options.title:    chrome.i18n.getMessage("menuContextSendLink") Ce qui va apparaitre dans le menu (voir `./_locales/[lang]/`)
 *   @param  {Array} options.contexts: ["link"]                                       À quel contexte le menu doit apparaitre (ici pour les liens)
 * @param  {Function} callback:                                                       Un callback pour avertir des erreurs
 */
chrome.contextMenus.create({
  id: "copy-link-to-clipboard",
  title: chrome.i18n.getMessage("menuContextSendLink"),
  contexts: ["link"],
}, () => {
  if (chrome.runtime.lastError) {
    console.log(`Error: ${chrome.runtime.lastError}`);
  } else {
    // on reset le badge de l'extension
    chrome.action.setBadgeText({text:""});
    // on vérifie si l'addon est configuré
    chrome.storage.local.get(['settings'], function(res) {
      if (!res.settings || !res.settings.appToken) {
        chrome.action.setBadgeBackgroundColor({color:"#D32F2F"}); // red darken-1
        chrome.action.setBadgeText({text:"❕"});
      } else {
        _settings = res.settings;
      }
    });
  }
});


/**
 * L'action qui découle du clic sur le menu
 */
chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === "copy-link-to-clipboard") {
    const safeUrl = escapeHTML(info.linkUrl);
    sendURL(safeUrl);
  }
});

// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str) {
  // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
  // Most often this is not the case though.
  return String(str)
         .replace(/&/g, "&amp;")
         .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
         .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// quand le storage de l'extension change, on veut appliquer les changements à nos variables locales
chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(['settings'], function(res) {
    _settings = res.settings;
  });
});

/**
 * Pour gérer les erreurs : on va afficher un badge "Err" et envoyer une alert
 *
 * @param  {String} err Le message d'erreur
 */
function handleError(err) {
  chrome.action.setBadgeBackgroundColor({color:"#EF9A9A"}); // rouge
  chrome.action.setBadgeText({text:"Err"});
  console.log(err);
}

/**
 * Cette fonction est appelée lorsque l'utilisateur envoie un lien vers l'extension
 *
 * @param {String} uri: L'URL à envoyer à la Freebox
 */
async function sendURL(uri) {
  // on montre un badge pour indiquer que la demande est bien prise en compte
  chrome.action.setBadgeBackgroundColor({color:"#FFF"}); // blanc
  chrome.action.setBadgeText({text:"⏳"}); // 🔄

  // on ouvre une session pour avoir un token
  let res = await openSession();
  if (!res) return;

  let baseUrl = await getBaseUrl();
  // on envoie le lien dans la queue
  let response = await fetch(baseUrl+"/downloads/add", {
    credentials:'omit',
    headers:{
      "X-Fbx-App-Auth": _sessionToken,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    method:"POST",
    body: "download_url=" + encodeURIComponent(uri) /*+ "&download_dir=" TODO: gérer le répertoire */
  });
  let data = await response.json();

  // erreur ?
  if (!data.success) {
    handleError(data.msg);
    return;
  }
  // on affiche un +1
  chrome.action.setBadgeBackgroundColor({color:"#008000"}); // vert
  chrome.action.setBadgeText({text:"+1"});
  watchQueue();
}

// Va permettre de surveiller la liste des téléchargements et de prévenir quand c'est terminé
async function watchQueue() {
  let downloads = await getListDownloads();
  let inProgress = downloads.filter(res => !['stopped', 'stopping', 'error', 'done', 'seeding'].includes(res.status));
  // si tous les téléchargements sont terminés
  if (inProgress.length === 0 && downloads.length > 0) {
    chrome.action.setBadgeBackgroundColor({color:"#008000"}); // vert
    chrome.action.setBadgeText({text:"✓"});
  } else if (inProgress.length > 0) {
    // on affiche le nombre de téléchargement en cours badge
    chrome.action.setBadgeBackgroundColor({color:"#48D1CC"}); // medium turquoise
    chrome.action.setBadgeText({text:"▼"+inProgress.length});
    // et on relance dans 3 secondes
    await timeout(3000);
    watchQueue();
  }
}
