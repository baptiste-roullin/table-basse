#!/usr/bin/env ts-node
import path from 'node:path'

import Fastify from 'fastify'
import cors from '@fastify/cors'
import staticServe from '@fastify/static'


import { config, __dirname } from './setEnv.js'
// imports placés après pour éviter des refs circulaires
import historyFallback from 'connect-history-api-fallback'
import { createCountsByYear, Item, Setting as Settings } from './storing_data/orm.js'
import { apiRoutes } from './serving_data/routes.js'
import initApp from './firstFetch.js'
//import { fetchUser } from './getting_data/fetchSC.js'

/* FRONT */

const fastify = Fastify({
	logger: true
})


/**
 * Run the server!
 */
const port = Number(config.PORT) || 3000


try {
	fastify.register(staticServe, {
		root: path.join(__dirname, 'front/dist'),
		prefix: '/dist/', // optional: default '/'
	})
	await fastify.register(cors, {
		// put your options here
	})
	await fastify.register(apiRoutes, { prefix: 'api' })

	await fastify.listen({ port: port })
} catch (err) {
	fastify.log.error(err)
	process.exit(1)
}



/*//Au rechargement de page par l'utilisateur, réécrit l'URL pour renvoyer à index.html, afin que le routage soit géré par Vue.
app.use(historyFallback())

*/

/* FRONT */


//Un champ dans la table Conf détermine si l'app a été initialisée.
//On checke si elle existe et si elle est true
async function checkIfAppNeedInit() {
	await Settings.sync()
	let [initValue] = await Settings.findOrCreate({
		where: { name: 'initStatus' },
		defaults: { name: 'initStatus', value: false }
	})
	initValue.value = false
	if (!initValue.value) {
		initApp(initValue)
	}
	else (
		console.log("app initialisée")

	)
}


try {

	await checkIfAppNeedInit()
	//await createCountsByYear()
	//console.log(await fetchUser())

	//const { collection: { products } } = await fetchSC(config.token, 'UserDiary')

} catch (error) {
	console.log(error)
}


process.on('unhandledRejection', up => {
	console.log(up)
	throw up
})
