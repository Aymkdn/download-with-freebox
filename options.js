// Charger les options enregistrées
function loadOptions () {
  getSettings()
  .then(settings => {
    console.log("settings => ", JSON.stringify(settings));
    document.getElementById('domain').value = settings.domain || _defaultDomain;
    document.getElementById('appToken').value = settings.appToken || "";
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
    const replacewith = document.getElementById('replaceWith').value;
    const domain = document.getElementById('domain').value;
    if (!domain) alert("Erreur : l'URL d'accès à la Freebox est obligatoire.");
    btn.innerText = "Sauvegarde…";
    setSettings({domain:domain, regExp:regexp, replacewith:replaceWith})
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
