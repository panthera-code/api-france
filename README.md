# API France

## Description

"API France" est un projet visant à fournir une API RESTful pour accéder aux données géographiques et administratives des différentes entités territoriales françaises, telles que les pays, les régions, les départements et les municipalités. Cette API permet de récupérer des informations sur ces entités, de les normaliser et de les stocker dans une base de données relationnelle.

## Fonctionnalités

- **Récupération des données** : L'API permet de récupérer les données des communes françaises depuis l'API officielle du gouvernement français.
- **Normalisation des données** : Les noms des entités sont normalisés pour garantir une cohérence dans les données.
- **Stockage des données** : Les données sont stockées dans une base de données MySQL, avec des tables pour les pays, les régions, les départements et les municipalités.
- **Validation des données** : Les données sont validées à l'aide de schémas définis avec Joi pour s'assurer qu'elles respectent les contraintes attendues.
- **Gestion des relations** : Les relations entre les différentes entités (par exemple, les départements et les régions) sont gérées à l'aide de clés étrangères dans la base de données.

## Structure du projet

- **src/dtos** : Contient les schémas de validation des données (par exemple, `municipality.js`).
- **src/modules** : Contient les modules utilitaires pour la normalisation des données (par exemple, `normalize.js`).
- **src/services** : Contient les services pour interagir avec les données (par exemple, `department.js`, `municipality.js`).
- **src/schemas** : Contient les scripts SQL pour créer les tables de la base de données (par exemple, `database.sql`).

## Installation

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/panthera-code/api-france.git
    cd api-france
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```

3. Configurez la base de données MySQL en exécutant le script SQL :
    ```bash
    mysql -u [username] -p < src/schemas/database.sql
    ```

## Utilisation

1. Démarrez le serveur :
    ```bash
    npm start
    ```

2. Accédez à l'API via `http://localhost:5000`

## Exemples d'utilisation de l'API

### Récupérer toutes les municipalités

```http
GET /municipalities
```

Réponse:
```json
[
    {
        "id": "75056",
        "name": "Paris",
        "postalCoddes": "75001, 75002, 75003",
        "coordinates": "2.3522, 48.8566",
        "population": 2148327,
        "department_id": "75"
    },
    ...
]
```

### Récupérer une municipalité par ID

```http
GET /municipalities/:id
```

Réponse:
```json
{
    "id": "75056",
    "name": "Paris",
    "postalCoddes": "75001, 75002, 75003",
    "coordinates": "2.3522, 48.8566",
    "population": 2148327,
    "department_id": "75"
}
```

### Créer une nouvelle municipalité
```http
POST /municipalities
```

Corps de la requête :
```json
{
    "nom": "Paris",
    "code": "75056",
    "codesPostaux": ["75001", "75002", "75003"],
    "mairie": {
        "type": "Point",
        "coordinates": [2.3522, 48.8566]
    },
    "population": 2148327,
    "codeDepartement": "75"
}
```

Réponse:
```json
{
    "id": "75056",
    "name": "Paris",
    "postalCoddes": "75001, 75002, 75003",
    "coordinates": "2.3522, 48.8566",
    "population": 2148327,
    "department_id": "75"
}
```

## Documentation technique

### Schéma de la base de données

Le schéma de la base de données est défini dans le fichier `database.sql`. Il contient les tables suivantes :

- **countries** : Contient les informations sur les pays.
- **regions** : Contient les informations sur les régions.
- **departments** : Contient les informations sur les départements.
- **municipalities** : Contient les informations sur les municipalités.

### Validation des données

Les données sont validées à l'aide de schémas définis avec Joi dans le fichier `municipality.js`. Voici un exemple de schéma de validation pour une municipalité :

```js
const Joi = require('joi')

const municipalitySchema = Joi.object({
    nom: Joi.string().required(),
    code: Joi.string().pattern(/^[0-9A-B]{5}$/).required(),
    codesPostaux: Joi.array().items(Joi.string().pattern(/^[0-9A-B]{5}$/)).required(),
    mairie: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(
            Joi.number().required(),
            Joi.number().required()
        ).length(2).required()
    }).required(),
    population: Joi.number().required(),
    codeDepartement: Joi.string().pattern(/^[0-9A-B]{1,3}$/).required()
})

const validateMunicipality = (municipality) => {
    const { error, value } = municipalitySchema.validate(municipality)
    if (error) throw new Error(`Validate error: ${error.details.map(e => e.message).join(', ')}`)
    return value
}

module.exports = validateMunicipality
```

### Normalisation des données

Les noms des entités sont normalisés à l'aide de la fonction `normalizeString` définie dans le fichier `normalize.js`. Voici un exemple de cette fonction :

```js
function normalizeString(string) {
    const ligatures = {'æ': 'ae', 'Æ': 'Ae', 'œ': 'oe', 'Œ': 'Oe'}
    string = string.replace(/[æÆœŒ]/g, match => ligatures[match])
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, (match, offset, string) => {
        return string[offset - 1].toUpperCase() === string[offset - 1] ? '' : match
    })
}

function arrayToString(array) {
    return array.sort().join(', ')
}

function objectToString(object) {
    return JSON.stringify(object)
}

module.exports = { normalizeString, arrayToString, objectToString }
```

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

Cette documentation couvre les aspects techniques et d'utilisation de votre projet, y compris la structure du projet, l'installation, l'utilisation de l'API, le schéma de la base de données, la validation des données et la normalisation des données.