
//@ts-nocheck

import { Item, ConfTable, orm, createCountsByYear } from './storage/orm.js.js'
import { config } from './main.js.js'
import { Storage } from './storage/images.js.js'


export async function getNewItemsFromSC(mode: 'collection' | 'journal', cat: string) {
	/*	orm.sync()
		const newGlobalCount = await scapeGlobalCount(`${config.TB_HOST}/${config.TB_USERNAME}/journal/${cat}/page-999999999.ajax`)

		let globalCountObject = await ConfTable.findByPk('scrappedCount')
		let oldGlobalCount = Number(globalCountObject.value)
		console.log(`oldGlobalCount : ${oldGlobalCount} -- newGlobalCount : ${newGlobalCount}`)

		const pagesToCrawl = Math.ceil((newGlobalCount - oldGlobalCount) / 20)
		if (pagesToCrawl > 0) {
			let items = await crawl(cat, 'collection', pagesToCrawl)
			console.log(`${items.length} nouveaux items ont été importés dans la catégorie ${cat} `)
			globalCountObject.value = String(newGlobalCount)
			globalCountObject.save()

			const storage = new Storage()
			items = await storage.storePictures(items)

			// maintenant qu'on a tout, on stocke en base
			await Item.bulkCreate(items, { ignoreDuplicates: true })
			await createCountsByYear()

		}
		else {
			console.log('rien de nouveau à importer');

		}*/

}