import { ItemAttributes } from '../storing_data/Items.js'
import { Collection, User } from '../types.js'
import { getPictureURL, store, storePictures } from '../storing_data/images.js'


export default function (rawItems: Collection['products'], needToDownloadImages: Boolean): Promise<ItemAttributes[]> {

	const callback = async (item) => {
		let watchedDate: Date | undefined
		let rawDate: string
		let watchedYear: number

		if (item.otherUserInfos?.dateDone) {
			rawDate = item.otherUserInfos?.dateDone
			if (rawDate.length < 12) {
				const partialDate = rawDate.replace(/-/g, ',',).split(',')
				watchedDate = new Date(Number(partialDate[0]), Number(partialDate[1]), Number(partialDate[2]))
			}
			else {
				watchedDate = new Date(rawDate)
			}
			watchedYear = watchedDate.getFullYear()
		}
		else {
			watchedDate = undefined
			watchedYear = 0
		}
		if (Number.isNaN(watchedYear)) {
			debugger
		}
		let secure_url: string
		//TODO transformer et extraire en requête batch https://cloudinary.com/documentation/admin_api#get_details_of_a_single_resource_by_public_id
		// créer transaction avec une requête pour les infos de base puis une pour l'url cloudinary ?
		if (needToDownloadImages) {
			try {
				secure_url = await getPictureURL(item.id)
				console.log("image existe déjà " + secure_url)

				item.CDNUrl = secure_url
			} catch (error) {
				//console.log(error)
				//storage
				const image = await store(item.medias?.picture, String(item.id))
				secure_url = image.secure_url
			}
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


	return Promise.all(rawItems.map(callback))

}