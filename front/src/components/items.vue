<template>
	<div>
		<h2>{{ year }}</h2>
		<div class="items">
			<a
				v-bind:href="`https://www.senscritique.com${item.pageUrl}`"
				v-for="item in itemsForCurrentYear"
				:key="item.id"
				:class="`item ${settings.currentCategory.code} id-${item.id} ${(item.CDNUrl !== 'NULL' ? 'img' : 'no-img')} `"
				:title="`Fiche de l'oeuvre ${item.frenchTitle}`"
			>
				<img
					class="item-img"
					v-show="isLoaded[item.id]"
					:src="item.CDNUrl"
					@load="loaded(item, $event.target)"
					alt=""
				/>

				<div
					class="background"
					:style="`background-image: url(${item.CDNUrl});`"
				></div>
			</a>
		</div>
	</div>
</template>

<script>
import { log } from 'util'
//:selectable="option => !state.currentCategories.find(el => el === option)"

import { mapState, mapGetters } from 'vuex'
import { myMixin } from '../mixin.js'


export default {
	name: 'items',
	props: ['year', 'ratio'],
	mixins: [myMixin],

	updated() {
		this.changeTransformOrigin()
	},
	computed: {
		...mapState(['items', 'categories', 'settings', 'years']),
		...mapGetters(['itemsForCategory']),

		itemsForCurrentYear: function () {
			const array = this.itemsForCategory.filter((item) => item.watchedYear == this.year)
			if (this.settings.currentCategory.code === 'all') {
				return array.sort((a, b) => Date.parse(b.watchedDate) - Date.parse(a.watchedDate))
			}
			else {
				return array
			}
		},

	},

	data() {
		return {
			publicPath: process.env.BASE_URL,
			isLoaded: {},
		}
	},
	methods: {
		//on n'affiche l'image que quand elle est chargée.
		// les éléments de la liste étant chargés dynamiquement, on utilise $set() pour les rendre réactifs.
		loaded(item, el) {
			this.$set(this.isLoaded, item.id, true)

			//this.$set($attrs.ratio, )
			const { naturalWidth, naturalHeight } = el
			if (naturalWidth > naturalHeight * 1.7) {
				//const imgRatio = (naturalWidth / naturalHeight).toPrecision(2).toString()
				el.parentElement.classList.add('landscape')
			}
		},
	},
}
</script>

<style scoped lang="scss">
:root {
	--zoom-factor: ;
}

h1 {
	font-weight: normal;
	letter-spacing: 0.05em;
}

h2 {
	margin: 1.5em auto 0.5em;
	font-size: calc(22px + 2vmin * var(--zoom-factor));
	text-align: center;
}

.items {
	display: grid;
	align-items: flex-start;
	grid-auto-flow: dense;
	grid-gap: calc(0.15vmax * var(--zoom-factor));
	margin: auto;
	padding: 0;
	transition: all 0.1s ease-in;
	grid-template-columns: repeat(
		auto-fill,
		minmax(calc(0.35vw * var(--zoom-factor) * 14), 3fr)
	);
	grid-auto-rows: calc(0.52vmax * var(--zoom-factor) * 14);

	justify-content: center;
	align-content: center;

	.item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		//position: relative;
		transition: all 0.1s ease-in;
		position: relative;
		overflow: hidden;

		.item-img {
			/*			max-width: calc(29vw * var(--zoom-factor)); */
			height: 100%;
			object-fit: cover;
			//background-color: grey;
			animation: fadein 0.2s;
		}
		.background {
			display: none;
		}
	}
	/*  display: grid;
align-items: flex-start;
grid-auto-flow: dense;
margin: auto;
padding: 0;
transition: all .1s ease-in;
grid-auto-rows: 100px;
grid-template-columns: repeat( auto-fill, minmax(200px, 2fr) )

;*/

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
	.item.landscape {
		grid-column-end: span 3;
	}

	/*	.item.landscape:hover,
	.item.landscape:focus {
		transform: scale(calc((1.2 * 2 / var(--zoom-factor))));
	}*/

	.item:hover,
	.item:focus {
		z-index: 1;
		overflow: visible;
		/*		transform: scale(calc((1.3 * 2 / var(--zoom-factor)))) rotate(2deg);
*/
		transform: scale(1.3);
		transform-origin: center;
		//z-index: 9999;
		transition: transform 0.5s ease-out;
		justify-content: center;
		align-items: center;
		.item-img {
			object-fit: cover;
			box-shadow: 1px 2.5px 2.2px rgba(0, 0, 0, 0.051),
				2px 6px 5.3px rgba(0, 0, 0, 0.073), 4px 11.3px 10px rgba(0, 0, 0, 0.09),
				7px 20.1px 17.9px rgba(0, 0, 0, 0.107),
				15px 37.6px 33.4px rgba(0, 0, 0, 0.129),
				40px 90px 80px rgba(0, 0, 0, 0.18);
		}
		.background {
			display: none;
		}
	}

	.item.no-img {
		background: center / 60% no-repeat url("~@/assets/empty2.svg"),
			radial-gradient(222.79% 60.27% at 50% 50%, #005e7c 0%, #042c45 100%);
		border-image-slice: 1;
		border-image-source: linear-gradient(
			150deg,
			rgba(164, 194, 204),
			#2395b9 95%
		);
		display: flex;
	}
	.item.origin-left {
		transform-origin: left center;
	}
	.item.origin-right {
		transform-origin: right center;
	}
	.item.origin-left.landscape {
		transform-origin: calc(-20% * var(--zoom-factor));
	}
	.item.origin-right.landscape {
		transform-origin: calc(120% * var(--zoom-factor));
	}
	.landscape {
		&:hover img,
		&:focus img {
			max-height: calc(0.4vmax * var(--zoom-factor) * 14);
		}
	}
}
</style>



