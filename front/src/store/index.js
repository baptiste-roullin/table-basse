import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";

const ajax = axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:3000',
})

Vue.use(Vuex)

function removeDuplicates (storedItems) {
	// the inner function is the expected callback for the filter method, with current item as a first argumeent.
	// the outer function, removeDuplicates(), is there to pass storedItems as parameter
	return newItem => {
		// on ne retourne pas ce newItem si le 'some' en dessous renvoie vrai.
		return !storedItems.some(oldItem => {
			//au moins un ancienn ID est identique aux nouveaux ID.
			//pas besoin de continuer à scanner le tableau : on retourne vrai.
			return oldItem.id === newItem.id
		})
	}
}

export default new Vuex.Store({
	plugins: [createPersistedState()],
	state: {

		/* {
			film:integer,
			livre:intger,
			...
		} */

		countsByCat: {
		},
		/* {
			2000: { film:integer, livre:intger, ... },
			1999:{ film:integer, livre:intger, ... },
			...
		} */
		countsByYear: {},
		items: [],
		settings: {
			currentCategory: '',
			initFront: false,
			zoom: 2,
		},
		// enregistrer des couples année-catégorie pour éviter des requêtes inutiles
		logOfRequests: [],
		categories: [
			{ code: 'film', label: 'Films', },
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
	},
	getters: {
		itemsForCategory: state => {
			const currentCat = state.settings.currentCategory.code
			const toDisplay = (item) => {
				return currentCat === item.category || currentCat === 'all'
			}
			return state.items.filter(toDisplay)
		}
	},
	mutations: {
		/*	PHASE(state, payload) {
				state.settings.phase = payload
			},*/
		UPDATE_LIST_ITEMS (state, { newItems, year, cat }) {
			const storedItems = state.items
			state.logOfRequests.push(`${cat}-${year}`)
			// si store est vide, on ajoute tout
			if (storedItems.length === 0) {
				storedItems.push(...newItems)
			} else {
				//sinon, on enlève les doublons et on ajoute au store le reste
				const newItemsToPush = newItems.filter(removeDuplicates(storedItems))
				storedItems.push(...newItemsToPush)
			}

		},
		UPDATE_COUNTS (state, payload) {
			state.countsByYear = payload.countsByYear
			state.countsByCat = payload.countsByCat
		},
		SET_CATEGORY (state, payload) {
			state.settings.currentCategory = payload
		},
		SET_PERIOD (state, payload) {
			const { years } = state
			//Nullish coalescing operator
			years.period.start = payload.start ?? years.period.start
			years.period.end = payload.end ?? years.period.end
		},
		LOAD_NONEMPTY_YEARS (state, payload) {
			state.years.yearsWithItems = Object.keys(state.countsByYear).sort().reverse()
		},
		SET_ZOOM (state, payload) {

			state.settings.zoom = payload
		},
		INIT (state, payload) {
			state.settings.initFront = payload
		},
		SETLOG (state, payload) {
			state.logOfRequests = [...payload];
		},
	},

	actions: {
		async updateCounts ({ commit }) {
			try {
				const response = await ajax.get(`/api/counts`)
				if (response.status === 200) {
					if (response.data) {
						commit('UPDATE_COUNTS', response.data)
						return response.data
					} else {
						console.log('stats : pas de réponse')
					}
				}
			}
			catch (e) {
				console.log('API not responding, you dunce')
			}
		},
		loadNonEmptyYears ({ commit }) {
			commit('LOAD_NONEMPTY_YEARS')
		},
		setCategory ({ commit }, val) {
			commit('SET_CATEGORY', val)
		},
		setPeriod ({ commit }, val) {
			commit('SET_PERIOD', val)
		},
		setZoom ({ commit }, val) {
			commit('SET_ZOOM', val)
		},
		setLog ({ commit }, val) {
			commit('SETLOG', val)
		},

		async getItems ({ commit }, yearSelected) {
			const { settings, years, logOfRequests } = this.state
			const cat = settings.currentCategory.code

			// year selected si une année a été choisie dans le <select<
			// yearsWithItems si click sur Année suivante
			let year = yearSelected || years.yearsWithItems[years.period.end - 1]

			if (!logOfRequests.includes(`${cat}-${year}`)) {
				try {
					const response = await ajax.get(`/api/items/${cat}/${year}`)
					if (response.status === 200) {
						if (response.data.length > 0) {
							console.log('données reçues')
							commit('UPDATE_LIST_ITEMS', { newItems: response.data, year, cat })
							return response.data
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
		//async launchInit ({ commit }) {
		//	const res = await ajax.post(`/api/init/${this.state.settings.username}`,)
		//	if (res.status === 200) {
		//		if (res.body !== '204') {
		//			console.log('init')
		//			commit('PHASE', 2)
		//		}
		//	}
		//},
	},
})
