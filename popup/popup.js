// pour la modal avec Loading
function showLoading() {
  document.querySelector("#loading").style.display = "flex";
}
function hideLoading() {
  document.querySelector("#loading").style.display = "none";
}

// la fonction exécutée lorsque la popup est chargée
function run() {
  showLoading();
  // on cache tout
  hideElem('#error');
  hideElem('#not-configured-yet');
  hideElem('#step1');
  hideElem('#step2');
  hideElem('#step3');
  hideElem('#configured');
  hideElem('#none');
  hideElem('#downloads');
  // supprime le badge en cours
  chrome.action.setBadgeText({text:""});

  // on bind les boutons
  // "Commencer"
  document.querySelector('#step1 button').addEventListener("click", () => {
    // on cache la step 1 et montre la 2
    hideElem('#step1');
    showElem('#step2');
    requestAuthorization(document.getElementById('server-url').value);
  });
  // Recommencer
  document.querySelector('#step3 button').addEventListener("click", () => {
    hideElem('#step3');
    showElem('#step1');
    // on enlève le message d'erreur
    hide('#error');
    requestAuthorization(document.getElementById('server-url').value);
  });

  // on vérifie si l'addon a déjà été configuré
  getSettings()
  .then(settings => {
    if (!settings || !settings.appToken) {
      // non pas encore configuré
      showElem('#step1');
      showElem('#not-configured-yet');
      document.getElementById('server-url').value = settings.domain || _defaultDomain;
      hideLoading();
    } else {
      // déja configuré
      showElem('#configured');
      showDownloads();
    }
  });
}
document.addEventListener('DOMContentLoaded', run);

// on demande à background.js de faire une demande d'autorisation
function requestAuthorization(domain) {
  // hide error
  let errorEl = document.querySelector('#error');
  if (errorEl) errorEl.style.display='none';
  chrome.runtime.sendMessage({ action: "requestAuthorization", data:domain })
  .then(async result => {
    if (result.error) handleError(result.error, 'requestAuthorization');
    else {
      let appToken = result.app_token;
      // résultat ?
      if (result.status === "granted") {
        await setSettings({appToken:appToken});
        hideElem('#not-configured-yet');
        showElem('#configured');
        // change le badge
        chrome.action.setBadgeBackgroundColor({color:"#008000"}); // vert
        chrome.action.setBadgeText({text:"✓"});
        // puis supprime le au bout de 5 secondes
        setTimeout(() => {
          chrome.action.setBadgeText({text:""});
        }, 5000);
        // liste les téléchargements
        showDownloads();
        return;
      }

      setSettings({appToken:''});
      hideElem('#step2');
      showElem('#step3');
      switch(result.status) {
        case "unknown": return handleError("Problème avec le app_token", 'requestAuthorization');
        case "timeout": return handleError("Vous avez mis trop de temps à valider l'application !", 'requestAuthorization');
        case "denied": return handleError("Vous avez refusé l'application… Cet addon ne pourra donc pas fonctionner !", 'requestAuthorization');
      }
    }
  })
}

function handleError(err, origin) {
  hideLoading();
  if (err instanceof Error && err.message) {
    err = err.message;
    console.log('Error Stack:', err.stack);
  }
  console.log("Erreur provenant de "+origin, err);
  let el = document.querySelector('#error');
  el.style.display='block';
  el.innerHTML = "Erreur : " + err;
  // si le token de l'application n'est plus bon, on va proposer de recommencer
  if (["Vous devez vous connecter pour accéder à cette fonction", "Erreur d'authentification de l'application", "Erreur d’authentification de l’application"].includes(err)) {
    if (_timeout) clearTimeout(_timeout); // stop showDownloads()
    getSettings().then(settings => document.getElementById('server-url').value = settings.domain || _defaultDomain);
    showElem('#step1');
    showElem('#not-configured-yet');
    hideElem('#configured');
  }
}

// permet de cacher un élément en utilisant le selector 'id'
function hideElem(id) {
  document.querySelector(id).style.display = 'none';
}
// permet de montrer un élément en utilisant le selector 'id', et 'type' est 'block' par défaut
function showElem(id, type) {
  document.querySelector(id).style.display = type||'block';
}

/* +++++++++++++++++++++++++++++++++
   return filename from URL
*/
function getFilenameOfURL(url) {
  var flna = url.split("/");
  var fileURL = flna[flna.length-1];

  return(fileURL);
}

var _timeout;
async function showDownloads() {
  // pour éviter trop d'appels à cette fonction
  if (_timeout) {
    clearTimeout(_timeout);
    _timeout=null;
  }
  try {
    // on demande à background.js de fournir la liste des téléchargements en cours
    let downloads = await new Promise((promiseOK, promiseKO) => {
      chrome.runtime.sendMessage({ action: "getListDownloads" }, (response) => {
        if (response.downloads) promiseOK(response.downloads);
        else if (response.error) promiseKO(response.error);
        else promiseKO("Erreur inconnue: " + JSON.stringify(response));
      });
    });

    // on lance watchQueue aussi
    chrome.runtime.sendMessage({ action: "watchQueue" });

    hideLoading();
    if (!downloads || downloads.length === 0) {
      showElem('#none');
      hideElem('#downloads');
    } else {
      hideElem('#none');
      showElem('#downloads');
      let html = [];
      downloads.forEach(res => {
        let status = "Inconnu";
        let filename = res.name;
        switch(res.status) {
          case "stopped": status="Pause"; break;
          case "queued": status="En Attente"; filename = getFilenameOfURL(res.name) ; break;
          case "starting": status="Démarrage"; break;
          case "downloading": status="Téléchargement"; break;
          case "stopping": status="Arrêt en cours"; break;
          case "error": status="Erreur"; break;
          case "done": status="✓ Terminé"; break;
          case "checking": status="Vérification"; break;
          case "repairing": status="Réparation"; break;
          case "extracting": status="Décompression"; break;
          case "seeding": status="✓ Terminé"; break;
          case "retry": status="Nouvel Essai"; break;
        }
        html.push(`<tr>
          <td class="torrent-name" title="${res.name}" style="border-bottom-width:0;">${filename}</td>
          <td style="border-bottom-width:0;white-space:nowrap">${status==='Téléchargement'?'<div class="donut"><div class="donut-spinner" style="border-width:2px"></div><span>Téléchargement</span></div>':status}</td>
          <td style="border-bottom-width:0;white-space:nowrap">${Math.round(res.rx_pct/100)}%
        </tr>
        <tr>
          <td colspan="3" style="text-align:right;white-space:nowrap;">
            ${res.status === 'stopped' ? '<button data-id="' + res.id + '" type="button" class="btn-play"><svg xmlns="http://www.w3.org/2000/svg" height="17px" viewBox="http://www.w3.org/2000/svg" width="17px" fill="blue"><path d="m384-312 264-168-264-168v336Zm96.28 216Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg> <span>Reprendre</span></button>' : '<button data-id="' + res.id +'" type="button" class="btn-stop"><svg xmlns="http://www.w3.org/2000/svg" height="17px" viewBox="http://www.w3.org/2000/svg" width="17px" fill="blue"><path d="M360-336h72v-288h-72v288Zm168 0h72v-288h-72v288ZM480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg> <span>Pause</span></button>'}
            <button data-id="${res.id}" type="button" class="btn-end-erase"><svg xmlns="http://www.w3.org/2000/svg" height="17px" viewBox="http://www.w3.org/2000/svg" width="17px" fill="red"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg> <span>Supprimer Tâche & Fichiers</span></button>
            <button data-id="${res.id}" type="button" class="btn-end"><svg xmlns="http://www.w3.org/2000/svg" height="17px" viewBox="http://www.w3.org/2000/svg" width="17px" fill="green"><path d="M384-357 192-549l51-51 141 141 333-333 51 51-384 384ZM240-192v-72h480v72H240Z"/></svg><span>Supprimer Tâche</span></button>
          </td>
        </tr>`);
      });
      document.querySelector('#downloads tbody').innerHTML = html.join('\n');

      // les boutons pour reprendre
      let btnPlay = document.querySelectorAll('.btn-play');
      for (let i=0; i<btnPlay.length; i++) {
        btnPlay[i].addEventListener("click", async event => {
          console.log("Reprendre", event.currentTarget.dataset.id);
          updateTaskStatus(event.currentTarget.dataset.id, "downloading");
        });
      }
      // les boutons pour mettre en pause
      let btnPause = document.querySelectorAll('.btn-stop');
      for (let i=0; i<btnPause.length; i++) {
        btnPause[i].addEventListener("click", async event => {
          updateTaskStatus(event.currentTarget.dataset.id, "stopped");
        });
      }
      // les boutons pour fin de tâche
      let btnEnd = document.querySelectorAll('.btn-end');
      for (let i=0; i<btnEnd.length; i++) {
        btnEnd[i].addEventListener("click", async event => {
          updateTaskStatus(event.currentTarget.dataset.id, "end");
        });
      }
      let btnEndErase = document.querySelectorAll('.btn-end-erase');
      for (let i = 0; i < btnEndErase.length; i++) {
        btnEndErase[i].addEventListener("click", async event => {
          updateTaskStatus(event.currentTarget.dataset.id, "end-erase");
        });
      }
    }
    _timeout = setTimeout(() => showDownloads(), 3000);
  } catch(err) {
    handleError(err, 'showDownloads');
  }
}

// permet de mettre à jour le status d'une tâche
async function updateTaskStatus(taskId, status) {
  showLoading();

  try {
    // on demande à background.js de le faire
    let data = await new Promise((promiseOK, promiseKO) => {
      chrome.runtime.sendMessage({ action: "updateTaskStatus", data:JSON.stringify({taskId, status}) }, (response) => {
        if (response.error) promiseKO(response.error);
        else promiseOK(response);
      });
    });
  } finally {
    showDownloads();
  }
}

function serializeFormData(formData) {
  const formDataEntries = [];
  formData.forEach((value, key) => {
    // Si la valeur est un fichier, on la transforme en base64 pour l'envoyer comme chaîne
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = function (event) {
        formDataEntries.push({ key, value: event.target.result }); // base64 du fichier
      };
      reader.readAsDataURL(value); // Convertit le fichier en base64
    } else {
      formDataEntries.push({ key, value });
    }
  });
  return formDataEntries; // retourne les entrées sous forme d'un tableau d'objets
}

// lorsqu'on sélectionne un fichier local
document.getElementById("file_trigger").addEventListener("click", () => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup/file_download.html"),
    type: "popup",
    width: 400,
    height: 300
  })
});

// lorsqu'on clique sur le bouton "paste" pour coller des URLs
document.getElementById("paste_trigger").addEventListener("click", async () => {
  try {
    // 1. Lecture du texte brut
    const text = await navigator.clipboard.readText();

    // 2. Extraction des URLs
    // On utilise un groupe ( ... | ... ) pour dire "soit http(s)://, soit magnet:"
    // 1. (?:https?:\/\/|magnet:) -> Cherche "http://" OU "https://" OU "magnet:"
    // 2. [^\s]+ -> Prend tout ce qui suit jusqu'au prochain espace
    const urlRegex = /((?:https?:\/\/|magnet:)[^\s]+)/g;

    // .match retourne un tableau des URLs trouvées ou null si rien n'est trouvé
    const matches = text.match(urlRegex) || [];

    // 3. Supprimer les doublons et nettoyer
    // On utilise Set pour l'unicité et on rejoint par des sauts de ligne
    const uniqueUrls = [...new Set(matches)];
    const cleanContent = uniqueUrls.join('\n');

    // Si aucune URL n'a été trouvée, on peut mettre un message par défaut ou vide
    const contentToSave = cleanContent || "Aucune URL détectée dans le presse-papiers.";

    // 4. Sauvegarde et ouverture de la popup
    chrome.storage.local.set({ clipboardCache: contentToSave }, () => {
      // ouvrir la fenêtre popup qui affichera le contenu
      chrome.windows.create({
        url: chrome.runtime.getURL("popup/clipboard.html"),
        type: "popup",
        width: 400,
        height: 300
      });
    });
  } catch (err) {
    console.error("Lecture du presse-papiers impossible:", err);
    // ouvrir la fenêtre même si la lecture a échoué (clipboard.html affichera un message)
    chrome.storage.local.remove("clipboardCache", () => {
      chrome.windows.create({
        url: chrome.runtime.getURL("popup/clipboard.html"),
        type: "popup",
        width: 400,
        height: 300
      });
    });
  }
});
