// Charger les options enregistrées
window.settings = {};
function loadOptions () {
  getSettings()
  .then(settings => {
    window.settings = settings;
    document.getElementById('domain').value = settings.domain || _defaultDomain;
    document.getElementById('appToken').value = settings.appToken || "";
    document.getElementById('regExp').value = settings.regExp || "";
    document.getElementById('replaceWith').value = settings.replaceWith || "";
  });
}
loadOptions();

// Sauvegarder les changements
const btn = document.getElementById('saveBtn');
btn.addEventListener('click', () => {
  try {
    // on vérifie le regexp
    const regexp = document.getElementById('regExp').value;
    new RegExp(regexp); // si ce n'est pas bon, on arrive dans le "catch"
    const replaceWith = document.getElementById('replaceWith').value;
    const domain = document.getElementById('domain').value;
    if (!domain) alert("Erreur : l'URL d'accès à la Freebox est obligatoire.");
    let params = {domain:domain, regExp:regexp, replaceWith:replaceWith};
    // on vérifie si le token a été modifié
    let appToken = document.getElementById('appToken').value;
    if (appToken !== window.settings.appToken) params.appToken = appToken;
    btn.innerText = "Sauvegarde…";
    setSettings(params)
    .then(() => {
      loadOptions();
      btn.innerText = "✓ Sauvegardé !";
      btn.disabled = true;
      setTimeout(() => {
        btn.innerText = "Sauvegarder";
        btn.disabled = false;
      }, 1500);
    })
  } catch (e) {
    if (e instanceof SyntaxError) {
      alert("Erreur de syntaxe dans l'expression régulière : " + e.message);
    }
  }
})
