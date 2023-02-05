import Router from 'express-promise-router'
import express from 'express'

import * as validator from './validator.js'
import { config } from '../setEnv.js'
import { requestItems, requestCountsByYear } from '../storing_data/orm.js'
import { getNewItemsFromSC } from '../getting_data/new-items.js'

// Validation des routes, affreusement compliqué et à
const validateReq = (req: express.Request) => {
	const rules = [
		new validator.NoInvalidCategory(req),
		new validator.NoInvalidYear(req)
	]
	const errors: Array<object> = []

	for (const rule of rules) {
		if (!rule.isValid()) {
			errors.push({
				id: rule.errorId,
				message: rule.errorMessage,
			})
		}
	}
	return errors
}



export async function apiRoutes(fastify, options) {

	fastify.get('/counts', options, async function (req, reply) {
		try {
			const errors = validateReq(req)

			return await requestCountsByYear()
		} catch (e) {
			console.log(e)
			return e
		}
	})

	fastify.get('/items/:category/:year', options, async function (req, res) {
		const errors = validateReq(req)

		if (errors.length > 0) {
			return res.status(400).json({ errors: errors })
		}
		try {
			const response = await requestItems(req)
			return res.status(200).json(response)

		}
		catch (e) { throw e }
	})

}