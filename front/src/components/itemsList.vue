<template>
	<div>
		<h2 class="inline-label year" v-if="props.year === '0000'">Vu un jour</h2>
		<h2 class="inline-label year" v-else> {{ props.year }}</h2>
		<div class="items">
			<a :href="`https://www.senscritique.com${item.pageUrl}`" v-for="(item) in itemsForCurrentYear()"
				:key="item.id"
				:class="`item ${store.settings.currentCategory.code} id-${item.id} ${(item.CDNUrl ? 'img' : 'no-img')} `"
				:title="`Fiche de l'oeuvre ${item.frenchTitle}`">
				<img class="item-img" v-show="isLoaded[item.id]" :src="item.CDNUrl"
					@load="loaded(item, $event.target)" alt="" />

				<div class="background" :style="`background-image: url(${item.CDNUrl});`"></div>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
//:selectable="option => !state.currentCategories.find(el => el === option)"

import { reactive, onUpdated } from 'vue'

import { store as useStore } from '@/stores/index'
const store = useStore()

function itemsForCurrentYear() {
	const items = store.itemsForCategory.filter((item) => item.watchedYear == props.year)
	if (store.settings.currentCategory.code === 0) {
		return items.sort((a, b) => Date.parse(b.watchedDate) - Date.parse(a.watchedDate))
	}
	else {
		return items
	}
}

//on n'affiche l'image que quand elle est chargée.
// les éléments de la liste étant chargés dynamiquement, on utilise $set() pour les rendre réactifs.
function loaded(item: { id: string | number }, el: HTMLImageElement | EventTarget | null) {
	if (!(el instanceof HTMLImageElement)) { return }

	isLoaded[item.id] = true

	const { naturalWidth, naturalHeight } = el
	if (naturalWidth > naturalHeight * 1.7) {
		//const imgRatio = (naturalWidth / naturalHeight).toPrecision(2).toString()
		el.parentElement!.classList.add('landscape')
	}
}

const props = defineProps(['year'])
const isLoaded = reactive({} as Record<string, boolean>)
onUpdated(() => {
	//changeTransformOrigin()
})

</script>
<style lang="scss">

@import "../variables.scss";

:root {
	--zoom-factor: ;
}

h1 {
	font-weight: normal;
	letter-spacing: 0.05em;
}

h2.year {
	margin: 1.5em auto 0;
	padding: 0.15em 0em;
	font-size: calc(22px + 2vmin * var(--zoom-factor));
	text-align: center;
	position: sticky;
	top: 0px;
	background-color: $black-1;
	z-index: 2;
}

@media screen and (max-width: 600px) {
	.items {
		display: flex;
		flex-wrap: wrap;
		margin: auto;
		padding: 0;
		transition: all 0.1s ease-in;
		a.item {
			height: auto;
			margin: 1rem auto;
			width: 100%;
			.item-img {
				height: auto;
				object-fit: fill;
			}
		}
	}
}

@media screen and (min-width: 601px) {
	.items {
		display: grid;
		align-items: flex-start;
		grid-auto-flow: dense;
		grid-gap: calc(0.16vmax * var(--zoom-factor));
		margin: auto;
		padding: 0;
		transition: all 0.1s ease-in;
		grid-template-columns: repeat(auto-fill,
				minmax(calc(0.35vmax * var(--zoom-factor) * 14), 3fr));
		grid-auto-rows: calc(0.52vmax * var(--zoom-factor) * 14);

		.item.landscape {
			grid-column-end: span 3;
		}
	}
}

.items {
	.item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		//position: relative;
		transition: all 0.2s ease-out;
		position: relative;
		overflow: hidden;

		.item-img {
			/*			max-width: calc(29vw * var(--zoom-factor)); */
			height: 100%;
			object-fit: cover;
			//background-color: grey;
			animation: fadein 0.2s;
		}
	}

	.item.landscape .background {
		display: block;
		width: 100%;
		height: 100%;
		filter: blur(22px);
		z-index: -1;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		position: absolute;
		filter: blur(13px);
		transform: scale(1.2);
	}

	.item.landscape .item-img {
		object-fit: contain;
	}

	@media screen and (hover: hover) and (min-width: 601px) {

		.item:hover,
		.item:focus {
			z-index: 9;
			height: max-content;
			align-self: center;
			transform: scale(clamp(1.07, calc(-0.5 * var(--zoom-factor) + 2.5), 2.5));
			transform-origin: center;
			//z-index: 9999;
			justify-content: center;
			align-items: center;
			box-shadow: 1px 2.5px 2.2px rgba(0, 0, 0, 0.051),
				2px 6px 5.3px rgba(0, 0, 0, 0.073), 4px 11.3px 10px rgba(0, 0, 0, 0.09),
				7px 20.1px 17.9px rgba(0, 0, 0, 0.107),
				15px 37.6px 33.4px rgba(0, 0, 0, 0.129),
				40px 90px 80px rgba(0, 0, 0, 0.18);

			.item-img {
				object-fit: cover;
				height: 100%;
				width: 100%;
			}
		}
	}

	.item.no-img {
		background: center / 60% no-repeat url('${empty}'),
			radial-gradient(222.79% 60.27% at 50% 50%, #005e7c 0%, #042c45 100%);
		border-image-slice: 1;
		border-image-source: linear-gradient(150deg,
				rgba(164, 194, 204),
				#2395b9 95%);
		width: 100%;
		height: 100%;
		display: flex;
	}

	.item.origin-left {
		transform-origin: left center;
	}

	.item.origin-right {
		transform-origin: right center;
	}

	.landscape:hover,
	.landscape:focus {
		/*max-height: calc(0.4vmax * var(--zoom-factor) * 14);*/
		transform: scale(clamp(1.03, calc(-0.4 * var(--zoom-factor) + 2.1), 1.4));
	}
}
</style>



