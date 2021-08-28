
import cheerio from 'cheerio'
import got from 'got'
import sanitize from 'sanitize-filename'
import dotenv from 'dotenv'
dotenv.config()

import { ItemT } from '../types'


//Parse le HTML, extrait les infos souhaitées et les ajoute dans un objet Item
export function extractItems(
	mode: 'journal' | 'collection',
	$: Function,
	items: Array<ItemT>,
	category: string,
) {
	if (mode === 'journal') {
		var modeSelector = 'eldi'
		var itemSelector = '.eldi-collection-container'
		var catSelector = '.eldi-collection-poster'
	} else {
		var modeSelector = 'elco'
		var itemSelector = ".elco-collection-item"
		var catSelector = '.erra-global'

	}

	try {
		const itemContainer = $(itemSelector)
		if (itemContainer.length === 0) throw new Error(`empty selector for container \n ${itemContainer}`)

		itemContainer.each(function (this: void) {

			// vérification pour exclure morceaux d'album et épiosdes de séries.
			const check = $(this).find(catSelector).attr('href')
			if (check) {

				const item: ItemT = Object.create({})
				item.category = check.match(/^\/(.*?)\//)[1]

				item.id = $(this).find(`.${modeSelector}-collection-poster`)?.attr('data-sc-product-id')

				item.frenchTitle = $(this).find(`.elco-title a`)?.text().trim()
				if (!['morceaux', 'albums'].includes(category)) {
					const originalTitle = $(this).find(`.elco-original-title`)?.text().trim()
					item.originalTitle = originalTitle !== '' ? originalTitle : item.frenchTitle
				}

				item.year = Number(
					$(this)
						.find('.elco-date') //'elco' même dans les pages Journal
						?.text().trim().slice(1, -1)
				)
				// en mode collection, chopper la date est fait avec getWatchedDates(), car ça exige d'être connecté (via puppeeter)
				if (mode === 'journal') {
					// WARNING mois et jours peuvent être 00
					//on remonte jusqu'à un parent pour trouver la date.
					//'eldi-list-item' peut contenir plusieurs oeuvres, si vues à une date sans précision de jour ou de mois
					item.watchedDate = $(this).parents('.eldi-list-item').attr('data-sc-datedone')

					item.watchedYear = (item.watchedDate ? getYear(item.watchedDate) : '')
					if (!item.watchedYear) {
						throw new Error('no watchedYear could be crawled')
					}
				}

				item.pageUrl = $(this).find(`.elco-title a`)?.attr('href')


				const creators: Array<string> = []
				$(this)
					.find(`a.${modeSelector}-baseline-a`)?.each(function (this: void) {
						creators.push(
							$(this).text().trim()
						)
					})

				// l'attribut src est rempli en lazy loading. l'url est présente dans l'attribut data-original puis, lorsqu'on scrolle, est transférée à src.
				// data-original est ensuite effacé. src est toujours présent mais renvoie du charabia en base64 tant qu'il n'a pas l'URL.
				//Solution : si l'attribut data-original n'est pas trouvé, on essaye avec src
				const thumbPictureUrl = $(this).find(`.${modeSelector}-collection-poster img`).attr('src')

				if (thumbPictureUrl.includes('/missing/')) {
					item.slugTitle = sanitize(item.originalTitle)
					item.fullPictureUrl = undefined

				} else {

					item.slugTitle = thumbPictureUrl.match(/\/([^\/]*)\.(?:jpg|png|gif)/)[1]
					const pictureId = thumbPictureUrl.match(/\/media\/(\d*)/)[1]
					item.fullPictureUrl = `https://media.senscritique.com/media/${pictureId}/source_big/${item.slugTitle}`
				}

				items.push(item)
			}
		})

		return items
	}
	catch (e) {
		console.log(e);
		throw "test"

	}
}


export async function getFullPictureUrl(items: Array<ItemT>) {
	async function request(item: ItemT, format: string, index: number) {
		const res = await got(`${item.fullPictureUrl}.${format}`, {
			method: 'HEAD',
		})
		if (/image/.test(res.headers['content-type'])) {
			return res
		}
		return Promise.reject()


	}
	// pour chaque oeuvre
	for (const item of items) {
		//items.map((value, index) => { })
		//on fait une requête pour chaque format d'image on récupère la première réponse posisive
		const formats: Array<string> = ['webp', 'png', 'jpg', 'gif']
		try {
			if (item.fullPictureUrl) {
				//@ts-ignore
				const headRequest = await Promise.any(
					formats.map(request.bind(null, item))
				)
				//on remplace l'url sans l'extension de format par l'url avec extension
				item.fullPictureUrl = headRequest.url
			}

		}
		catch (error) {
			if (error.name === "AggregateError") {
				item.fullPictureUrl = undefined
			}
		}

	}
	return items
}

export async function getWatchedDates(items: ItemT[], page) {
	for (let i = 0; i < items.length; i++) {
		await page.hover(`.elco-collection-item:nth-child(${i + 1}) .elrua-useraction-action`)
		//await page.waitForNavigation({ waitUntil: 'networkidle0' })
		await page.waitForSelector(`[data-sc-product-id="${items[i].id}"] .cvi-date-done-container`)
		const item = items[i]
		item.watchedDate = await page.evaluate((i) => {
			return document.querySelectorAll('.cvi-date-done-container')[i]?.getAttribute('data-sc-date-done-value')
		}, i)
		item.watchedYear = getYear(item.watchedDate)

	}
	return items
}


export async function scapeGlobalCount(url) {

	const response = await got(url)
	const $ = cheerio.load(response.body)
	let totalItemsCount: number[] = []

	$('.d-button-menu-item[data-sc-diary-year] .elco-collection-count').each(
		function (this: void) {
			totalItemsCount.push(Number($(this).text().slice(1, -1)))
		}
	)
	return Math.ceil((totalItemsCount.reduce((a, b) => a + b, 0)))
}

function getYear(fullDate: string) {
	if (!fullDate) {
		return '0000'
	}
	return fullDate.match(/^\d{4}/)![0]
}
