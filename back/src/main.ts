#!/usr/bin/env ts-node
import { config } from './setEnv.js'

// imports placés après pour éviter des refs circulaires
import historyFallback from 'connect-history-api-fallback'
import serveStatic from 'serve-static'
import { createCountsByYear, Item, Setting as Settings } from './storing_data/orm.js'
import { router } from './serving_data/routes.js'
import initApp from './firstFetch.js'
import { fetchUser } from './getting_data/fetchSC.js'
import Fastify from 'fastify'
import cors from '@fastify/cors'
'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {}

export async function (fastify, opts) {
  // Place here your custom code!
await fastify.register(cors, { })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}


/* FRONT */

const fastify = Fastify({
  logger: true
})

fastify.register(router)

/**
 * Run the server!
 */
const port = Number(config.PORT) || 3000

const start = async () => {
  try {
    await fastify.listen({ port: port })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()


/*//Au rechargement de page par l'utilisateur, réécrit l'URL pour renvoyer à index.html, afin que le routage soit géré par Vue.
app.use(historyFallback())

// accès à l'app vue.js buildée dans le dossier dist
app.use(serveStatic('front/dist'))

app.use(cors())
// Routes fournissant les données à l'app front
app.use('/api', router);
*/

/* FRONT */


//Un champ dans la table Conf détermine si l'app a été initialisée.
//On checke si elle existe et si elle est true
async function checkIfAppNeedInit() {
	await Settings.sync()
	let [initValue] = await Settings.findOrCreate({
		where: { name: 'initStatus' },
		defaults: { name: 'initStatus', value: false }
	});
	initValue.value = false
	if (!initValue.value) {
		initApp(initValue)
	}
	else (
		console.log("app initialisée")

	)
}


try {

	//await checkIfAppNeedInit()
	//await createCountsByYear()
	//console.log(await fetchUser())

	//const { collection: { products } } = await fetchSC(config.token, 'UserDiary')

} catch (error) {
	console.log(error)
}


/*app.listen(port, () => {
	console.log(`Listening on port ${port}.`)
});*/

process.on('unhandledRejection', up => {
	console.log(up);
	throw up
})
