const { promisify } = require('util')
import pMap from 'p-map'

import dotenv from 'dotenv'
dotenv.config()
import { ItemT } from '../types'

var cloudinary = require('cloudinary').v2



export class Storage {
	async store(path: string, folder: string, fileName: string, type?: 'image' | 'raw') {
		const uploadAsync = promisify(cloudinary.uploader.upload.bind(cloudinary.uploader))
		try {
			return await uploadAsync(path,
				{ public_id: fileName, folder, resource_type: type, format: 'webp', width: 1500, height: 1500, crop: "limit" })

		} catch (error) {
			console.log(error)
		}
	}

	async storePictures(items: Array<any>) {
		const action = async (item: ItemT): Promise<any> => {
			if (!item.fullPictureUrl) { return item }
			let result = await this.store(item.fullPictureUrl, 'test', item.id, 'image')
			//pictureCount()
			item.CDNUrl = result.secure_url
			return item
		}
		items = await pMap(items, action, { concurrency: 50 })
		return items
	}


}




