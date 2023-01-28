import { ItemAttributes } from '../storing_data/orm.js';
import { Collection, User } from '../../types.js';


export default function (rawItems: Collection['products']): ItemAttributes[] {

	return rawItems.map((item) => {

		return {
			universe: item.universe,
			id: item.id,
			originalTitle: item.originalTitle,
			frenchTitle: item.title,
			dateRelease: new Date(item.dateRelease),
			pageUrl: item.url,
			slugTitle: item.slug,
			fullPictureUrl: item.medias?.picture,
			watchedDate: item.currentUserInfos?.dateDone,
			watchedYear: item.currentUserInfos?.dateDone.slice(0, 4)
		}
	})
}