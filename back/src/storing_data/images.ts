import pMap from 'p-map'

import dotenv from 'dotenv'
dotenv.config()
import { Item } from './Items.js'

import { v2 as cloudinary } from "cloudinary"

export async function store(path: string, fileName: string, type?: 'image' | 'raw') {

	//const uploadAsync = promisify(cloudinary.uploader.upload)
	try {
		return await cloudinary.uploader.upload(path,
			{
				use_filename: true,
				unique_filename: true,
				overwrite: false,
				public_id: fileName,
				resource_type: type,
				format: 'webp',
				width: 1000,
				height: 1000,
				crop: "limit"
			})

	} catch (error) {
		console.log(error)
	}
}

export async function storePictures(items: Array<any>) {
	const action = async (item: Item): Promise<any> => {
		if (!item.fullPictureUrl) { return item }
		let result = await store(item.fullPictureUrl, String(item.id), 'image')

		item.CDNUrl = result.secure_url
		return item
	}
	items = await pMap(items, action, { concurrency: 50 })
	return items
}

export async function getPictureURL(publicId) {
	const media = await cloudinary.api.resource(publicId)
	return media.secure_url

}







