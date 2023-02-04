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


export async function router (fastify, options) {

const opts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  }
}

  fastify.get('/counts/',opts, (request, reply) => {
  reply.send({ hello: 'world' })/*	try {
		const response = await requestCountsByYear()
		return res.status(200).json(response)
	} catch (e) {
		console.log(e)
		return e
	}*/
})


// Requête des items en base, les renvoie au front
fastify.get('/items/:category/:year', async (req, res) => {
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