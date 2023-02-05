import { ItemAttributes } from '../storing_data/Items.js'
import { Collection, User } from '../types.js'
import { getPictureURL } from '../storing_data/images.js'


export default async function (rawItems: Collection['products']): Promise<ItemAttributes[]> {

	const ret = rawItems
		.map(
			(item) => {
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
				return {
					universe: item.universe,
					id: item.id,
					//	originalTitle: item.originalTitle,
					frenchTitle: item.title,
					//	dateRelease: new Date(item.dateRelease),
					pageUrl: item.url,
					slugTitle: item.slug,
					fullPictureUrl: item.medias?.picture,
					watchedDate: watchedDate,
					watchedYear: watchedYear,
				}
			}) as ItemAttributes[]

	try {
		ret.forEach(async item => item.CDNUrl = await getPictureURL(item.id))
	} catch (error) {
		console.log(error)
	}
	return ret
}