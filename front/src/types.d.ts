
export interface Item {
	universe: number
	id: number
	originalTitle: string
	frenchTitle: string
	dateRelease: string // type Date en back
	watchedDate: string
	watchedYear: number
	pageUrl: string
	slugTitle?: string
	fullPictureUrl?: string
	CDNUrl?: string
	directors?: string
	illustrators?: string
	creators?: string[]
}


export interface State {
	countsByCat: Record<string, number>,

	countsByYear: Record<string, Record<number, number>>,
	items: Item[],
	settings: {
		currentCategory: Category,
		initFront: boolean,
		zoom: number
	},
	logOfRequests: string[],
	categories: Category[],
	years: {
		yearsWithItems: number[],
		period: {
			start: number,
			end: number
		}
	}
}
export interface Category {
	code: number,
	label: string
}

declare module '@/components/vueSelect'