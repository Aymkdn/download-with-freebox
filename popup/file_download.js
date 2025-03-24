
document.getElementById('file_download').addEventListener('change', async (event) => { 
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      // Envoyer les données sérialisées au background script
      try {
        await chrome.runtime.sendMessage({
          action: 'sendFormData',
          data: JSON.stringify({filename:file.name, content:event.target.result})
        });
        window.close();
      } catch (err) {
        console.error("Erreur lors de l'envoi du message :", err);
      }
    };
    reader.readAsDataURL(file); // Convertit le fichier en base64  
  }
});
