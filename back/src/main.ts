#!/usr/bin/env ts-node
import { config } from './setEnv.js'

// imports placés après pour éviter des refs circulaires
import express from 'express'
import cors from 'cors'
import historyFallback from 'connect-history-api-fallback'
import serveStatic from 'serve-static'
import { createCountsByYear, Item, Setting as Settings } from './storing_data/orm.js'
import { router } from './serving_data/routes.js'
import initApp from './firstFetch.js'
import { fetchUser } from './getting_data/fetchSC.js'



/* FRONT */

export const app = express()
//Au rechargement de page par l'utilisateur, réécrit l'URL pour renvoyer à index.html, afin que le routage soit géré par Vue.
app.use(historyFallback())

// accès à l'app vue.js buildée dans le dossier dist
app.use(serveStatic('front/dist'))

app.use(cors())
// Routes fournissant les données à l'app front
app.use('/api', router);


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

	await checkIfAppNeedInit()
	//await createCountsByYear()
	//console.log(await fetchUser())

	//const { collection: { products } } = await fetchSC(config.token, 'UserDiary')

} catch (error) {
	console.log(error)

}

const port = config.PORT || 3000

app.listen(port, () => {
	console.log(`Listening on port ${port}.`)
});

process.on('unhandledRejection', up => {
	console.log(up);
	throw up
})
