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
  chrome.browserAction.setBadgeText({text:""});

  // on bind les boutons
  // "Commencer"
  document.querySelector('#step1 button').addEventListener("click", () => {
    // on cache la step 1 et montre la 2
    hideElem('#step1');
    showElem('#step2');
    requestAuthorization();
  });
  // Recommencer
  document.querySelector('#step3 button').addEventListener("click", () => {
    hideElem('#step3');
    showElem('#step1');
    // on enlève le message d'erreur
    hide('#error');
    requestAuthorization();
  });

  // on vérifie si l'addon a déjà été configuré
  chrome.storage.local.get(['settings'], async function(res) {
    if (!res.settings || !res.settings.appToken) {
      // non pas encore configuré
      showElem('#step1');
      showElem('#not-configured-yet');
      document.getElementById('server-url').value = _settings.domain;
      hideLoading();
    } else {
      // déja configuré
      showElem('#configured');
      _settings = res.settings;
      showDownloads();
    }
  });
}
document.addEventListener('DOMContentLoaded', run);

// on demande l'autorisation au serveur
async function requestAuthorization() {
  await setSettings({domain: document.getElementById('server-url').value })
  let baseUrl = await getBaseUrl();
  let response = await fetch(baseUrl+"/login/authorize/", {
    credentials:'omit',
    method:"POST",
    body: JSON.stringify({
       "app_id": _app.id,
       "app_name": _app.name,
       "app_version": _app.version,
       "device_name": "Browser"
    })
  });
  let data = await response.json();
  // erreur ?
  if (!data.success) {
    handleError(data.msg);
    return;
  }

  // on attend que l'utilisateur ait validé
  let appToken = data.result.app_token;
  let trackId = data.result.track_id;
  do {
    await timeout(2000);
    response = await fetch(baseUrl+"/login/authorize/"+trackId, {credentials:'omit'});
    data = await response.json();

    // erreur ?
    if (!data.success) {
      handleError(data.msg);
      return;
    }
  } while (data.result.status === "pending");

  // résultat ?
  if (data.result.status === "granted") {
    await setSettings({appToken:appToken});
    hideElem('#not-configured-yet');
    showElem('#configured');
    // change le badge
    chrome.browserAction.setBadgeBackgroundColor({color:"#008000"}); // vert
    chrome.browserAction.setBadgeText({text:"✓"});
    // puis supprime le au bout de 5 secondes
    setTimeout(() => {
      chrome.browserAction.setBadgeText({text:""});
    }, 5000);
    // liste les téléchargements
    showDownloads();
    return;
  }

  setSettings({appToken:''});
  hideElem('#step2');
  showElem('#step3');
  switch(data.result.status) {
    case "unknown": return handleError("Problème avec le app_token");
    case "timeout": return handleError("Vous avez mis trop de temps à valider l'application !");
    case "denied": return handleError("Vous avez refusé l'application… Cet addon ne pourra donc pas fonctionner !");
  }
}

function handleError(err) {
  hideLoading();
  console.log(err);
  let el = document.querySelector('#error');
  el.style.display='block';
  el.innerHTML = "Erreur : " + err;
  // si le token de l'application n'est plus bon, on va proposer de recommencer
  if (err === "Erreur d'authentification de l'application") {
    if (_timeout) clearTimeout(_timeout); // stop showDownloads()
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
  console.log("gFN URL="+url);

  var flna = url.split("/");
  var fileURL = flna[flna.length-1];

  console.log("fileURL="+fileURL);

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
    let downloads = await getListDownloads();
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
        let shortFilename = res.name;
        switch(res.status) {
          case "stopped": status="Pause"; break;
          case "queued": status="En Attente"; shortFilename = getFilenameOfURL(res.name) ; break;
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
          <td style="border-bottom-width:0">${shortFilename}</td>
          <td style="border-bottom-width:0">${status==='Téléchargement'?'<div class="donut-spinner" style="border-width:2px"></div><span>Téléchargement</span>':status}</td>
          <td style="border-bottom-width:0">${Math.round(res.rx_pct/100)}%
        </tr>
        <tr>
          <td colspan="3" style="text-align:right">
            ${res.status==='stopped'?'<button data-id="'+res.id+'" type="button" class="btn-play">⏯ Reprendre</button>':'<button data-id="'+res.id+'" type="button" class="btn-stop">⏯ Pause</button>'}
            <button data-id="${res.id}" type="button" class="btn-end">Supprimer Tâche</button>
          </td>
        </tr>`);
      });
      document.querySelector('#downloads tbody').innerHTML = html.join('\n');

      // les boutons pour reprendre
      let btnPlay = document.querySelectorAll('.btn-play');
      for (let i=0; i<btnPlay.length; i++) {
        btnPlay[i].addEventListener("click", async event => {
          updateTaskStatus(event.target.dataset.id, "downloading");
        });
      }
      // les boutons pour mettre en pause
      let btnPause = document.querySelectorAll('.btn-stop');
      for (let i=0; i<btnPause.length; i++) {
        btnPause[i].addEventListener("click", async event => {
          updateTaskStatus(event.target.dataset.id, "stopped");
        });
      }
      // les boutons pour fin de tâche
      let btnEnd = document.querySelectorAll('.btn-end');
      for (let i=0; i<btnEnd.length; i++) {
        btnEnd[i].addEventListener("click", async event => {
          updateTaskStatus(event.target.dataset.id, "end");
        });
      }
    }
    _timeout = setTimeout(() => showDownloads(), 3000);
  } catch(err) {
    handleError(err);
  }
}

// permet de mettre à jour le status d'une tâche
async function updateTaskStatus(taskId, status) {
  showLoading();
  let params = {
    credentials:'omit',
    headers:{
      "X-Fbx-App-Auth": _sessionToken
    }
  };
  // si on veut finir
  if (status === 'end') {
    params.method="DELETE";
  } else {
    params.method="PUT";
    params.body = JSON.stringify({
      "status": status
    })
  }

  let baseUrl = await getBaseUrl();
  let response = await fetch(baseUrl+"/downloads/"+taskId, params);
  let data = await response.json();
  // erreur ?
  if (!data.success) {
    // a-t-on besoin de s'identifier ?
    if (data.error_code === "auth_required") {
      await openSession();
      return updateTaskStatus();
    } else {
      showDownloads();
      handleError(data.msg);
      return;
    }
  }
  showDownloads();
}
