
import { Setting as Settings, orm, checkDBConnection } from './storing_data/orm.js'
import { fetchUser, fetchCollection } from './getting_data/fetchSC.js'
import getToken from './getting_data/getToken.js'
import formatItems from './getting_data/formatItems.js'
import { Item } from './storing_data/Items.js'
import { createCountsByYear } from './storing_data/Counts.js'



export default async function (init) {

	console.log('initialisation')
	await checkDBConnection()
	await orm.sync()

	async function getAndStoreItems() {
		const user = await fetchUser()
		if (user?.settings.privacyProfile === true) {
			throw new Error('Ce compte est privé')
		}
		const count = user.stats.diaryCount
		await Settings.findOrCreate({
			where: { name: 'count' },
			defaults: { name: 'count', value: count }
		})

		// données textuelles
		const { products, filters } = await fetchCollection()
		let items = await formatItems(products)
		//upload des images. on en tire l'URL de l'image qu'on ajoute à l'objet
		//	items = await storage.storePictures(items)
		// maintenant qu'on a tout, on stocke en base
		console.log(items[0])

		await Item.bulkCreate(items, { ignoreDuplicates: true })
		console.log("items stored")
	}

	try {
		//On remplit une table avec le nombre d'items par année et par catégorie
		await getAndStoreItems()
		await createCountsByYear()

		init.value = true
		await init.save()
		console.log('app initialisée')
	} catch (error) {
		console.log(error)
	}
}



