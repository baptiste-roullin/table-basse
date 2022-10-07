import { request, GraphQLClient, gql } from 'graphql-request'

import { config } from './main.js'
import { promises as fs } from 'fs';
import { Collection, User, UserStats } from './types.d.js';

async function fetchSC(token, operationName: 'UserDiary' | 'User' | 'Product') {


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
		case 'User':
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
			document: await fs.readFile(`./src/queries/${operationName}.gql`, { encoding: 'utf8' }),
			variables: variables,
			requestHeaders: {
				'authorization': token
			}
		})

		if (!res?.user) {
			throw new Error("réponse vide")
		}

		switch (operationName) {
			case 'UserDiary':
				return res.collection as Collection
			case 'User':
				return res.stats as User
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
	return await fetchSC(config.token, 'UserDiary') as User
}