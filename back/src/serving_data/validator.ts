// Validator is a base class. It should be extended to define a new Validator.
// Each extended classes should implement both:
// get errorMessage() {}
// function isValid() {}

import { FastifyRequest, FastifyTypeProvider } from 'fastify'
import { Universes } from '../storing_data/orm.js'
import { getEnumValue } from '../utils.js'


class Validator {
	req
	constructor(req) {
		// Request to validate
		this.req = req
	}

	// Set a default errorId
	get errorId() {
		return 'invalid_parameter'
	}
}


export class NoInvalidUniverse extends Validator {
	count: number = 0
	superCount: number = 0
	allowedCategories: number[]
	universe: number

	constructor(req: FastifyRequest) {
		super(req)
		this.allowedCategories = getEnumValue(Universes) as number[]
		this.universe = Number(this.req.params.universe)
	}
	get errorMessage() {
		return `Expected ${this.allowedCategories.join('|')}, got ${this.universe
			}`
	}

	isValid() {
		if (!this.allowedCategories.includes(this.universe)) {
			return false
		}
		return true
	}
}
export class NoInvalidYear extends Validator {

	constructor(req: FastifyRequest) {
		super(req)
	}

	get errorMessage() {
		return `Expected a year between 1900  and the current year. Got ${this.req.params.watchedYear}`
	}

	isValid() {
		return /^\d{4}$/.test(this.req.params.watchedYear)

	}
}