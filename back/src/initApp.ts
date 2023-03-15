
import { Setting as Settings, orm, checkDBConnection } from './storing_data/orm.js'
import { fetchUser, fetchCollection } from './getting_data/fetchSC.js'
import getToken from './getting_data/getToken.js'
import formatItems from './getting_data/formatItems.js'
import { Item } from './storing_data/Items.js'
import { createCountsByYear } from './storing_data/Counts.js'



export default async function (init) {

	async function getAndStoreItems() {


		const { products, filters } = await fetchCollection()
		let items = await formatItems(products)


		// maintenant qu'on a tout, on stocke en base
		await Item.bulkCreate(items, { ignoreDuplicates: true })
		console.log((await Item.count()) + " items stored")
	}

	async function setuser() {
		const user = await fetchUser()
		if (user?.settings.privacyProfile === true) {
			throw new Error('Ce compte est privé')
		}
		const count = user.stats.diaryCount
		await Settings.upsert(
			{ name: 'count', value: count }
		)
	}

	console.log('initialisation')
	await checkDBConnection()
	await orm.sync()


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



