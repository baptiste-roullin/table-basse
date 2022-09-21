import { promisify } from 'node:util'
import pMap from 'p-map'

import dotenv from 'dotenv'
dotenv.config()
import { Item } from '../types.js'

import { v2 as cloudinary } from "cloudinary";

export class Storage {
	async store(path: string, folder: string, fileName: string, type?: 'image' | 'raw') {

		//const uploadAsync = promisify(cloudinary.uploader.upload)
		try {
			return await cloudinary.uploader.upload(path,
				{ public_id: fileName, folder, resource_type: type, format: 'webp', width: 1500, height: 1500, crop: "limit" })

		} catch (error) {
			console.log(error)
		}
	}

	async storePictures(items: Array<any>) {
		const action = async (item: ItemT): Promise<any> => {
			if (!item.fullPictureUrl) { return item }
			let result = await this.store(item.fullPictureUrl, 'test', item.id, 'image')

			item.CDNUrl = result.secure_url
			return item
		}
		items = await pMap(items, action, { concurrency: 50 })
		return items
	}


}




