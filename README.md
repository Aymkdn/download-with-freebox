# Download With Freebox

(sur une idée originale de https://github.com/garoloup/SendToFreebox)

Cette extension permet les fonctions suivantes :

  - Clic droit sur une URL pour envoyer vers l'appli _Téléchargement_ du Freebox Serveur  
  - Lancement d'un téléchargement depuis la sélection d'un fichier `.torrent` local  
  - Lister les téléchargements en cours   
  - Gestion simple des téléchargements  
  
Elle est disponible sur les différents stores :
  - [Chrome](https://chromewebstore.google.com/detail/download-via-freebox/djcfifcdpfhpmcpacfopjhpklagkhdmj)
  - [Firefox](https://addons.mozilla.org/fr/firefox/addon/download-via-freebox/)
  - [Edge](https://microsoftedge.microsoft.com/addons/detail/idnoklafjghdpkemejcjhchmkkphbkea)
  
## Différences avec `SendToFreebox`

Le code a été mis à jour, et le développeur d'origine n'ayant plus de Freebox, plus d'évolution n'était possible pour cette extension.

## Droits sur FreeboxOS

À noter que cette extension va ajouter une application sur votre Freebox (http://mafreebox.freebox.fr > "Paramètres de la Freebox" > "Mode Avancé" > "Gestion des Accès" > "Applications") nommée "Download With Freebox".

À savoir :

  - Les permissions de cette application sont celles par défaut, données par Free, et il n'est pas possible de les modifier de façon programmatique… Cela signifie qu'on ne peut pas en demander moins !
  - L'application a des droits tels que "Accès au journal d'appels" et "Accès à la base de contacts de la Freebox" : en aucun cas ces informations sont utilisées par l'extension !

En théorie les seuls droits nécessaires sont : "Accès au gestionnaire de téléchargements" et "Accès aux fichiers de la Freebox". Vous pouvez donc décocher les autres cases.

Concernant ce manque de choix pour l'application, vous pouvez aller vous plaindre sur le bugtracker de Free : https://dev.freebox.fr/bugs/task/30558

## Questions

Si vous avez des questions, des problèmes ou des demandes d'amélioration, merci de soumettre une _issue_ sur la [page dédiée](https://github.com/Aymkdn/download-with-freebox/issues).

## Développement

Afin de tester ce code dans votre navigateur sans passer par le store, vous devez télécharger le répertoire en cliquant sur le bouton "Clone or download", puis "Download Zip".

Dézipper le répertoire téléchargé, puis, selon votre navigateur :
  - Pour Firefox :
    - Ouvrir **about:debugging**
    - Cliquer sur **"Ce Firefox"**
    - Cliquer sur **"Charger un module complémentaire temporaire…"**
    - Sélectionner le fichier `manifest.json`
  - Pour Chrome :
    - Ouvrir **chrome://extensions/**
    - Cliquer sur **"Mode Développeur"** (en haut à droite)
    - Cliquer sur **"Charger l'extension non empaquetée"**
    - Sélectionner le répertoire téléchargé précédemment

## Soutenir ce projet

Vous pouvez me faire un petit don [par CB via Lydia](https://pay.lydia.me/l?t=aymericd34k6) ou [via Paypal](https://www.paypal.com/paypalme/aymkdn). Merci !
