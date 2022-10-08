import Router from 'express-promise-router'
import express from 'express'

import * as validator from './validator.js'
import { config } from '../setEnv.js'
import { requestItems, requestCountsByYear } from '../storage/orm.js'
import { getNewItemsFromSC } from '../fetch/new-items.js'

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

export const router = Router()


router.route('/counts/').get(async (req, res) => {
	try {
		const response = await requestCountsByYear()
		return res.status(200).json(response)
	} catch (e) {
		console.log(e)
		return e
	}
})


// Requête des items en base, les renvoie au front
router.route('/items/:category/:year').get(async (req, res) => {
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


/*
// Importe de nouvaux items depuis Sens Critique
// Jamais déclenché actuellement, puisqu'un job heroku lance new-items-job.ts
router.route('/newItems/:category').get(async (req, res) => {
	const errors = validateReq(req)
	const newData = await getNewItemsFromSC('collection', req.params.category)
	res.status(200).send(newData)
})*/

/*router.route('/init/:username').post(async (req, res) => {
	console.log(req.params.username);

	const username = req.params.username
	//	firstInit(req.params.username)
	res.status(200).end()

	if (config.TB_USERNAME) {
		res.status(204)
	}
});*/


/*
longpoll.create("/routerpoll");

router.route('/').get(async (req, res) => {
	longpoll.publish("/routerpoll", {
		text: "app initialisée"
	});
	res.send("Sent data!");
})
*/
