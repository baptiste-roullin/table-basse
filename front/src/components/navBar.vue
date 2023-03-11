<template>
	<header class="nav">
		<h1>
			<router-link to="/"> Table basse </router-link>
		</h1>
		<nav class="controls">
			<!-- ZOOM -->
			<vue-slider @change="zoomChanged" ref="slider" v-model="store.settings.zoom" class="zoom" :min="0.5"
				:max="4" :interval="0.1" :tooltip="'none'" :contained="true"
				:dot-attrs="{ 'aria-label': 'Varier la taille des images des oeuvres' }" />

			<!-- CATEGORIE -->
			<VueSelect aria-controls="items-lists-container" @update:modelValue="selectCategory"
				:options="store.categories" :modelValue="store.settings.currentCategory.label" :searchable="false"
				:clearable="false" :selectable="
					(option: Category) => {
						return store.countsByCat[option.code] > 0 || option.code === 0
					}
				">
				<template v-slot:option="option: Category">
					<span class="inline-label">{{ option.label }}</span>
					<span
														class="inline-count"
														v-if="option.code === 0"
													>{{
														countsByCatTotal
													}}</span>
					<span
														class="inline-count"
														v-else
													>{{
														store.countsByCat[option.code]
													}}</span>
				</template>
			</VueSelect>

			<!-- ANNÉE -->
			<VueSelect aria-controls="items-lists-container" @update:modelValue="selectYear"
				:options="store.years.yearsWithItems" :modelValue="selectedYear" :searchable="false"
				:clearable="false" :selectable="
					(option: number) =>
						store.countsByYear[option][store.settings.currentCategory.code] > 0 ||
						store.settings.currentCategory.code === 0
				">
				<template v-slot:option="option">
					<!-- année -->
					<span
														class="inline-label"
														v-if="option.label === '0000'"
													>Vu un jour

													</span>
					<span
														class="inline-label"
														v-else
													>
														{{ option.label }}
													</span>
					<!-- compteur -->
					<span
														class="inline-count"
														v-if="store.settings.currentCategory.code === 0"
													></span>
					<span
														class="inline-count"
														v-else
													>{{
														store.countsByYear[option.label][store.settings.currentCategory.code]
													}}</span>
				</template>
			</VueSelect>
		</nav>
	</header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { useRouter } from 'vue-router'
import { store as useStore } from '@/stores/index'
//@ts-ignore
import VueSelect from '@/components/vueSelect'
import type { Category } from '@/types.js'
import { changeTransformOrigin, debounce } from '@/utils'
const router = useRouter()

const store = useStore()
store.countsByCat["2023"]





const countsByCatTotal = computed(() => {
	return Object.values(store.countsByCat).reduce((previous, current) => {
		return previous + current
	})
})


function zoomChanged(val: number) {
	//debounce a été pensé pour être utilisé en callback, d'où le () supplémentaire.
	debounce(changeTransformOrigin, 500)()
	store.settings.zoom = val
}

async function selectCategory(val: Category) {
	router.push({ path: `/items/${val.code}/` })
	store.setCategory(val)
	const { start, end } = store.years.period
	store.years.yearsWithItems.slice(start, end).forEach((year) => {
		store.getItems(year)
	})
}

const selectedYear = computed(() => {
	return (store.years.yearsWithItems[store.years.period.start] === 0 ?
		'Vu un jour' :
		store.years.yearsWithItems[store.years.period.start]
	)
})
async function selectYear(year: number) {
	router.push({
		path: `/items/${store.settings.currentCategory.code}/${year}`,
	})
	//bricolage car le select renvoie la valeur sélectionnée,
	// alors qu'on voudrait l'index de cette valeur dans le tableau des années chargées dans le select
	const index = store.years.yearsWithItems.findIndex((el) => el === year)

	await store.setPeriod({
		start: index,
		end: index + 1
	})
	await store.getItems(year)
}

</script>

<style  lang="scss">
@import "@/variables.scss";
@import "vue-select/dist/vue-select.css";
.nav {
	display: flex;
	flex-wrap: wrap;
}

.controls {
	vertical-align: middle;
	display: flex;
	flex-wrap: wrap;
	height: auto;
	align-content: center;
	align-items: center;
	font-size: 1.2em;
}

.nav {
	justify-content: space-between;
	h1 {
		margin-left: 1em;
	}
}

.controls > div {
	width: 18vw !important;
	min-width: 220px;
	margin: 1em auto;
	max-width: 250px;
}

@media screen and (max-width: 650px) {
	.controls > div {
		min-width: auto;
		max-width: none;
		width: 92vw !important;
		margin: 1em auto;
	}
	.controls .vue-slider {
		display: none !important;
	}
	.controls .vue-slider-dot {
		width: 16px !important;
		height: 16px !important;
	}
}

$themeColor: $accent-color;
$dotBgColor: scale-color($accent-color, $lightness: 50%);
$bgColor: #bbb;

.controls .vue-slider-rail {
	background-color: $white-3;
}

.controls .vue-slider-process {
	background-color: scale-color($themeColor, $blackness: 30%);
}
.controls .vue-slider-dot-handle-focus {
	background-color: scale-color($accent-color, $red: 30%);
}
.controls .vue-slider-dot-handle-focus:after {
	background-color: scale-color($accent-color, $red: 30%);
	width: 150%;
	height: 150%;
}

@media screen and (max-width: 30em) {
}

@import "../../node_modules/vue-slider-component/lib/theme/material.scss";

.controls .v-select {
	background-color: hsl(234, 50%, 20%);
	border-bottom: 1px solid $white-3;
}

@media screen and (min-width: 601px) {
	.controls .v-select .vs__dropdown-toggle {
		padding: 0.3em;
	}
}
@media screen and (max-width: 600px) {
	.controls .v-select .vs__dropdown-toggle {
		padding: 0.6em 0.3em;
	}
}

.controls .v-select .vs__open-indicator {
	fill: hsl(234.3, 33%, 69%);
}

.controls .v-select .vs__selected {
	color: $white-1;
	opacity: 1;
	margin: 0;
	padding: 0;
}

.controls .vs__selected-options {
	display: flex;
	flex-basis: 100%;
	flex-grow: 1;
	flex-wrap: wrap;
	padding: 0 8px;
	position: relative;
	align-content: center;
}

.controls .v-select .vs__dropdown-menu {
	background-color: $black-3;
	box-shadow: 2px 2px 4px $black-4;
}

.controls .v-select .vs__dropdown-option {
	color: $white-1;
}

.controls .v-select .vs__dropdown-option:hover {
	background: $black-1;
}
.controls .vs__dropdown-option--highlight {
	background-color: $black-1;
}

.controls .v-select .vs__dropdown-option--disabled {
	color: $white-3;
}

.controls .v-select .vs__dropdown-option {
	&.vs__dropdown-option--disabled:hover {
		background-color: $black-3;
	}
}

.controls .v-select .vs__dropdown-option--disabled .inline-label {
	text-decoration: line-through;
}

.controls .v-select .inline-count {
	color: $white-3;
}

@media screen and (min-width: 601px) {
	.controls .v-select .vs__dropdown-option {
		display: flex;
		justify-content: space-between;
		padding: 0.6rem;
	}
}

@media screen and (max-width: 600px) {
	.controls .v-select .vs__dropdown-option {
		display: flex;
		justify-content: space-between;
		padding: 1.2rem;
	}
}

.controls .v-select .vs__dropdown-menu {
	max-height: 440px;
}

.vs__actions {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 1;
}

.v-select .vs__actions {
	justify-items: flex-start;
	align-self: center;
	justify-content: flex-end;
	padding: 4px 20px 0 3px;
}
</style>