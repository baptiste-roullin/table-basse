
import { Setting as Settings, orm, checkDBConnection } from './storing_data/orm.js'
import { fetchUser, fetchCollection } from './getting_data/fetchSC.js'
import getToken from './getting_data/getToken.js'
import formatItems from './getting_data/formatItems.js'
import { Item } from './storing_data/Items.js'
import { createCountsByYear } from './storing_data/Counts.js'
import { v2 as cloudinary } from "cloudinary"



export default async function () {

	async function getAndStoreItems(needToDownloadImages) {
		const { products, filters } = await fetchCollection()
		let items = await formatItems(products, needToDownloadImages)

		// maintenant qu'on a tout, on stocke en base
		await Item.bulkCreate(items, { ignoreDuplicates: true })
		console.log((await Item.count()) + " items stored")
	}

	async function setuser() {
		const user = await fetchUser()
		if (user?.settings.privacyProfile === true) {
			throw new Error('Ce compte est privé')
		}
		return user
	}

	async function setCount(user) {
		const count = user.stats.diaryCount
		await Settings.upsert(
			{ name: 'count', value: count }
		)
		return count
	}


	try {
		await checkDBConnection()
		await orm.sync()

		const user = await setuser()
		const remoteCount = await setCount(user)

		const localCount = await Item.count()

		const { resources } = await cloudinary.api.usage()

		let needToDownloadImages: Boolean
		if (resources < localCount) {
			needToDownloadImages = true
		}

		if (remoteCount > localCount) {
			//On remplit une table avec le nombre d'items par année et par catégorie
			await getAndStoreItems(needToDownloadImages)
			await createCountsByYear()
		}


	} catch (error) {
		console.log(error)
	}
}



