1. `npm install` im Ordner
2. `npm run start` startet einen Entwicklungsserver mit Live-Reloading

# Run the importer
Log in to the Baqend dashboard, open a JavaScript console, and run:
```
DB.modules.get('mongoImporter').then(console.log)
```
