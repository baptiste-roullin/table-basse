
import { store as useStore } from '@/stores/index'
const store = useStore()

// est appelé au changement de zoom, au chargement de nouveaux items et au redimensionnement de la fenêtre
export function changeTransformOrigin() {
	if (window.outerWidth < 600) {
		return
	}
	document.querySelectorAll('.items a').forEach((el, index) => {

		const pos = el.getBoundingClientRect()
		const threshold = 100 * 1 / store.settings.zoom

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
	})
}

// sert à limiter l'invocation en rafale de functions déclenchées lors d'un évènement continu, notamment le redimemensionnement d'une fenêtre.
// sert aussi à attendre que le navigateur ait finit de rendre à nouveau la page.
export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
	fn: F,
	delay: number,
) => {
	let timeout: ReturnType<typeof setTimeout>
	return function (...args: Parameters<F>) {
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			fn.apply(this, args)
		}, delay)
	}
}
