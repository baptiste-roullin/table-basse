// Validator is a base class. It should be extended to define a new Validator.
// Each extended classes should implement both:
// get errorMessage() {}
// function isValid() {}

import { categories } from "../types"


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


export class NoInvalidCategory extends Validator {
	allowedCategories: string[]
	count: number = 0
	superCount: number = 0

	constructor(req: Express.Request) {
		super(req)
		this.allowedCategories = [...categories]
		this.allowedCategories.push('all')

	}
	get errorMessage() {
		return `Expected ${this.allowedCategories.join('|')}, got ${this.req.params.category
			}`
	}

	isValid() {
		if (!this.allowedCategories.includes(this.req.params.category)) {
			return false
		}
		return true
	}
}
export class NoInvalidYear extends Validator {

	constructor(req: Express.Request) {
		super(req)
	}

	get errorMessage() {
		return `Expected a year between 1900  and the current year. Got ${this.req.params.year}`
	}

	isValid() {
		return /^\d{4}$/.test(this.req.params.year)

	}
}