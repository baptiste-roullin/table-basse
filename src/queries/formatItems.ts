import { ItemT } from '../types.js';

export default function (rawItems: Array<any>): ItemT[] {

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