import { Optional, Model, DataTypes } from 'sequelize'
import { getEnumKey, getEnumValue } from '../utils.js'
import { Item } from './Items.js'
import { Setting as Settings, Universes, orm, checkDBConnection } from './orm.js'

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
	declare "1": number
	declare "2": number
	declare "3": number
	declare "4": number
	declare "5": number
	declare "6": number
	declare "watchedYear": number
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


export async function requestCountsByYear() {
	const universes = getEnumValue(Universes) as Array<keyof CountInput>
	const countsByYearQuery = await Count.findAll()
	const promises = universes.map(async (cat) => {
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

	async function setCount(user) {
		const count = user.stats.diaryCount
		await Settings.upsert(
			{ name: 'count', value: count }
		)
		return count
	}

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
	/*	const input = {
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
		]*/

	const countsByCat = Object.assign({}, ...counts) as Record<string, Array<Record<('watchedYear' | "count"), number>>>
	//console.log("countsByCat", countsByCat)


	const countsByYear: CountAttributes[] = []
	for (let [cat, records] of Object.entries(countsByCat)) {

		records.forEach((record, index) => {

			if (countsByYear[record.watchedYear] === undefined) {
				countsByYear[record.watchedYear] = {} as CountAttributes
			}
			countsByYear[record.watchedYear][cat] = Number(record.count)

		})
	}
	const toDB = Object.entries(countsByYear).map(
		([key, values]: [...any]) => {
			return { watchedYear: key, ...values }
		}
	) as CountAttributes[]

	//console.log("to DB :", toDB)

	await Count.bulkCreate(toDB, { ignoreDuplicates: false, /*validate: true,*/ updateOnDuplicate: ["1", "2", "3", "4", "5", "6", "watchedYear"] })
	console.log("count finished")

}


export async function setRemoteCount(user) {
	const count = user.stats.diaryCount
	await Settings.upsert(
		{ name: 'count', value: count }
	)
	return count
}