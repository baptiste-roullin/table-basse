
//declare enum categories { "film", "livre", "jeuvideo", "serie",  "musique", "bd" }

import { FastifyRequest } from 'fastify'



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

type MyRequest = FastifyRequest<{
	Params: {
		universe: string
		watchedYear: string
		id: string

	}
}>

