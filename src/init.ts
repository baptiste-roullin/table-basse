
import { config } from './main'
import { crawl } from './crawl/crawl'

import { Item, Conf, orm, createCountsByYear } from './storage/orm';
import { scapeGlobalCount } from './crawl/parse';
import { Storage } from './storage/images'


export async function firstInit(init) {

	console.log('initialisation')
	const storage = new Storage()
	await orm.sync()

	async function getAndStoreItems(cat) {

		// on extrait et stocke le nombre global d'items pour détemriner le nombre de pages à crawler
		const collectionCount = await scapeGlobalCount(`${config.TB_HOST}/${config.TB_USERNAME}/journal/${cat}/page-999999999.ajax`)
		await Conf.create({ name: 'scrappedCount', value: collectionCount });
		const pagesToCrawl = Math.ceil(collectionCount / 20)

		// données textuelles
		let items = await crawl(cat, 'journal', pagesToCrawl)

		//upload des images. on en tire l'URL de l'image qu'on ajoute à l'objet
		items = await storage.storePictures(items)

		// maintenant qu'on a tout, on stocke en base
		await Item.bulkCreate(items, { ignoreDuplicates: true })
	}
	try {
		await getAndStoreItems('all')
		//On remplit une table avec le nombre d'items par année et par catégorie
		await createCountsByYear()

		init.value = 'true'
		await init.save();
		console.log('appli initialisée')
	} catch (error) {
		console.log(error);
	}
}



