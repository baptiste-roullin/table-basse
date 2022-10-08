
import { Item as Items, Setting as Settings, orm, checkDBConnection } from './storage/orm.js';
import { Storage } from './storage/images.js'
import { fetchUser, fetchCollection } from './fetch/fetchSC.js';
import getToken from './fetch/getToken.js';
import formatItems from './fetch/formatItems.js';



export default async function (init) {

	console.log('initialisation')
	const storage = new Storage()


	await checkDBConnection()

	await orm.sync()

	async function getAndStoreItems() {
		//const token = getToken()

		const user = await fetchUser()


		if (user?.settings.privacyProfile === true) {
			throw new Error('Ce compte est privé')
		}

		// on  stocke le nombre global d'items pour déterminer à l'avenir le nombre d'items à requeter.
		const count = user.stats.diaryCount
		await Settings.findOrCreate({
			where: { name: 'count' },
			defaults: { name: 'count', value: count }
		});

		// données textuelles
		const { products } = await fetchCollection()
		let items = formatItems(products)
		//upload des images. on en tire l'URL de l'image qu'on ajoute à l'objet
		//	items = await storage.storePictures(items)

		// maintenant qu'on a tout, on stocke en base
		await Items.bulkCreate(items, { ignoreDuplicates: true })
	}

	try {
		//On remplit une table avec le nombre d'items par année et par catégorie
		await getAndStoreItems()

		init.value = true
		await init.save();
		console.log('appli initialisée')
	} catch (error) {
		console.log(error);
	}
}



