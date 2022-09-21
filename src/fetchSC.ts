import { config } from './main.js'
import fs from 'node:fs/promises'
import { User } from './types.js';

export default async function fetchSC(token, operationName: 'UserDiary' | 'UserStats' | 'Product'): Promise<User> {


	async function gql(operationName) {
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
			default:
				break;
		}
		return {
			"operationName": operationName,
			"variables": variables,
			"query": await fs.readFile(`./src/queries/${operationName}.gql`, { encoding: 'utf8' })
		}
	}

	try {
		let url = 'https://apollo.senscritique.com/';
		let options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'authorization': token
			},

			body: JSON.stringify(
				[
					await gql(operationName)
				])
		}
		const res = await fetch(url, options)
		const data = await res.json()
		if (!res.ok) {
			throw Error(res.statusText)
		}
		if ('errors' in data[0]) {
			const err = data[0].errors[0]
			console.log(err.message, err.locations);
			throw new Error("erreur GraphqQL")
		}

		//console.log(data[0].data.user);
		return data[0].data.user
		//console.log(await data[0].data.user.collection.products.length, res.status);
	} catch (error) {
		console.error('error:' + error)
	}
}
