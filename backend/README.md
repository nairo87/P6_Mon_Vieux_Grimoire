# Mon Vieux Grimoire — Back-end

API RESTful (Node.js / Express / MongoDB) pour l'application de notation de
livres "Mon Vieux Grimoire" — projet 7 du parcours Développeur Web
d'OpenClassrooms.

## Sommaire

- [Étape 1-2 : Mise en place de l'environnement](#étape-1-2--mise-en-place-de-lenvironnement)
- [Étape 3 : Base de données MongoDB](#étape-3--base-de-données-mongodb)
- [Étape 4 : Authentification](#étape-4--authentification)
- [Étape 5 : Gestion des livres](#étape-5--gestion-des-livres)
- [Étape 6 : Notation et moyenne](#étape-6--notation-et-moyenne)
- [Lancer le projet complet (back + front)](#lancer-le-projet-complet-back--front)
- [Arborescence](#arborescence)

## Étape 1-2 : Mise en place de l'environnement

Prérequis : [Node.js](https://nodejs.org/) (version 18+ recommandée) et npm.

```bash
cd mon-vieux-grimoire
npm install
```

Cela installe :
- **express** : le framework serveur
- **mongoose** : l'ODM pour MongoDB
- **mongoose-unique-validator** : validation d'unicité (email)
- **bcrypt** : hachage des mots de passe
- **jsonwebtoken** : génération/vérification des tokens JWT
- **multer** : réception des fichiers uploadés (images)
- **sharp** : optimisation/redimensionnement des images (converties en `.webp`)
- **helmet** : sécurisation des en-têtes HTTP
- **dotenv** : gestion des variables d'environnement

## Étape 3 : Base de données MongoDB

1. Créez un cluster gratuit sur [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Créez un utilisateur de base de données et autorisez votre IP (ou `0.0.0.0/0`
   pour le développement).
3. Récupérez votre chaîne de connexion (`mongodb+srv://...`).
4. Copiez `.env.example` en `.env` et complétez :

```bash
cp .env.example .env
```

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/monvieuxgrimoire
JWT_SECRET=une_chaine_secrete_longue_et_aleatoire
PORT=4000
```

Le modèle de données (collections `users` et `books`) est défini dans
`models/User.js` et `models/Book.js`, conformément à la spécification :

- **User** : `email` (unique), `password` (haché)
- **Book** : `userId`, `title`, `author`, `imageUrl`, `year`, `genre`,
  `ratings` (tableau de `{ userId, grade }`), `averageRating`

Lancez le serveur :

```bash
npm start
```

Vous devriez voir dans la console :
```
Connexion à MongoDB réussie !
Serveur en écoute sur port 4000
```

## Étape 4 : Authentification

- `POST /api/auth/signup` — hache le mot de passe (bcrypt) et crée
  l'utilisateur.
- `POST /api/auth/login` — vérifie les identifiants et renvoie
  `{ userId, token }` (JWT signé, valable 24h).
- Le middleware `middleware/auth.js` protège toutes les routes nécessitant
  d'être connecté (vérifie l'en-tête `Authorization: Bearer <token>`).

## Étape 5 : Gestion des livres

Toutes les routes livres sont dans `routes/books.js` / `controllers/books.js` :

| Route | Auth | Description |
|---|---|---|
| `GET /api/books` | non | liste de tous les livres |
| `GET /api/books/:id` | non | un livre |
| `GET /api/books/bestrating` | non | les 3 livres les mieux notés |
| `POST /api/books` | oui | création (avec image) |
| `PUT /api/books/:id` | oui | modification (image optionnelle) |
| `DELETE /api/books/:id` | oui | suppression (livre + image) |

Seul le propriétaire d'un livre (`userId` correspondant au token) peut le
modifier ou le supprimer, sinon `403: unauthorized request`.

Les images sont reçues via `multer` (en mémoire), puis redimensionnées et
converties en `.webp` avec `sharp` avant d'être écrites dans `/images` et
servies statiquement sur `/images/<fichier>`.

## Étape 6 : Notation et moyenne

- `POST /api/books/:id/rating` avec `{ userId, rating }` (0 à 5).
- Un utilisateur ne peut noter qu'une seule fois le même livre.
- La note est ajoutée au tableau `ratings`, `averageRating` est recalculée
  et arrondie à une décimale, et le livre mis à jour est renvoyé.

## Lancer le projet complet (back + front)

1. Backend (ce dossier) :
   ```bash
   npm install
   npm start
   ```
   → écoute sur `http://localhost:4000`

2. Frontend fourni par OpenClassrooms :
   ```bash
   git clone https://github.com/OpenClassrooms-Student-Center/P7-Dev-Web-livres.git
   cd P7-Dev-Web-livres
   npm install
   npm start
   ```
   → l'interface s'ouvre sur `http://localhost:3000` et consomme l'API sur
   le port 4000.

## Arborescence

```
mon-vieux-grimoire/
├── app.js                  # configuration Express, CORS, connexion Mongo
├── server.js                # création du serveur HTTP, gestion du port
├── models/
│   ├── User.js
│   └── Book.js
├── routes/
│   ├── auth.js
│   └── books.js
├── controllers/
│   ├── auth.js
│   └── books.js
├── middleware/
│   ├── auth.js               # vérification du token JWT
│   └── multer-config.js      # réception des images
├── images/                   # images uploadées (générées, non versionnées)
├── .env.example
└── package.json
```
