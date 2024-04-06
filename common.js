var _app = {
  id: "fr.freebox.webextension 4",
  name: "SendToFreebox 4 Extension",
  version: "2.0.0"
}

// settings
var _settings = {
  appToken: "", // le app_token
  downloadDir: "", // le répertoire du téléchargement
  domain: "http://mafreebox.freebox.fr", // le domaine de la freebox
}
// va stocker le token de session
var _sessionToken = null;
// l'url de base
var _baseUrl = "";

// Permet de trouver l'URL de base pour les API
async function getBaseUrl() {
  if (!_baseUrl) {
    const domain = _settings.domain || 'http://mafreebox.freebox.fr';
    const response = await fetch(`${domain}/api_version`);
    const data = await response.json();
    _baseUrl = `${domain}${data.api_base_url}v${data.api_version.split(".")[0]}`;
  }
  return Promise.resolve(_baseUrl);
}

/// Va permettre de récupérer le token de session
async function openSession() {
  // on récupère le challenge
  let baseUrl = await getBaseUrl();
  let response = await fetch(baseUrl+"/login/", {credentials:'omit'});
  let data = await response.json();
  let challenge = data.result.challenge;
  let passwd = Crypto.sha1_hmac(challenge, _settings.appToken);

  // on s'identifie
  console.info("Authentication…");
  response = await fetch(baseUrl+"/login/session/", {
    credentials:'omit', // si l'utilisateur est logué sur FreeboxOS, alors 'omit' va éviter d'envoyer le cookie de FreeboxOS et de faire foirer les API
    method:"POST",
    body: JSON.stringify({
      "app_id": _app.id,
      "password": passwd,
    })
  })
  data = await response.json();
  // erreur ?
  if (!data.success) {
    handleError(data.msg);
    return false;
  }

  _sessionToken = data.result.session_token;
  return true;
}

// permet d'enregistrer les 'settings'
function setSettings(settings) {
  for (let key in settings) {
    _settings[key] = settings[key];
  }
  // on enregistre durablement
  return new Promise(res => {
    chrome.storage.local.set({settings:_settings}, () => res());
  });
}

async function getListDownloads() {
  let baseUrl = await getBaseUrl();
  // on récupère tous les téléchargements en cours
  let response = await fetch(baseUrl+"/downloads/", {
    credentials:'omit',
    headers:{
      "X-Fbx-App-Auth": _sessionToken
    }
  });
  let data = await response.json();

  // erreur ?
  if (!data.success) {
    // a-t-on besoin de s'identifier ?
    if (data.error_code === "auth_required") {
      if (await openSession() === true) {
        return getListDownloads();
      } else {
        throw data.msg;
      }
    }
    else {
      handleError(data.msg);
      return [];
    }
  }

  return data.result;
}

// permet d'attendre le délai indiqué
function timeout(ms) {
  let timeoutId;
  return new Promise(res => {
    timeoutId = setTimeout(() => res(timeoutId), ms);
  });
}
