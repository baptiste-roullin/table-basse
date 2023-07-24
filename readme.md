 ![](https://raw.githubusercontent.com/Saint-loup/table-basse/published/front/src/assets/lol.png)

[Démo ici](https://table-basse.toutcequibouge.net/)

## Description

Afficher les livres, films, jeux... que vous avez lu/vu/poncé dans une app dédiée, en utilisant votre compte Sens Critique. Pas les listes, les tops, les scores, les envies… juste les oeuvres déclarées comme ✅.

C'est un projet pour mon usage personnel, pas pensé ni testé pour un quelconque usage sérieux.

## Historique
- V1 : hébergé chez Heroku. Scraping manuel. Inspiration initiale : [ce projet](https://github.com/mlcdf/shelob).
- V2 : auto-hébergé. La grosse refonte de Sens Critique de 2202 a pété le scraping mais fourni une alternative beaucoup plus simple : requêter directement les données de l'API GraphQL/Apollo.

## Installation

Prérequis :

* une base PostgreSQL
* un compte chez le CDN Cloudinary
* NPM 9
* Node 18

`npm install`

Remplacer le fichier .env.sample par un fichier .env similaire donnant les infos de votre compte Sens critique (pseudo et jeton de connexion). Fichier évidememnt confidentiel à `.gitignore`-iser.

### Jeton de connexion

Interagir avec l'API nécessite un jeton unique lié à votre compte. Pour l'obtenir, le plus "simple" est de vous connecter à Sens Critique avec votre compte, d'appuyer sur la touche F12, dans l'onglet console d'entrer "document.cookie" et dans le texte qui apparait chercher la valeur liée à "SC_AUTH".

De ce que j'ai vu, le jeton est peu ou prou permanent, mais si jamais vous voulez le récupérer programmatiquement, vous pouvez utiliser le module `getToken.ts`. Cela nécessite de spécifier des variables d'environnement pour vos identifiant et mot de passe : TB_EMAIL et TB_PWD. AVERTISSEMENT : cette partie du code n'a pas été testée récemment, il est possible que le front de SC ait changé et fasse échouer le scraping.

## Déploiement

1. Foutez s'y moi tout ça sur un serveur Linux
2. Allez dans le dossier `front` puis lancez `npm run build`
3. Pour lancer automatiquement l'application, suivez [ces instructions](https://gist.github.com/joepie91/73ce30dd258296bd24af23e9c5f761aa).
4. La seule différence est que j'ai mis `Restart=always` et `RunTimeMaxSec=1d`, pour mettre à jour les données toutes les 24h.


## Développement
`npm run dev` dans les dossiers back et front.
