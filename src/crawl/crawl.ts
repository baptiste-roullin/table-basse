
import cheerio from 'cheerio'
import got from 'got'
import dotenv from 'dotenv'
dotenv.config()
import puppeteer from 'puppeteer'
import { ItemT } from '../types'
import pMap from 'p-map'
import { config } from '../main'
import { pup } from './puppeteer'
import { extractItems, getFullPictureUrl, getWatchedDates } from './parse'

// Fonction principale
// Mode journal : utilisé lors de l'init pour récupérer toutes les oeuvres classées par date de visionnage, avec mention de cette date.
// Mode collection : utilisé lors d'un nouvel import, pour récupérer des items fraichement ajoutés, mais potentiellement visionnés y a longtemps. utilise Puppeteer
export async function crawl(category: string, mode: 'journal' | 'collection', pagesToCrawl: number): Promise<any> {
	switch (mode) {
		case 'journal':
			return await getPages(pagesToCrawl, mode, category)
		case 'collection':
			return await getPagesWithPup(pagesToCrawl, category)
		default:
			break;
	}
}



async function getPages(pagesToCrawl: number, mode: 'journal' | 'collection', category: string): Promise<ItemT[]> {

	let urlList: string[] = []
	for (let pageNumber = 1; pageNumber <= pagesToCrawl; pageNumber++) {
		const url = `${config.TB_HOST}/${config.TB_USERNAME}/${mode}/${category}/page-${pageNumber}.ajax`
		urlList.push(url)
	}

	const action = async (url): Promise<any> => {
		const $ = await getPageHTML(url)
		let items: Array<ItemT> = extractItems(mode, $, [], category)
		items = await getFullPictureUrl(items)
		return items
	}

	let resultsArray = await pMap(urlList, action, { concurrency: 20 })
	return resultsArray.flat()
}

async function getPagesWithPup(pagesToCrawl: number, category: string): Promise<ItemT[]> {
	const browser = await puppeteer.launch({ headless: false, userDataDir: 'pup', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
	//const browser = await puppeteer.launch({ headless: false, })

	// Le cas échéant, on ferme le popin RGPD et on se connecte.
	//Connexion obligatoire car dans les pages Collection, la date de visionnage n'est accessible que depuis le panneau d'ajout de score.
	const page = await browser.newPage()
	pup.blockRequests(page)
	//Page sans items mais fonctionnelle
	await page.goto(`${config.TB_HOST}/${config.TB_USERNAME}/collection/page-1000000000000000.ajax`)
	await pup.consent(page)

	if ((!(await pup.isLogged(page)))) {
		await pup.logInSC(page)
		console.log('is logged in Chromium');
	}

	let resultsArray: ItemT[] = []
	for (let pageNumber = 0; pageNumber < pagesToCrawl; pageNumber++) {
		const url = `${config.TB_HOST}/${config.TB_USERNAME}/collection/done/${category}/page-${pageNumber}.ajax`
		const page = await browser.newPage()
		pup.blockRequests(page)
		await page.goto(url)
		resultsArray = resultsArray.concat(await getItemsWithPup(category, url, page))
		page.close()
	}
	browser.close()

	return resultsArray
}

async function getItemsWithPup(category: string, url: string, page: puppeteer.Page): Promise<ItemT[]> {
	const $ = cheerio.load(await page.content())
	let items: Array<ItemT> = extractItems('collection', $, [], category)
	items = await getFullPictureUrl(items)
	items = await getWatchedDates(items, page)
	return items
}
async function getPageHTML(url: string) {

	try {
		const response = await got(url, {
			timeout: 20000,
			http2: true,
			headers: {
				'user-agent':
					'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/ 537.36(KHTML, like Gecko) Chrome/ 57.0.2987.133 Safari / 537.36',
			},
		})
		// S'il y a une redirection vers la page d'accueil de SC, c'est probablement que l'utilisateur n'existe pas
		if (response.statusCode === 301) {
			throw Error("This SensCritique user doesn't exist.")
		}
		else if (response.statusCode !== 200) {
			throw Error('SensCritique  might be unavailable or the URL is wrong')
		}
		const html = response.body

		if (!html) { throw Error('HTML is undefined') }
		return cheerio.load(html)

	} catch (err) {

		throw new Error(err)
	}
}

