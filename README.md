# PPVC-Brgy-Management-System

"dev-client": "npm start --prefix client",
"dev": "nodemon dist/index.js",
"watch": "tsc -w",
"start": "node dist/index.js",
"tsc": "tsc",
"postinstall": "npm run tsc",
"watch-node": "nodemon dist/index.js",
"watch-ts": "tsc -w",
"deploy": "git add . && git commit -m Heroku && git push heroku master"

    "node_modules{,/**}",
