document.addEventListener('DOMContentLoaded', () => {
  const out = document.getElementById('clipboard_content'); // zone d'affichage

  // récupérer le contenu mis en cache par popup.js (s'il existe)
  chrome.storage.local.get('clipboardCache', (res) => {
    if (res && typeof res.clipboardCache === 'string') {
      out.value = res.clipboardCache;
      // optionnel : supprimer le cache si vous ne voulez pas le garder
      chrome.storage.local.remove('clipboardCache');
    }
  });

  // click sur le bouton d'envoi
  document.getElementById('send_to_freebox').addEventListener('click', async () => {
    const content = document.getElementById('clipboard_content').value;
    if (content) {
      try {
        await chrome.runtime.sendMessage({
          action: 'sendLinks',
          data: content.split('\n').filter(line => line.trim() !== '').join(';')
        });
        window.close();
      } catch (err) {
        console.error("Erreur lors de l'envoi du message :", err);
      }
    }
  });
});
