import { request, GraphQLClient, gql } from 'graphql-request'

import { config } from '../setEnv.js'
import { promises as fs } from 'fs'
import { Collection, User, UserStats } from '../types.js'
import { Item } from '../storing_data/Items.js'
import { Setting } from '../storing_data/orm.js'

async function fetchSC(token, operationName: 'UserDiary' | 'UserStats' | 'Product', offset) {


	const endpoint = 'https://apollo.senscritique.com/'

	let variables = {
		username: config['TB_USERNAME'],
	}

	switch (operationName) {
		case 'UserDiary':
			Object.assign(variables, {
				isDiary: true,
				"limit": 2000,
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
		})

		if (!res || !res.user) {
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

export async function fetchCollection(): Promise<Collection> {
	/*	let index = offset
		while (Setting.findAll( {where: {name:"count"}}) >index ) {

		}*/
	return await fetchSC(config.token, 'UserDiary', 0) as Collection

}

export async function fetchUser(): Promise<User> {
	return await fetchSC(config.token, 'UserStats', 0) as User
}