

import { Item, Conf, orm, createCountsByYear } from './storage/orm'
import { config } from './main'
import { crawl } from './crawl/crawl'
import { scapeGlobalCount } from './crawl/parse'
import { Storage } from './storage/images'


export async function getNewItemsFromSC(mode: 'collection' | 'journal', cat: string) {
	orm.sync()
	const newGlobalCount = await scapeGlobalCount(`${config.TB_HOST}/${config.TB_USERNAME}/journal/${cat}/page-999999999.ajax`)

	let globalCountObject: any = await Conf.findByPk('scrappedCount')
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

	}

}