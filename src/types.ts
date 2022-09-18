export interface ItemT {
	category: string,
	id: string
	originalTitle: string
	frenchTitle: string
	year: Date
	watchedDate?: string
	watchedYear?: Date
	pageUrl: string
	slugTitle?: string
	fullPictureUrl?: string
	CDNUrl?: string
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

export interface User {
	following: string
	isBlocked: boolean
	settings: {
		privacyProfile: boolean
	}
	stats: {
		diaryCount: number
	}
}


enum Universes {

	"Films" = 1,
	"Livres" = 2,
	"Jeux vidéo" = 3,
	"Séries" = 4,
	"Musique" = 5,
	"BDs" = 6
}
