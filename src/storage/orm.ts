import dotenv from 'dotenv'
dotenv.config()

import { Sequelize, DataTypes, ModelAttributes, Op, FindOptions } from 'sequelize'
import { categories } from '../types'

let DBURL = ''
if (process.env.NODE_ENV === 'production') {
	DBURL = process.env.DATABASE_URL!
}
else {
	console.log('base de données de test');
	DBURL = 'postgres:postgres:admin@localhost:5432/postgres'
}

export const orm = new Sequelize(DBURL)


export const Item = orm.define('Item', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true
	},
	category: DataTypes.STRING,
	originalTitle: DataTypes.STRING,
	frenchTitle: DataTypes.STRING,
	year: DataTypes.INTEGER,
	watchedDate: DataTypes.STRING,
	watchedYear: DataTypes.STRING,
	pageUrl: DataTypes.STRING,
	slugTitle: DataTypes.STRING,
	fullPictureUrl: DataTypes.STRING,
	CDNUrl: DataTypes.STRING
}, {
	defaultScope: { attributes: { exclude: ['originalTitle', 'year', 'slugTitle', 'fullPictureUrl', 'createdAt'] } }
})
export const Conf = orm.define('Conf', {
	name: {
		type: DataTypes.STRING,
		primaryKey: true
	},
	value: DataTypes.STRING
}
)

function statAttributes(): ModelAttributes {
	let attrs: any = {}

	categories.forEach(cat => {
		attrs[cat] = { type: DataTypes.INTEGER, defaultValue: 0 }
	});
	return attrs
}


const attrs = statAttributes()
attrs.year = {
	type: DataTypes.STRING,
	primaryKey: true
}

export const Count = orm.define('Count', attrs, {
	defaultScope: { attributes: { exclude: ['updatedAt', 'createdAt'] } }
})



export async function requestItems(req) {
	const params = (): FindOptions => {
		if (req.params.category === 'all') {
			return {
				where: { watchedYear: req.params.year },
				order: [['watchedDate', 'DESC']]
			}
		}
		else {
			return {
				where: {
					[Op.and]: [{
						category: req.params.category,
						watchedYear: req.params.year
					}],

				},
				order: [['watchedDate', 'DESC']]

			}
		}
	}
	return await Item.findAll(params())
}


export async function requestCountsByYear() {
	const countsByYearQuery = await Count.findAll()
	const promises = categories.map(async (cat, index, array) => {
		return { [cat]: await Count.sum(cat) }
	})
	const countsByCatQuery = await Promise.all(promises)

	const countsByYear = {}
	countsByYearQuery.forEach((record: any) => {
		countsByYear[record.year] = record
	})
	const countsByCat = Object.assign({}, ...countsByCatQuery)

	return { countsByCat, countsByYear }
}

export async function createCountsByYear() {

	async function getCount(cat) {
		return {
			[cat]: await Item.count({
				where: { category: cat },
				attributes: ['watchedYear'],
				group: ["watchedYear"]
			})
		}
	}
	const promises = categories.map(cat => getCount(cat))
	const counts: Array<Object> = await Promise.all(promises)
	const countsByCat = Object.assign({}, ...counts)


	const countsByYear = {}
	for (const [cat, records] of Object.entries(countsByCat)) {
		if ((records as Object[]).length !== 0) {
			(records as Object[]).forEach((record: any) => {
				if (countsByYear[record.watchedYear] === undefined) {
					countsByYear[record.watchedYear] = {}
				}
				countsByYear[record.watchedYear][cat] = Number(record.count)
			});
		}
	}

	const toDB = Object.entries(countsByYear).map(
		([key, values]: [...any]) => {
			return { year: key, ...values }
		}
	)
	Count.bulkCreate(toDB, { updateOnDuplicate: categories })
}