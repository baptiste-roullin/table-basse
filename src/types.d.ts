
declare enum categories { "film", "livre", "jeuvideo", "serie", "bd", "album" }


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
	stats: UserStats
	collection: Collection
	// Array<Record<string, any>>
}

export interface Collection {
	total: string
	filters: Record<string, any>
	products: Array<Record<string, any>>
	yearStats: Array<Record<string, any>>
}

export interface UserStats {
	diaryCount: number
}

declare enum Universes {

	"Films" = 1,
	"Livres" = 2,
	"Jeux vidéo" = 3,
	"Séries" = 4,
	"Musique" = 5,
	"BDs" = 6
}
