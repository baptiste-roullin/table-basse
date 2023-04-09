
import { Setting as Settings, orm, checkDBConnection } from './storing_data/orm.js'
import { fetchUser, fetchCollection } from './getting_data/fetchSC.js'
import getToken from './getting_data/getToken.js'
import formatItems from './getting_data/formatItems.js'
import { Item } from './storing_data/Items.js'
import { createCountsByYear, setRemoteCount } from './storing_data/Counts.js'
import { v2 as cloudinary } from "cloudinary"

export default async function () {

	async function getListOfCDNResources(resources: Array<Record<string, any>>, next_cursor): Promise<Record<string, any>[]> {
		var params = {
			max_results: 500,
			next_cursor: null || next_cursor
		}
		let data = await cloudinary.api.resources(params)
		resources.push(...data.resources)
		next_cursor = data?.next_cursor
		if (next_cursor) {

			//params.next_cursor = next_cursor
			return getListOfCDNResources(resources, data.next_cursor)
		}
		else { return resources }
	}
	async function getAndStoreItems(countToRequest) {
		const { products } = await fetchCollection(countToRequest)

		const listOfCDNResources = await getListOfCDNResources([], null)

		let items = await formatItems(products, listOfCDNResources)

		//maintenant qu'on a tout, on stocke en base
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


	try {
		await checkDBConnection()
		await orm.sync()
		const user = await setuser()
		const remoteCount = await setRemoteCount(user)
		const localCount = await Item.count()

		/*
		const { resources: CDNImagesCount } = await cloudinary.api.usage()
		let needToDownloadImages =
				(CDNImagesCount as number < localCount ? true
					: false)
	*/
		if (remoteCount > localCount) {
			//On remplit une table avec le nombre d'items par année et par catégorie
			await getAndStoreItems(remoteCount - localCount)
			await createCountsByYear()
		}


	} catch (error) {
		console.log(error)
	}
}



