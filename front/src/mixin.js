import { mapState } from "vuex";

export const myMixin = {
	computed: { ...mapState(["settings"]) },
	methods: {

		// est appelé au changement de zoom, au chargement de nouveaux items et au redimensionnement de la fenêtre
		changeTransformOrigin: function () {
			document.querySelectorAll('.items a').forEach((el, index) => {
				const pos = el.getBoundingClientRect()
				const threshold = 200 * 1 / this.settings.zoom

				//console.log(` left : ${pos.left}      threshold : ${threshold}      zoom : ${this.settings.zoom}`)
				if (pos.left < threshold) {
					el.classList.add('origin-left')
					el.classList.remove('origin-right')
				}
				else if ((window.outerWidth - pos.right) < threshold) {
					el.classList.add('origin-right')
					el.classList.remove('origin-left')
				}
				else {
					el.classList.remove('origin-left')
					el.classList.remove('origin-right')

				}
			});
		},

		// sert à limiter l'invocation en rafale de functions déclenchées lors d'un évènement continu, notamment le redimemensionnement d'une fenêtre.
		// sert aussi à attendre que le navigateur ait finit de rendre à nouveau la page.
		debounce (func, wait, immediate) {
			var timeout;
			return function () {
				var context = this, args = arguments;
				var later = function () {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		}
	}
}
