export interface ItemT {
	category: string,
	id: string
	originalTitle: string
	frenchTitle: string
	year: number
	watchedDate?: string
	watchedYear?: string
	pageUrl: string
	slugTitle?: string
	fullPictureUrl?: string
	CDNUrl: string
	directors?: string
	illustrators?: string
	creators?: string[]
}

export const categories = ["film", "livre", "jeuxvideo", "serie", "bd", "album", "morceau"]


/*export interface Data {
	//items: {
	[Categories: string]: { string: Array<ItemT> }
	//}
}
*/
