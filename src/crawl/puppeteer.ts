import { config } from '../main'
import puppeteer, { Page } from 'puppeteer'

export const pup = {

	async consent(page: Page) {
		//popin RGPD
		try {
			await page.waitForSelector('[aria-label="J\'ACCEPTE"]')
			await page.click('{').then(() =>
				console.log('fermerture du popin rgpd'))
		}
		catch (e) {
			console.log('déjà fermé popin RGPD OU bug');
		}
	},
	async logInSC(page: Page) {

		await page.click('.header-connect').then(() =>
			console.log('ouverture du popin de connexion'))

		await page.waitForSelector('[data-rel="sc-hrf-email"]')

		async function cb(pwd, email) {
			(<HTMLInputElement>document.querySelector('[data-rel="sc-hrf-email"]')).value = email;
			const pwdInput = (<HTMLInputElement>document.querySelector('[data-rel="sc-hrf-password"]'));
			pwdInput.value = pwd;
			(<HTMLInputElement>document.querySelector('[data-rel="sc-login-submit"]')).click();
		}
		try {
			await page.evaluate(await cb, config.TB_PWD, config.TB_EMAIL);
			await page.waitForNavigation()

		} catch (e) {
			console.log(e);

		}
	},

	async isLogged(page) {
		const header = await page.$('.header.isConnected')
		if (header) { return true }
		else { return false }
	},
	isPup: function (page: any): page is puppeteer.Page {
		return page !== undefined
	},

	// Allége les pages en bloquant images, pubs et traceurs
	async blockRequests(page) {
		const blockedResources = [
			'quantserve', 'adzerk', 'doubleclick', 'adition', 'exelator', 'sharethrough', 'twitter', 'google-analytics', 'fontawesome', 'facebook', 'analytics', 'optimizely', 'clicktale', 'mixpanel', 'zedo', 'clicksor', 'tiqcdn', 'googlesyndication', 'smartadserver', 'adservice.google', 'sascdn', 'media.senscritique', 'zencdn'
		];
		await page.setRequestInterception(true);
		page.on('request', (request) => {
			if (request.url().endsWith('.png') || request.url().endsWith('.jpg'))
				request.abort()
			else if (blockedResources.some(resource => request.url().match(resource)))
				request.abort()
			else
				request.continue()
		})
	}

}

export function isPup(page: any): page is puppeteer.Page {
	return page !== undefined
}



