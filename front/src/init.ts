
import { store as useStore } from '@/stores/index'
import { useRoute } from 'vue-router'
import type { Category } from './types'
import { isNotEqual } from './utils'

export async function init() {
	const route = useRoute()
	const store = useStore()

	// On fixe la catégorie en la récupérant de l'URL

	//on récupère systématiquement des stats, au cas où il y a de nouveaux items
	const oldCountsByCat = store.countsByCat
	const { countsByCat } = await store.updateCounts()

	if (store.settings.initFront !== true) {
		await store.loadYearsWithItems()
		await store.setPeriod({ start: 0, end: 1 })
		store.setCategory(store.categories[1])
		await store.getItems(2023)
		//store.settings.initFront = true

	}
	const routeParams = route.params
	if (routeParams.category) {
		const catInParam = (cat: Category) => cat.label === route.params.category
		const cat = store.categories.find(catInParam) || store.categories[0]
		store.setCategory(cat)
	}
	if (routeParams.year) {
		const index = store.years.yearsWithItems.findIndex((el: any) => el === routeParams.year)
		console.log(index)
		await store.setPeriod({
			start: index,
			end: index + 1,
		})
	}
	console.log('il y a du nouveau')
	await store.setLog([])
	/*	if (oldCountsByCat) {
			//Si y a du nouveau par rapport au store
			if (isNotEqual(oldCountsByCat, countsByCat)) {

				console.log('il y a du nouveau')
				await store.setLog([])
				console.log(store.logOfRequests)
			}
		}*/
	try {

		const currentYear = (new Date()).getFullYear()
		await store.getItems(currentYear)

	} catch (error) {
		console.log(error)

	}

}