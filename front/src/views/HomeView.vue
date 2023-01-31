<template>
	<main class="Home">
		<div id="items-lists-container" aria-live="polite" aria-atomic="false">
			<items class="items-container" :style="store.settings.zoom" v-for="year in displayedYears"
				:year="year" :key="year" :class="{ allCategories: allCategories }" />
		</div>
		<button class="load-more" type="button" @click="getNextYear" aria-controls="items-lists-container">
			Année précédente
		</button>
	</main>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import items from "@/components/itemsList.vue"
import { useRouter, useRoute } from 'vue-router'
import { isNotEqual, debounce, changeTransformOrigin } from '@/utils'
import { store as useStore } from '@/stores/index'
const store = useStore()
const route = useRoute()



const allCategories = reactive(() => {
	if (store.settings.currentCategory.code === 0) {
		return true
	} else {
		return false
	}
})
const displayedYears = reactive(() => {
	const { start, end } = store.years.period
	return store.years.yearsWithItems.slice(start, end)
})


async function init() {
	// On fixe la catégorie en la récupérant de l'URL

	//on récupère systématiquement des stats, au cas où il y a de nouveaux items
	const oldCountsByCat = store.countsByCat
	const { countsByCat } = await store.updateCounts()

	if (store.settings.initFront !== true) {
		await store.loadNonEmptyYears()
		await store.setPeriod({ start: 0, end: 1 })
		store.setCategory(store.categories[6])
		await store.getItems(2023)
		store.settings.initFront = true

	}
	const routeParams = route.params
	if (routeParams.category) {
		store.setCategory(
			store.categories.find(
				(elem: { code: any }) => elem.code === route.params.category
			)
		)
	}
	if (routeParams.year) {
		const index = store.years.yearsWithItems.findIndex((el: any) => el === routeParams.year)
		console.log(index)
		await store.setPeriod({
			start: index,
			end: index + 1,
		})

	}


	//Si y a du nouveau par rapport au store
	if (isNotEqual(oldCountsByCat, countsByCat)) {

		console.log('il y a du nouveau')

		await store.setLog([])
		console.log(store.logOfRequests)
	}

	await store.getItems(2023)

}

async function getNextYear() {
	const end = store.years.period.end + 1
	await store.setPeriod({ end: end })
	await store.getItems(end)
}

init()

window.addEventListener(
	"resize",
	debounce(changeTransformOrigin, 500)
)
</script>

<style scoped lang="scss">
@import "@/variables.scss";

@media screen and (min-width: 601px) {
	.Home {
		width: 99%;
	}
}
@media screen and (max-width: 600px) {
	.Home {
		width: 95%;
	}
}

.Home {
	margin: auto;
	position: relative;

	#items-lists-container {
		padding-bottom: 8rem;
	}

	.load-more {
		width: 100%;
		border: none;
		height: 3em;
		color: scale-color($accent-color, $lightness: 15%);
		background-color: rgba(38, 38, 41, 0.45);
		color: scale-color($color: $accent-color, $lightness: 25%);
		cursor: pointer;
		font-size: 1.3rem;
		margin: 2rem 0 0rem 0;
		padding: 0;
		position: absolute;
		bottom: 0;
		left: 0;
	}
}

//@import 'vue-accessible-modal/src/styles/core.scss';
</style>