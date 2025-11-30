document.getElementById('file_download').addEventListener('change', async (event) => { 
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  let processed = 0;
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        await chrome.runtime.sendMessage({
          action: 'sendFormData',
          data: JSON.stringify({ filename: file.name, content: e.target.result })
        });
      } catch (err) {
        console.error("Erreur lors de l'envoi du message :", err);
      } finally {
        processed++;
        if (processed === files.length) window.close();
      }
    };
    reader.readAsDataURL(file); // Convertit le fichier en base64
  }
});
