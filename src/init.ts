
import { config } from './main.js'
import crawl from './crawl/crawl.js'

import { Item, ConfTable, orm, createCountsByYear } from './storage/orm.js';
import { scapeGlobalCount } from './crawl/parse.js';
import { Storage } from './storage/images.js'
import fetchSC from './fetchSC.js';
import { User } from './types.js';
import getToken from './getToken.js';
import formatItems from './queries/formatItems.js';



export async function init(init) {

	console.log('initialisation')
	const storage = new Storage()
	await orm.sync()

	async function getAndStoreItems() {


		const token = getToken()

		await ConfTable.findOrCreate(
			{
				where: { name: 'token' },
				defaults: { name: 'token', value: token }
			});

		const user: User = await fetchSC(token, 'UserStats')

		if (user.settings.privacyProfile === true) {
			throw new Error('Ce compte est privé')
		}

		// on  stocke le nombre global d'items pour déterminer à l'avenir le nombre d'items à requeter.
		const count = user.stats.diaryCount
		await ConfTable.findOrCreate(
			{
				where: { name: 'count' },
				defaults: { name: 'count', value: count }
			});

		// données textuelles
		const data = await fetchSC(token, 'UserDiary')
		let items = formatItems(data.collection)
		//upload des images. on en tire l'URL de l'image qu'on ajoute à l'objet
		items = await storage.storePictures(items)

		// maintenant qu'on a tout, on stocke en base
		await Item.bulkCreate(items, { ignoreDuplicates: true })
	}

	try {
		await getAndStoreItems()
		//On remplit une table avec le nombre d'items par année et par catégorie

		init.value = 'true'
		await init.save();
		console.log('appli initialisée')
	} catch (error) {
		console.log(error);
	}
}



