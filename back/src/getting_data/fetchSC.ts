import { request } from 'graphql-request'

import { promises as fs } from 'fs'
import { Collection, User, UserStats } from '../types.js'

async function fetchSC(token, operationName: 'UserDiary' | 'UserStats' | 'Product', offset, limit = 2000) {


	const endpoint = 'https://apollo.senscritique.com/'
	console.log(process.env.tb_username)

	let variables = {
		username: process.env.tb_username,
	}

	switch (operationName) {
		case 'UserDiary':
			Object.assign(variables, {
				isDiary: true,
				"limit": limit,
				"offset": offset,
				"universe": null,
				"yearDateDone": null
			})
			break
		case 'UserStats':
			Object.assign(variables, {
				isDiary: true,
				"limit": 0,
			})
		default:
			break
	}

	try {
		const res = await request({
			url: endpoint,
			document: await fs.readFile(`./src/getting_data/${operationName}.gql`, { encoding: 'utf8' }),
			variables: variables,
			requestHeaders: {
				'authorization': token
			}
		}) as any

		if (!res || !res?.user) {
			throw new Error("réponse vide")
		}

		switch (operationName) {
			case 'UserDiary':
				return res.user.collection as Collection
			case 'UserStats':
				return res.user as User
			default:
				break
		}

	} catch (error) {
		console.log(error)
	}
}

export async function fetchCollection(limit): Promise<Collection> {
	/*	let index = offset
		while (Setting.findAll( {where: {name:"count"}}) >index ) {

		}*/
	return await fetchSC(process.env.tb_token, 'UserDiary', 0, limit) as Collection

}

export async function fetchUser(): Promise<User> {
	return await fetchSC(process.env.tb_token, 'UserStats', 0) as User
}