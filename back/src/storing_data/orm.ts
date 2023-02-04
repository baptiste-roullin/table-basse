import dotenv from 'dotenv'
dotenv.config()
import debug from'debug'
const error = debug('TB:error')
const warning = debug('TB:warning')


import { Sequelize, DataTypes, Optional, ModelAttributes, Model, Op, FindOptions } from 'sequelize'
import { Universes } from '../../types.d.js'
import { getEnumKey, getEnumValue } from '../utils.js'

export const orm = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' })

export async function checkDBConnection() {
	try {
		await orm.authenticate()
		warning('Connection has been established successfully.')
	} catch (err) {
		error('Unable to connect to the database:', err)
	}
}

export interface ItemAttributes {
	universe: number
	id: number
	originalTitle: string
	frenchTitle: string
	dateRelease: Date
	watchedDate: Date | number
	watchedYear: number
	pageUrl: string
	slugTitle?: string
	fullPictureUrl?: string
	CDNUrl?: string
	directors?: string
	illustrators?: string
	creators?: string[]
}

export interface ItemInput extends Optional<ItemAttributes, 'id'> { }
export interface ItemOuput extends Required<ItemAttributes> { }

export class Item extends Model<ItemInput, ItemOuput> implements ItemAttributes {
	public universe: number
	public id: number
	public originalTitle: string
	public frenchTitle: string
	public dateRelease: Date
	public watchedDate: Date | number
	public watchedYear: number
	public pageUrl: string
	public slugTitle?: string
	public fullPictureUrl?: string
	public CDNUrl?: string
	public directors?: string
	public illustrators?: string
	public creators?: string[]
	public readonly createdAt?: Date
	public readonly updatedAt?: Date
	public readonly deletedAt?: Date
}

Item.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	universe: DataTypes.INTEGER,
	originalTitle: DataTypes.STRING,
	frenchTitle: DataTypes.STRING,
	dateRelease: DataTypes.DATE,
	watchedDate: DataTypes.DATE,
	watchedYear: DataTypes.INTEGER,
	pageUrl: DataTypes.STRING,
	slugTitle: DataTypes.STRING,
	fullPictureUrl: DataTypes.STRING,
	CDNUrl: DataTypes.STRING
}, {
	sequelize: orm,
	timestamps: true,
	paranoid: true,
	defaultScope: { attributes: { exclude: ['originalTitle', 'dateRelease', 'slugTitle', 'fullPictureUrl', 'createdAt'] } }
}
)

export class Setting extends Model {
	name: string
	value: any
}

Setting.init(
	{
		name: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		value: DataTypes.STRING
	},
	{
		sequelize: orm,

	})

export interface CountAttributes {
	"1"?: number
	"2"?: number
	"3"?: number
	"4"?: number
	"5"?: number
	"6"?: number
	watchedYear: number
}

export interface CountInput extends Optional<CountAttributes, 'watchedYear'> { }
export interface CountOuput extends Required<CountAttributes> { }

export class Count extends Model<CountInput, CountOuput> implements CountAttributes {
	"1": number
	"2": number
	"3": number
	"4": number
	"5": number
	"6": number
	"watchedYear": number
}

Count.init(
	{
		"1": DataTypes.INTEGER,
		"2": DataTypes.INTEGER,
		"3": DataTypes.INTEGER,
		"4": DataTypes.INTEGER,
		"5": DataTypes.INTEGER,
		"6": DataTypes.INTEGER,
		watchedYear: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
	}, {
	sequelize: orm,
	timestamps: false,
	defaultScope: { attributes: { exclude: ['updatedAt', 'createdAt'] } }
})

export async function requestItems(req) {
	const params = (): FindOptions => {
		if (req.params.universe === 'all') {
			return {
				where: { watchedYear: req.params.watchedYear },
				order: [['watchedDate', 'DESC']]
			}
		}
		else {
			return {
				where: {
					[Op.and]: [{
						universe: req.params.universe,
						watchedYear: req.params.watchedYear
					}],

				},
				order: [['watchedDate', 'DESC']]

			}
		}
	}
	return await Item.findAll(params())
}


export async function requestCountsByYear(universes) {

	const categories = Object.keys(Universes) as Array<keyof CountInput>
	const countsByYearQuery = await Count.findAll()
	const promises = categories.map(async (cat) => {
		return { [cat]: await Count.sum(cat) }
	})
	const countsByCatQuery = await Promise.all(promises)

	const countsByYear = {}
	countsByYearQuery.forEach((record) => {
		countsByYear[record.watchedYear] = record
	})
	const countsByCat = Object.assign({}, ...countsByCatQuery)

	return { countsByCat, countsByYear }
}

export async function createCountsByYear() {
	const catNames = getEnumKey(Universes) as Array<keyof CountInput>
	const catID = getEnumValue(Universes)



	async function getCount(cat) {
		return {
			[cat]: await Item.count({
				where: { universe: cat },
				attributes: ['watchedYear'],
				group: ["watchedYear"]
			})
		}
	}
	const counts: Array<Record<string, Array<Object>>> = await Promise.all(
		catID.map(universe => getCount(universe))
	)
	const input = {
		'1': [
			{ watchedYear: 2022, count: 6 },
			{ watchedYear: 2021, count: 6 }
		],
		'2': [
			{ watchedYear: 2022, count: 6 },
			{ watchedYear: 2021, count: 6 }
		]
	}
	const output = [
		{ '1': 6, '2': 1, '3': 5, '4': 8, watchedYear: '2022' },
		{ '1': 6, '2': 1, '3': 5, '4': 8, watchedYear: '2021' }
	]

	const countsByCat = Object.assign({}, ...counts) as Record<string, Array<Record<('watchedYear' | "count"), number>>>
console.log(countsByCat)


	const countsByYear: CountAttributes[] = []
	for (let [cat, records] of Object.entries(countsByCat)) {

		return records.forEach((record, index) => {
			if (countsByYear[record.watchedYear] === undefined) {
				countsByYear[index][record.watchedYear]
			}
			countsByYear[record.watchedYear][cat] = record.count
			return
		})

	}


	const toDB = Object.entries(countsByYear).map(
		([key, values]: [...any]) => {
			return { watchedYear: key, ...values }
		}
	) as CountAttributes[]

console.log(toDB)

	Count.bulkCreate(toDB, { updateOnDuplicate: catNames, validate: true })
}