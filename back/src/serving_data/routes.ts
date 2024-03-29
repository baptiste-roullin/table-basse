
import * as validator from './validator.js'

import { FastifyInstance, FastifyRequest } from 'fastify'
import { requestCountsByYear } from '../storing_data/Counts.js'
import { requestItems } from '../storing_data/Items.js'
import { getEnumValue } from '../utils.js'
import { getPictureURL } from '../storing_data/images.js'
import { MyRequest } from '../types.js'

// Validation des routes, affreusement compliqué et à
const validateReq = (req: FastifyRequest) => {
	const rules = [
		new validator.NoInvalidUniverse(req),
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


export async function apiRoutes(fastify: FastifyInstance, options) {

	fastify.get('/picture/:id', options, async function (req: MyRequest, res) {

		try {
			return await getPictureURL(req.params.id)
		} catch (e) {
			console.log(e)
			return e
		}
	})

	fastify.get('/counts', options, async function (req, res) {
		//TODO : paramétriser requête par univers

		try {
			validateReq(req)
			return await requestCountsByYear()
		} catch (e) {
			console.log(e)
			return e
		}
	})

	fastify.get('/items/:universe/:watchedYear', options, async function (req: MyRequest, res) {
		const errors = validateReq(req)

		if (errors.length > 0) {
			return res.badRequest()
		}
		try {
			return await requestItems(req)

		}
		catch (e) { throw e }
	})

}