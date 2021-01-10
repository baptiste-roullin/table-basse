 ![](https://raw.githubusercontent.com/Saint-loup/table-basse/published/front/src/assets/lol.png)

## Description

Afficher les livres, films, jeux... que vous avez lu/vu/poncé dans une app dédiée, en utilisant votre compte Sens Critique. Pas les listes, les tops, les scores, les envies… juste les oeuvres déclarées comme ✅.

[Démo ici.](http://table-basse.toutcequibouge.net/)

Inspiration initiale : [ce projet](https://github.com/mlcdf/shelob).

Le déploiement est pensé pour Heroku mais avec quelques ajustements devrait fonctionner n'importe où.

## Installation

Prérequis :

* une base PostgreSQL
* un compte chez le CDN Cloudinary (installable facilement par Heroku)
* NPM 7
* Node 15

`npm install`

Le dossier front a son propre package.json mais il est déclaré comme workspace dans le package.json racine, donc lié symboliquement.

## Génération

Typescript et Vue sont compilés par le serveur avec l'ancrage `heroku-postbuild`.

tsconfig.json n'a pas de `root` déclarée car cela créait un conflit avec Vetur (plugin pour Vue et VS Code).

A cause d'un cas très précis, le projet requiert Puppeteer (un outil d'automatisation de Chrome). Pour l'installer sur Heroku, on peut utiliser [ce script](https://elements.heroku.com/buildpacks/jontewks/puppeteer-heroku-buildpack). Ça ajoute un navigateur complet donc les temps de déploiement et la taille  du projet sont sensiblement augmentés.

## Import des données
Remplacer le fichier .env.sample par un fichier .env similaire donnant les infos de votre compte Sens critique (pseudo, mail et mot de passe). Fichier évidememnt confidentiel à `.gitignore`-iser.

Au premier lancement, l'appli va mettre un certain temps pour importer les œuvres.

Pour importer régulièrement les nouvelles oeuvres, lancer `new-items-job.js` avec une tâche Cron ou équivalent.


## Développement
`npm run dev`, à la racine pour le back et dans le dossier front pour Vue.

Pour le back, Nodemon recharge le serveur à chaque changement et Ts-node s'occupe de Typescript.
