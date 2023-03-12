import { ItemAttributes } from '../storing_data/Items.js'
import { Collection, User } from '../types.js'
import { getPictureURL, store, storePictures } from '../storing_data/images.js'


export default function (rawItems: Collection['products']): Promise<ItemAttributes[]> {

	const cb = async (item) => {
		let watchedDate: Date | undefined
		let watchedYear: number

		if (item.otherUserInfos?.dateDone) {
			watchedDate = new Date(item.otherUserInfos?.dateDone)
			watchedYear = watchedDate.getFullYear()
		}
		else {
			watchedDate = undefined
			watchedYear = 0
		}
		let secure_url: string
		try {
			// TODO : commit url to base. with current request?
			secure_url = await getPictureURL(item.id)
			console.log("image existe déjà " + secure_url)

			item.CDNUrl = secure_url
		} catch (error) {
			console.log(`no existing picture for ${item.frenchTitle}`)
			//storage
			//TODO transformer et extraire en requête batch https://cloudinary.com/documentation/admin_api#get_details_of_a_single_resource_by_public_id
			const image = await store(item.medias?.picture, String(item.id))
			secure_url = image.secure_url
		}

		return {
			universe: item.universe,
			id: item.id,
			//	originalTitle: item.originalTitle,
			frenchTitle: item.title,
			//	dateRelease: new Date(item.dateRelease),
			pageUrl: item.url,
			slugTitle: item.slug,
			watchedDate: watchedDate,
			watchedYear: watchedYear,
			CDNUrl: secure_url
		}
	}


	return Promise.all(rawItems.map(cb))

}