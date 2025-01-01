// Charger les options enregistrées
function loadOptions () {
  getSettings()
  .then(settings => {
    console.log("settings => ", JSON.stringify(settings));
    document.getElementById('domain').value = settings.domain || _defaultDomain;
    document.getElementById('appToken').value = settings.appToken || "";
  });
}
loadOptions();

// Sauvegarder les changements
const btn = document.getElementById('saveBtn');
btn.addEventListener('click', () => {
  const domain = document.getElementById('domain').value;
  if (domain) {
    btn.innerText = "Sauvegarde…";
    setSettings({domain:domain})
    .then(() => {
      loadOptions();
      btn.innerText = "✓ Sauvegardé !";
      btn.disabled = true;
      setTimeout(() => {
        btn.innerText = "Sauvegarder";
        btn.disabled = false;
      }, 1500);
    })
  }
})
