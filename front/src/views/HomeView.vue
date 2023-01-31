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
import { onMounted, reactive } from "vue"
import items from "@/components/itemsList.vue"
import { debounce, changeTransformOrigin } from '@/utils'
import { store as useStore } from '@/stores/index'
import { init } from '@/init'
const store = useStore()

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

async function getNextYear() {
	const end = store.years.period.end + 1
	await store.setPeriod({ end: end })
	await store.getItems(end)
}

//init()
/*onMounted(() => {
	window.addEventListener(
		"resize",
		debounce(changeTransformOrigin, 500)
	)
})*/

</script>

<style >
@import "@/variables.css";

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
</style>