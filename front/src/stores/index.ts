

const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:3000'


import { defineStore } from 'pinia'

function removeDuplicates(storedItems: any[]) {
	// the inner function is the expected callback for the filter method, with current item as a first argumeent.
	// the outer function, removeDuplicates(), is there to pass storedItems as parameter
	return (newItem: { id: any }) => {
		// on ne retourne pas ce newItem si le 'some' en dessous renvoie vrai.
		return !storedItems.some((oldItem: { id: any }) => {
			//au moins un ancienn ID est identique aux nouveaux ID.
			//pas besoin de continuer à scanner le tableau : on retourne vrai.
			return oldItem.id === newItem.id
		})
	}
}



interface State {
	countsByCat: {
		string?: number
	},
	countsByYear: {
		number?: Record<number, number>
	},
	items: [],
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
interface Category {
	code: string,
	label: string
}

export const store = defineStore('tb', {
	state: (): State => ({
		countsByCat: {},
		countsByYear: {},
		items: [],
		settings: {
			currentCategory: { code: 'film', label: 'Films' },
			initFront: false,
			zoom: 2,
		},
		// enregistrer des couples année-catégorie pour éviter des requêtes inutiles
		logOfRequests: [],
		categories: [
			{ code: 'film', label: 'Films' },
			{ code: 'serie', label: 'Séries' },
			{ code: 'bd', label: 'Bande dessinées' },
			{ code: 'livre', label: 'Livres' },
			{ code: 'album', label: 'Albums' },
			{ code: 'jeuvideo', label: 'Jeux vidéo' },
			{ code: 'all', label: 'Toutes catégories' },
		],
		years: {
			//Liste des années non-vides, pour charger le <select>
			yearsWithItems: [],
			//années affichées
			// end prend la logique de array.slice(start, end) : Zero-based index BEFORE which to end extraction
			// du coup, y a un "end - 1" dans getItems() pour retrouver le bon index.
			period: { start: 0, end: 1 }
		},
	}),
	getters: {
		itemsForCategory: state => {
			const currentCat = state.settings.currentCategory.code
			const toDisplay = (item: { category: any }) => {
				return currentCat === item.category || currentCat === 'all'
			}
			return state.items.filter(toDisplay)
		}
	},
	actions: {
		async updateCounts() {

			try {
				const response = await fetch(`${baseURL}/api/counts`)
				if (response.status === 200) {
					const data = await response.json()
					if (data) {
						this.countsByYear = data.countsByYear
						this.countsByCat = data.countsByCat
						return data
					} else {
						console.log('stats : pas de réponse')
					}
				}
			}
			catch (e) {
				console.log('API not responding, you dunce')
			}
		},
		loadNonEmptyYears() {
			this.years.yearsWithItems = Object.keys(this.countsByYear).sort().reverse().map((key => Number(key)))
		},
		setCategory(val: any) {
			this.settings.currentCategory = val
		},
		setPeriod(val: any) {
			const { years } = this
			//Nullish coalescing operator
			years.period.start = val.start ?? years.period.start
			years.period.end = val.end ?? years.period.end
		},
		setZoom(val: any) {
			this.settings.zoom = val

		},
		setLog(val: any) {
			this.logOfRequests = [...val]

		},

		async getItems(yearSelected: string) {
			const { settings, years, logOfRequests } = this
			const cat = settings.currentCategory.code

			// year selected si une année a été choisie dans le <select<
			// yearsWithItems si click sur Année suivante
			const year = yearSelected || String(years.yearsWithItems[years.period.end - 1])

			if (!logOfRequests.includes(`${cat}-${year}`)) {
				try {
					const response = await fetch(`${baseURL}/api/items/${cat}/${year}`)
					if (response.status === 200) {
						const data = await response.json() as []

						if (data.length > 0) {
							console.log('données reçues')
							const storedItems = this.items
							this.logOfRequests.push(`${cat}-${year}`)
							// si store est vide, on ajoute tout
							if (storedItems.length === 0) {
								storedItems.push(...data)
							} else {
								//sinon, on enlève les doublons et on ajoute au store le reste
								const newItemsToPush = data.filter(removeDuplicates(storedItems))
								storedItems.push(...newItemsToPush)
							} return data
						} else {
							console.log(' items : pas  réponse vide')
						}
					}
				}
				catch (e) {
					console.log(e, 'API not responding, you dunce')
				}
			} else { console.log('requête déjà faite') }
		},

	},
})

