// see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background#browser_support
if (typeof browser == "undefined") {
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome;
}

// sha1_hmac: https://gist.github.com/Seldaek/1730205
var Crypto={sha1_hmac:function(r,t){"use strict";var e,o,a,h,n,C;for(64<t.length&&(t=Crypto.sha1(t,!0)),h=[],C=t.length,n=0;n<64;++n)h[n]=n<C?t.charCodeAt(n):0;for(o=e="",n=0;n<64;++n)e+=String.fromCharCode(92^h[n]),o+=String.fromCharCode(54^h[n]);return a=Crypto.sha1(o+r,!0),Crypto.sha1(e+a)},sha1:function(r,t){function e(r,t){return r<<t|r>>>32-t}function o(r,t){var e,o,a="";for(e=7;0<=e;e--)o=r>>>4*e&15,a+=t?String.fromCharCode(o):o.toString(16);return a}var a,h,n,C,s,c,f,p,u,d,m=new Array(80),i=1732584193,A=4023233417,g=2562383102,l=271733878,b=3285377520,y=r.length,S=[];for(h=0;h<y-3;h+=4)n=r.charCodeAt(h)<<24|r.charCodeAt(h+1)<<16|r.charCodeAt(h+2)<<8|r.charCodeAt(h+3),S.push(n);switch(y%4){case 0:h=2147483648;break;case 1:h=r.charCodeAt(y-1)<<24|8388608;break;case 2:h=r.charCodeAt(y-2)<<24|r.charCodeAt(y-1)<<16|32768;break;case 3:h=r.charCodeAt(y-3)<<24|r.charCodeAt(y-2)<<16|r.charCodeAt(y-1)<<8|128}for(S.push(h);S.length%16!=14;)S.push(0);for(S.push(y>>>29),S.push(y<<3&4294967295),a=0;a<S.length;a+=16){for(h=0;h<16;h++)m[h]=S[a+h];for(h=16;h<=79;h++)m[h]=e(m[h-3]^m[h-8]^m[h-14]^m[h-16],1);for(C=i,s=A,c=g,f=l,p=b,h=0;h<=19;h++)temp=e(C,5)+(s&c|~s&f)+p+m[h]+1518500249&4294967295,p=f,f=c,c=e(s,30),s=C,C=temp;for(h=20;h<=39;h++)temp=e(C,5)+(s^c^f)+p+m[h]+1859775393&4294967295,p=f,f=c,c=e(s,30),s=C,C=temp;for(h=40;h<=59;h++)temp=e(C,5)+(s&c|s&f|c&f)+p+m[h]+2400959708&4294967295,p=f,f=c,c=e(s,30),s=C,C=temp;for(h=60;h<=79;h++)temp=e(C,5)+(s^c^f)+p+m[h]+3395469782&4294967295,p=f,f=c,c=e(s,30),s=C,C=temp;i=i+C&4294967295,A=A+s&4294967295,g=g+c&4294967295,l=l+f&4294967295,b=b+p&4294967295}if(u=(o(i)+o(A)+o(g)+o(l)+o(b)).toLowerCase(),!t)return u;for(d="";u.length;)d+=String.fromCharCode(parseInt(u.substr(0,2),16)),u=u.substr(2);return d}};
// sha1: https://github.com/emn178/js-sha1
!function(){"use strict";function t(t){t?(f[0]=f[16]=f[1]=f[2]=f[3]=f[4]=f[5]=f[6]=f[7]=f[8]=f[9]=f[10]=f[11]=f[12]=f[13]=f[14]=f[15]=0,this.blocks=f):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],this.h0=1732584193,this.h1=4023233417,this.h2=2562383102,this.h3=271733878,this.h4=3285377520,this.block=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0}var h="object"==typeof window?window:{},s=!h.JS_SHA1_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;s&&(h=global);var i=!h.JS_SHA1_NO_COMMON_JS&&"object"==typeof module&&module.exports,e="function"==typeof define&&define.amd,r="0123456789abcdef".split(""),o=[-2147483648,8388608,32768,128],n=[24,16,8,0],a=["hex","array","digest","arrayBuffer"],f=[],u=function(h){return function(s){return new t(!0).update(s)[h]()}},c=function(){var h=u("hex");s&&(h=p(h)),h.create=function(){return new t},h.update=function(t){return h.create().update(t)};for(var i=0;i<a.length;++i){var e=a[i];h[e]=u(e)}return h},p=function(t){var h=eval("require('crypto')"),s=eval("require('buffer').Buffer"),i=function(i){if("string"==typeof i)return h.createHash("sha1").update(i,"utf8").digest("hex");if(i.constructor===ArrayBuffer)i=new Uint8Array(i);else if(void 0===i.length)return t(i);return h.createHash("sha1").update(new s(i)).digest("hex")};return i};t.prototype.update=function(t){if(!this.finalized){var s="string"!=typeof t;s&&t.constructor===h.ArrayBuffer&&(t=new Uint8Array(t));for(var i,e,r=0,o=t.length||0,a=this.blocks;r<o;){if(this.hashed&&(this.hashed=!1,a[0]=this.block,a[16]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=a[9]=a[10]=a[11]=a[12]=a[13]=a[14]=a[15]=0),s)for(e=this.start;r<o&&e<64;++r)a[e>>2]|=t[r]<<n[3&e++];else for(e=this.start;r<o&&e<64;++r)(i=t.charCodeAt(r))<128?a[e>>2]|=i<<n[3&e++]:i<2048?(a[e>>2]|=(192|i>>6)<<n[3&e++],a[e>>2]|=(128|63&i)<<n[3&e++]):i<55296||i>=57344?(a[e>>2]|=(224|i>>12)<<n[3&e++],a[e>>2]|=(128|i>>6&63)<<n[3&e++],a[e>>2]|=(128|63&i)<<n[3&e++]):(i=65536+((1023&i)<<10|1023&t.charCodeAt(++r)),a[e>>2]|=(240|i>>18)<<n[3&e++],a[e>>2]|=(128|i>>12&63)<<n[3&e++],a[e>>2]|=(128|i>>6&63)<<n[3&e++],a[e>>2]|=(128|63&i)<<n[3&e++]);this.lastByteIndex=e,this.bytes+=e-this.start,e>=64?(this.block=a[16],this.start=e-64,this.hash(),this.hashed=!0):this.start=e}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},t.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,h=this.lastByteIndex;t[16]=this.block,t[h>>2]|=o[3&h],this.block=t[16],h>=56&&(this.hashed||this.hash(),t[0]=this.block,t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.hBytes<<3|this.bytes>>>29,t[15]=this.bytes<<3,this.hash()}},t.prototype.hash=function(){var t,h,s=this.h0,i=this.h1,e=this.h2,r=this.h3,o=this.h4,n=this.blocks;for(t=16;t<80;++t)h=n[t-3]^n[t-8]^n[t-14]^n[t-16],n[t]=h<<1|h>>>31;for(t=0;t<20;t+=5)s=(h=(i=(h=(e=(h=(r=(h=(o=(h=s<<5|s>>>27)+(i&e|~i&r)+o+1518500249+n[t]<<0)<<5|o>>>27)+(s&(i=i<<30|i>>>2)|~s&e)+r+1518500249+n[t+1]<<0)<<5|r>>>27)+(o&(s=s<<30|s>>>2)|~o&i)+e+1518500249+n[t+2]<<0)<<5|e>>>27)+(r&(o=o<<30|o>>>2)|~r&s)+i+1518500249+n[t+3]<<0)<<5|i>>>27)+(e&(r=r<<30|r>>>2)|~e&o)+s+1518500249+n[t+4]<<0,e=e<<30|e>>>2;for(;t<40;t+=5)s=(h=(i=(h=(e=(h=(r=(h=(o=(h=s<<5|s>>>27)+(i^e^r)+o+1859775393+n[t]<<0)<<5|o>>>27)+(s^(i=i<<30|i>>>2)^e)+r+1859775393+n[t+1]<<0)<<5|r>>>27)+(o^(s=s<<30|s>>>2)^i)+e+1859775393+n[t+2]<<0)<<5|e>>>27)+(r^(o=o<<30|o>>>2)^s)+i+1859775393+n[t+3]<<0)<<5|i>>>27)+(e^(r=r<<30|r>>>2)^o)+s+1859775393+n[t+4]<<0,e=e<<30|e>>>2;for(;t<60;t+=5)s=(h=(i=(h=(e=(h=(r=(h=(o=(h=s<<5|s>>>27)+(i&e|i&r|e&r)+o-1894007588+n[t]<<0)<<5|o>>>27)+(s&(i=i<<30|i>>>2)|s&e|i&e)+r-1894007588+n[t+1]<<0)<<5|r>>>27)+(o&(s=s<<30|s>>>2)|o&i|s&i)+e-1894007588+n[t+2]<<0)<<5|e>>>27)+(r&(o=o<<30|o>>>2)|r&s|o&s)+i-1894007588+n[t+3]<<0)<<5|i>>>27)+(e&(r=r<<30|r>>>2)|e&o|r&o)+s-1894007588+n[t+4]<<0,e=e<<30|e>>>2;for(;t<80;t+=5)s=(h=(i=(h=(e=(h=(r=(h=(o=(h=s<<5|s>>>27)+(i^e^r)+o-899497514+n[t]<<0)<<5|o>>>27)+(s^(i=i<<30|i>>>2)^e)+r-899497514+n[t+1]<<0)<<5|r>>>27)+(o^(s=s<<30|s>>>2)^i)+e-899497514+n[t+2]<<0)<<5|e>>>27)+(r^(o=o<<30|o>>>2)^s)+i-899497514+n[t+3]<<0)<<5|i>>>27)+(e^(r=r<<30|r>>>2)^o)+s-899497514+n[t+4]<<0,e=e<<30|e>>>2;this.h0=this.h0+s<<0,this.h1=this.h1+i<<0,this.h2=this.h2+e<<0,this.h3=this.h3+r<<0,this.h4=this.h4+o<<0},t.prototype.hex=function(){this.finalize();var t=this.h0,h=this.h1,s=this.h2,i=this.h3,e=this.h4;return r[t>>28&15]+r[t>>24&15]+r[t>>20&15]+r[t>>16&15]+r[t>>12&15]+r[t>>8&15]+r[t>>4&15]+r[15&t]+r[h>>28&15]+r[h>>24&15]+r[h>>20&15]+r[h>>16&15]+r[h>>12&15]+r[h>>8&15]+r[h>>4&15]+r[15&h]+r[s>>28&15]+r[s>>24&15]+r[s>>20&15]+r[s>>16&15]+r[s>>12&15]+r[s>>8&15]+r[s>>4&15]+r[15&s]+r[i>>28&15]+r[i>>24&15]+r[i>>20&15]+r[i>>16&15]+r[i>>12&15]+r[i>>8&15]+r[i>>4&15]+r[15&i]+r[e>>28&15]+r[e>>24&15]+r[e>>20&15]+r[e>>16&15]+r[e>>12&15]+r[e>>8&15]+r[e>>4&15]+r[15&e]},t.prototype.toString=t.prototype.hex,t.prototype.digest=function(){this.finalize();var t=this.h0,h=this.h1,s=this.h2,i=this.h3,e=this.h4;return[t>>24&255,t>>16&255,t>>8&255,255&t,h>>24&255,h>>16&255,h>>8&255,255&h,s>>24&255,s>>16&255,s>>8&255,255&s,i>>24&255,i>>16&255,i>>8&255,255&i,e>>24&255,e>>16&255,e>>8&255,255&e]},t.prototype.array=t.prototype.digest,t.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(20),h=new DataView(t);return h.setUint32(0,this.h0),h.setUint32(4,this.h1),h.setUint32(8,this.h2),h.setUint32(12,this.h3),h.setUint32(16,this.h4),t};var y=c();i?module.exports=y:(h.sha1=y,e&&define(function(){return y}))}();

var _defaultDomain = "http://mafreebox.freebox.fr";

var _app = {
  id: "info.kodono.dwf",
  name: "Download-with-Freebox Extension",
  version: "3.0.0"
}

// settings
var _settings = {
  appToken: "", // le app_token
  domain: _defaultDomain, // le domaine de la freebox
  regExp: "", // si l'on souhaite modifier des URL via une regexp avant qu'elles ne soient traitées par la Freebox
  replaceWith: "" // utilisé avec regExp
}
// va stocker le token de session
var _sessionToken = null;
// l'url de base
var _baseUrl = "";
// pour savoir si watchQueue est en cours
var _watchQueueInProgress = false;


// permet d'enregistrer les 'settings'
async function setSettings(settings) {
  for (let key in settings) {
    _settings[key] = settings[key];
    // on enlève les "/" à la fin du domain
    // à cause du self-signed certificat, on force mafreebox.freebox.fr à être en HTTP
    if (key === "domain") {
      _settings[key]=_settings[key].split('/').slice(0,3).join('/').replace("https://mafreebox.freebox.fr", "http://mafreebox.freebox.fr");
      // on va limiter l'accès à freebox.fr ou freeboxos.fr
      if (!/https:\/\/.*.freeboxos.fr:\d+|http:\/\/mafreebox.freebox.fr/.test(_settings[key])) {
        _settings[key] = _defaultDomain;
      }
      // si l'adresse est différente de mafreebox.freebox.fr alors on demande une autorisation spéciale
      // await new Promise(res => {
      //   // on regarde si le domaine n'a pas déjà été autorisé
      //   let requestedDomain = _settings[key]+'/*';
      //   chrome.permissions.contains({
      //     origins: [requestedDomain]
      //   }, (result) => {
      //     if (result) {
      //       res();
      //     } else {
      //       chrome.permissions.request({
      //         origins: [requestedDomain]
      //       }, (granted) => {
      //         if (!granted) {
      //           _settings[key] = _defaultDomain;
      //         }
      //         res();
      //       });
      //     }
      //   });        
      // });
    }
  }
  // on enregistre durablement
  return new Promise(res => {
    chrome.storage.local.set({settings:_settings}, () => res());
  });
}

// permet de récupérer les settings
function getSettings() {
  return new Promise(promiseOK => {
    chrome.storage.local.get(['settings'], function(res) {
      promiseOK(res.settings || _settings);
    });
  })
}

// Permet de trouver l'URL de base pour les API
async function getBaseUrl() {
  if (!_baseUrl) {
    const domain = _settings.domain || _defaultDomain;
    const response = await fetch(`${domain}/api_version`);
    const data = await response.json();
    _baseUrl = `${domain}${data.api_base_url}v${data.api_version.split(".")[0]}`;
  }
  return Promise.resolve(_baseUrl);
}

// Va permettre de récupérer le token de session
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

// on demande l'autorisation au serveur
async function requestAuthorization(domain) {
  await setSettings({domain: domain || _settings.domain || _defaultDomain })
  let baseUrl = await getBaseUrl();
  let response = await fetch(baseUrl+"/login/authorize/", {
    credentials:'omit',
    method:"POST",
    body: JSON.stringify({
       "app_id": _app.id,
       "app_name": _app.name,
       "app_version": _app.version,
       "device_name": getBrowserName()
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

  return Object.assign({}, {app_token:appToken}, data.result);
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
      throw data.msg
    }
  }

  return data.result||[];
}

async function updateTaskStatus(taskId, status) {
  let params = {
    credentials:'omit',
    headers:{
      "X-Fbx-App-Auth": _sessionToken
    }
  };
  // si on veut finir
  if (['end', 'end-erase'].includes(status)) {
    params.method="DELETE";
  } else {
    params.method="PUT";
    params.body = JSON.stringify({
      "status": status
    })
  }

  let baseUrl = await getBaseUrl();
  let response = await fetch(baseUrl+"/downloads/"+taskId + (status === 'end-erase' ? '/erase' : ''), params);
  let data = await response.json();
  // erreur ?
  if (!data.success) {
    // a-t-on besoin de s'identifier ?
    if (data.error_code === "auth_required") {
      await openSession();
      return updateTaskStatus(taskId, status);
    } else {
      handleError(data.msg);
      throw data.msg;
    }
  }
  return data;
}

function getErrorMessage (error) {
  if (error instanceof Error) {
    console.log('Error Name:', error.name);
    console.log('Error Message:', error.message);
    console.log('Error Stack:', error.stack);
    return error.message;
  }
  return error;
}

// permet d'attendre le délai indiqué
function timeout(ms) {
  let timeoutId;
  return new Promise(res => {
    timeoutId = setTimeout(() => res(timeoutId), ms);
  });
}

// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str) {
  // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
  // Most often this is not the case though.
  return String(str)
         .replace(/&/g, "&amp;")
         .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
         .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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
 * Cette fonction est appelée lorsque l'utilisateur un téléchargement vers la Freebox
 */
async function sendBody(body) {
  // on montre un badge pour indiquer que la demande est bien prise en compte
  chrome.action.setBadgeBackgroundColor({color:"#FFF"}); // blanc
  chrome.action.setBadgeText({text:"⏳"}); // 🔄

  // on ouvre une session pour avoir un token
  let res = await openSession();
  if (!res) return;

  let baseUrl = await getBaseUrl();
  let headers = {
    "X-Fbx-App-Auth": _sessionToken
  }
  // on spécifie le content type quand c'est nécessaire
  if (typeof body === "string" && body.startsWith('download_url')) {
    headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
  }
  // on envoie le lien dans la queue
  let response = await fetch(baseUrl+"/downloads/add", {
    credentials:'omit',
    headers:headers,
    method:"POST",
    body: body
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
  if (!_watchQueueInProgress) watchQueue();
}

// Va permettre de surveiller la liste des téléchargements et de prévenir quand c'est terminé
async function watchQueue() {
  _watchQueueInProgress = true;
  let downloads = await getListDownloads();
  let inProgress = downloads.filter(res => !['stopped', 'stopping', 'error', 'done', 'seeding'].includes(res.status));
  // si tous les téléchargements sont terminés
  if (inProgress.length === 0 && downloads.length > 0) {
    chrome.action.setBadgeBackgroundColor({color:"#008000"}); // vert
    chrome.action.setBadgeText({text:"✓"});
    _watchQueueInProgress = false;
    // on arrête l'alarme
    chrome.alarms.clear("watchQueueAlarm");
  } else if (inProgress.length > 0) {
    // on affiche le nombre de téléchargement en cours badge
    chrome.action.setBadgeBackgroundColor({color:"#48D1CC"}); // medium turquoise
    chrome.action.setBadgeText({text:"▼"+inProgress.length});
    // on vérifie si l'alarme existe
    const alarm = await chrome.alarms.get("watchQueueAlarm");
    if (!alarm) {
      // avec Manifest v3 on doit utiliser des alarmes pour déclencher des tâches régulières en arrière plan
      // au minimum l'alarme peut être déclenchée toutes les 30 secondes (voir https://developer.chrome.com/docs/extensions/reference/api/alarms?hl=fr)
      chrome.alarms.create("watchQueueAlarm", { periodInMinutes: 0.5 });
    }
  } else if (inProgress.length === 0 && downloads.length === 0) {
    _watchQueueInProgress = false;
    // on arrête l'alarme
    chrome.alarms.clear("watchQueueAlarm");
    // on supprime le badge
    chrome.action.setBadgeText({text:""});
  }
}

function getBrowserName() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Firefox")) {
      return "Firefox";
  } else if (userAgent.includes("Edg")) {
      return "Edge";
  } else if (userAgent.includes("Chrome")) {
      return "Chrome";
  } else {
      return "Browser";
  }
}

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
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.remove("copy-link-to-clipboard", () => {
    chrome.contextMenus.create({
      id: "copy-link-to-clipboard",
      title: chrome.i18n.getMessage("menuContextSendLink"),
      contexts: ["link"],
    }, () => {
      if (chrome.runtime.lastError) {
        console.log("Error:",chrome.runtime.lastError);
      } else {
        // on reset le badge de l'extension
        chrome.action.setBadgeText({text:""});
        // on vérifie si l'addon est configuré
        getSettings()
        .then(settings => {
          if (!settings || !settings.appToken) {
            chrome.action.setBadgeBackgroundColor({color:"#D32F2F"}); // red darken-1
            chrome.action.setBadgeText({text:"❕"});
          } else {
            _settings = settings;
          }
        });
      }
    });
  })
})


/**
 * L'action qui découle du clic sur le menu
 */
chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === "copy-link-to-clipboard") {
    let safeUrl = escapeHTML(info.linkUrl);
    // on regarde si un regexp doit être appliqué
    if (_settings.regExp) {
      safeUrl = safeUrl.replace(new RegExp(_settings.regExp), _settings.replaceWith);
    }
    safeUrl = encodeURIComponent(safeUrl);
    sendBody("download_url=" + safeUrl);
  }
});

// quand le storage de l'extension change, on veut appliquer les changements à nos variables locales
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (namespace === 'local' && key === 'settings') _settings = newValue;
  }
});

// transforme un fichier base64 en un Blob
function base64ToBlob(base64, mimeType) {
  let byteCharacters = atob(base64);
  let byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    let slice = byteCharacters.slice(i, i + 512);
    let byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: mimeType });
}

// permet de communiquer avec popup.html et options.html
// on doit transmettre des messages sous forme de texte (donc utiliser JSON.stringify)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message => ", message);
  // retourne la liste des downloads
  switch(message.action) {
    case "getListDownloads": {
      getListDownloads()
      .then(res => sendResponse({ downloads: res }))
      .catch(err => sendResponse({ error: getErrorMessage(err) }));
      break;
    }
    case "openPopup": {
      chrome.windows.create({
        url: "popup/popup.html",
        type: "popup",
        width: 600,
        height: 300
      })
      .then(() => sendResponse());
      break;
    }
    // enregistre les settings
    case "setSettings": {
      setSettings(JSON.parse(message.data))
      .then(() => sendResponse())
      .catch(err => sendResponse({ error: getErrorMessage(err) }));
      break;
    }
    // retourne les settings
    case "getSettings": {
      getSettings()
      .then(settings => sendResponse(settings))
      .catch(err => sendResponse({ error: getErrorMessage(err) }));
      break;
    }
    case "requestAuthorization": {
      requestAuthorization(message.data)
      .then(result => {
        sendResponse(result)
      })
      .catch(err => {
        console.log(err);
        if (typeof err === "object") {
          if (err.msg) err=err.msg;
          else if (typeof err.toString === "function") err=err.toString();
          else err=JSON.stringify(err);
        }
        if (err === "TypeError: Failed to fetch") {
          err = `La connexion avec le domaine "${_settings.domain}" a rencontré un problème. Vérifiez que l'URL indiquée est correcte et accessible.`;
        }
        sendResponse({ error: getErrorMessage(err) })
      });
      break;
    }
    // modifie le statut d'un tâche
    case "updateTaskStatus": {
      let { taskId, status } = JSON.parse(message.data);
      updateTaskStatus(taskId, status)
      .then(result => {
        sendResponse(result)
      })
      .catch(err => {
        console.log(err);
        if (typeof err === "object") {
          if (err.msg) err=err.msg;
          else if (typeof err.toString === "function") err=err.toString();
          else err=JSON.stringify(err);
        }
        sendResponse({ error: getErrorMessage(err) })
      });
      break;
    }
    case "watchQueue": {
      if (!_watchQueueInProgress) watchQueue();
      sendResponse();
      break;
    }
    case "sendFormData": {
      let { filename, content } = JSON.parse(message.data);
      let matches = content.match(/^data:(.+);base64,(.+)$/);
      let mimeType = matches[1];
      let base64Data = matches[2];

      let blob = base64ToBlob(base64Data, mimeType);
      let formData = new FormData();
      formData.append("download_file", blob, filename);
      sendBody(formData);
      sendResponse();
      break;
    }
    case "sendLinks": {
      let urls = message.data.split(';');
      for (let url of urls) {
        let safeUrl = escapeHTML(url);
        // on regarde si un regexp doit être appliqué
        if (_settings && _settings.regExp) {
          safeUrl = safeUrl.replace(new RegExp(_settings.regExp), _settings.replaceWith);
        }
        safeUrl = encodeURIComponent(safeUrl);
        sendBody("download_url=" + safeUrl);
      }
      sendResponse();
      break;
    }
  }

  // Indique que la réponse est asynchrone
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "watchQueueAlarm") {
    watchQueue();
  }
});

chrome.runtime.onStartup.addListener(function() {
  console.log('Browser restarted, background script started.');
  // Placez ici des appels à chrome.storage.local.get si nécessaire
});

// lorsqu'on lance le navigateur, on veut qu'il récupère les settings
getSettings()
.then(settings => _settings=settings);
