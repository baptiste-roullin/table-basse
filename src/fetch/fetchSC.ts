import { request, GraphQLClient, gql } from 'graphql-request'

import { config } from '../setEnv.js'
import { promises as fs } from 'fs';
import { Collection, User, UserStats } from '../../types.js';

async function fetchSC(token, operationName: 'UserDiary' | 'UserStats' | 'Product') {


	const endpoint = 'https://apollo.senscritique.com/';

	let variables = {
		username: config['TB_USERNAME'],
	}

	switch (operationName) {
		case 'UserDiary':
			Object.assign(variables, {
				isDiary: true,
				"limit": 20,
				"offset": 0,
				"universe": null,
				"yearDateDone": null
			})
			break;
		case 'UserStats':
			Object.assign(variables, {
				isDiary: true,
				"limit": 0,

			})
		default:
			break;
	}

	try {
		const res = await request({
			url: endpoint,
			document: await fs.readFile(`./src/fetch/${operationName}.gql`, { encoding: 'utf8' }),
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
				break;
		}


	} catch (error) {
		console.log(error);

	}

}


export async function fetchCollection(): Promise<Collection> {

	return await fetchSC(config.token, 'UserDiary') as Collection
}

export async function fetchUser(): Promise<User> {
	return await fetchSC(config.token, 'UserStats') as User
}