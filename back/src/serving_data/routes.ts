
import * as validator from './validator.js'
import { config } from '../setEnv.js'
import { Universes } from '../storing_data/orm.js'
import { getNewItemsFromSC } from '../getting_data/new-items.js'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { requestCountsByYear } from '../storing_data/Counts.js'
import { requestItems } from '../storing_data/Items.js'
import { getEnumValue } from '../utils.js'


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

	fastify.get('/items/:universe/:watchedYear', options, async function (req, res) {
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