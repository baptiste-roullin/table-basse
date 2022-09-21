
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
	collection: Array<Record<string, any>>
}


enum Universes {

	"Films" = 1,
	"Livres" = 2,
	"Jeux vidéo" = 3,
	"Séries" = 4,
	"Musique" = 5,
	"BDs" = 6
}
