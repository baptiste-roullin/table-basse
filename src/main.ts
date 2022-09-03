#!/usr/bin/env ts-node

// Variables d'environnement obligatoires
import Path from 'path'

import dotenv from 'dotenv'
dotenv.config()

export const config = process.env
config.STATIC_URL = setStaticUrl();
const checkEnv = ['TB_USERNAME', 'TB_PWD', 'TB_EMAIL', 'CLOUDINARY_URL', 'TB_HOST'].every((el) => {
	return Object.keys(config).includes(el)
})
if (!checkEnv) {
	console.log('il manque une clé dans .env')
}

function setStaticUrl() {
	switch (config.NODE_ENV) {
		case 'production':
			console.log('env : ' + config.NODE_ENV)
			return Path.normalize('front/dist');
		case 'development':
			console.log('env : ' + config.NODE_ENV)
			return Path.normalize('front/public');
		default:
			throw new Error("please set NODE_ENV");
	}
}

// imports placés après pour éviter des refs circulaires
import express from 'express'
import cors from 'cors'
import historyFallback from 'connect-history-api-fallback'
import serveStatic from 'serve-static'
import { Item, Conf } from './storage/orm.js'
import { router } from './routes/routes.js'
import { firstInit } from './init.js'
import getToken from './getToken.js';
//import longpoll from "express-longpoll"

export const app = express()
/*//Au rechargement de page par l'utilisateur, réécrit l'URL pour renvoyer à index.html, afin que le routage soit géré par Vue.
app.use(historyFallback())

// accès à l'app vue.js buildée dans le dossier dist
app.use(serveStatic('front/dist'))

app.use(cors())*/

// Routes fournissant les données à l'app front
app.use('/api', router);

//Un champ dans la table Conf détermine si l'app a été initialisée.
//On checke si elle existe et si elle est true
async function checkIfAppNeedInit() {
	await Conf.sync()
	let init: any = await Conf.findByPk('init')
	if (!init) {
		init = await Conf.create({ name: 'init' })
		firstInit(init)
	}
	else {
		if (init.value === 'false' || init.value === null) {
			console.log('initialisation')
			firstInit(init)
		}
	}
}

//await checkIfAppNeedInit()

try {
	console.log(await getToken())
} catch (error) {

}

const port = config.PORT || 3000

const server = app.listen(port, () => {
	console.log(`Listening on port ${port}.`)
});

process.on('unhandledRejection', up => {
	console.log(up);
	throw up
})
