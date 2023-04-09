import { chromium } from 'playwright'


export default async function getToken(): Promise<string> {
	try {

		const browser = await chromium.launch({
			headless: false, logger: {
				isEnabled: (name, severity) => name === 'browser',
				log: (name, severity, message, args) => console.log(`${name} ${message}`)
			}
		})
		const context = await browser.newContext({ storageState: 'state.json' })
		let storageState = await context.storageState()

		const page = await context.newPage()
		await page.goto(process.env.TB_HOST)
		if (storageState.origins.length === 0 || storageState.origins[0].localStorage.length < 3) {
			//await page.click(".didomi-continue-without-agreeing")
			await page.click("#didomi-notice-agree-button")
		}

		await page.waitForLoadState('load')
		await page.click('[data-testid="text-header"]')

		const loggedinCheck = await page.locator('.avatar-img-wrapper').count()
		if (loggedinCheck === 0) {
			await page.type('[data-testid="signin-form"] input#email', process.env.TB_EMAIL)
			await page.type('[data-testid="signin-form"] input#password', process.env.TB_PWD)
			await page.keyboard.press('Enter')
		}
		await page.waitForLoadState('load')

		storageState = await browser.contexts()[0].storageState({ path: 'state.json' })
		await browser.close()
		const cookie = storageState.cookies.filter(
			item => item.name === 'SC_AUTH'
		)[0]
		return cookie.value

	} catch (error) {
		console.log(error)
	}
}
