document.addEventListener('DOMContentLoaded', () => {
  const out = document.getElementById('failling_domain'); // zone d'affichage

  // récupérer l'url qui a failé depuis le stockage local
  chrome.storage.local.get('failingId', (res) => {
    if (res && typeof res.failingId === 'string') {
      let failingId = res.failingId;
      document.getElementById('failling_id').value = failingId;
      // on récupère le lien associé à cet id
      chrome.storage.local.get('idToLink', function (res) {
        const idToLink = res.idToLink || {};
        const link = idToLink[failingId];
        document.getElementById('failling_link').value = link;
        // on extrait l'host (https://www.host.com) seulement de l'URL
        let url = new URL(link);
        // si on a subdomain.domain.com on remplace subdomain par *
        let host = url.host;
        let hostParts = host.split('.');
        if (hostParts.length > 2) {
          hostParts[0] = '*';
          host = hostParts.join('.');
        }
        out.value = 'https://' + host;
      });
      chrome.storage.local.remove('failingId');
    }
  });

  // click sur le bouton d'envoi
  document.getElementById('add_domain').addEventListener('click', async () => {
    const domain = document.getElementById('failling_domain').value;
    const taskId = document.getElementById('failling_id').value;
    const link = document.getElementById('failling_link').value;
    if (domain) {
      try {
        const granted = await chrome.permissions.request({
          origins: [domain+'/*']
        });

        if (granted) {
          // on supprime la tâche
          chrome.runtime.sendMessage({ action: "updateTaskStatus", data: JSON.stringify({ taskId, status:"end-erase" }) }, () => {
            // puis on relance le téléchargement du lien
            chrome.runtime.sendMessage({ action: "sendLinks", data: link }, () => {
              window.close();
            })
          });
        } else {
          alert("Permission denied by user.");
          window.close();
        }        
      } catch (err) {
        console.error("Erreur lors de l'envoi du message :", err);
      }
    }
  });
});
