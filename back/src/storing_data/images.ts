import pMap from 'p-map'
import { Item } from './Items.js'

import { v2 as cloudinary } from "cloudinary"

export async function store(path: string, fileName: string) {

	try {
		return await cloudinary.uploader.upload(path,
			{
				overwrite: false,
				public_id: fileName,
				resource_type: "image",
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
		let result = await store(item.fullPictureUrl, String(item.id))

		item.CDNUrl = result.secure_url
		return item
	}
	items = await pMap(items, action, { concurrency: 50 })
	return items
}

export async function getPictureURL(publicId) {
	const media = await cloudinary.api.resource(publicId)
	if (media) {
		return media.secure_url
	}
	else {
		throw new Error(`no existing picture for ${publicId}`)

	}

}







