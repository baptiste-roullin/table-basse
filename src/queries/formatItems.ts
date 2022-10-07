import { Item, ItemAttributes } from '../storage/orm.js';
import { Collection, User } from '../types.d.js';


export default function (rawItems: Collection['products']): ItemAttributes[] {

	return rawItems.map((item) => {
		return {
			category: item.universe,
			id: item.id,
			originalTitle: item.originalTitle,
			frenchTitle: item.title,
			year: item.displayedYear,
			pageUrl: item.url,
			slugTitle: item.slug,
			fullPictureUrl: item.medias?.picture,
			watchedDate: item.currentUserInfos?.dateDone
		}
	})
}