

const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:3000'
import type { Category, Item, State } from '../types.js'

import { defineStore } from 'pinia'
export function removeDuplicates(storedItems: any[]) {
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

export const categories = [
	{ code: 0, label: 'Toutes catégories' },
	{ code: 1, label: 'Films' },
	{ code: 2, label: 'Livres' },
	{ code: 3, label: 'Jeux vidéo' },
	{ code: 4, label: 'Séries' },
	{ code: 5, label: 'Musique' },
	{ code: 6, label: 'Bande dessinées' },
]
export const store = defineStore('tb', {
	state: (): State => ({
		countsByCat: {},
		countsByYear: {},
		items: [],
		settings: {
			currentCategory: categories[0],
			initFront: false,
			zoom: 2,
		},
		// enregistrer des couples année-catégorie pour éviter des requêtes inutiles
		logOfRequests: [],
		categories: categories,
		years: {
			//Liste des années non-vides, pour charger le <select>
			yearsWithItems: [],
			//années affichées
			// end prend la logique de array.slice(start, end) : Zero-based index BEFORE which to end extraction
			// du coup, y a un "end - 1" dans getItems() pour retrouver le bon index.
			period: { start: 0, end: 3 }
		},
	}),
	getters: {
		itemsForCategory: state => {
			const currentCat = state.settings.currentCategory.code
			const toDisplay = (item: Item) => {
				return currentCat === item.universe || currentCat === 0
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
		loadYearsWithItems() {
			this.years.yearsWithItems = Object.keys(this.countsByYear).sort().reverse().map((key => Number(key)))
		},
		setCategory(val: Category) {
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

		async getItems(yearSelected: number) {
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
							console.log(' items : réponse vide')
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

