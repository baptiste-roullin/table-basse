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

export const categories = ["film", "livre", "jeuvideo", "serie", "bd", "album"]


/*export interface Data {
	//items: {
	[Categories: string]: { string: Array<ItemT> }
	//}
}
*/
