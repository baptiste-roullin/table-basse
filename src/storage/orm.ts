import dotenv from 'dotenv'
dotenv.config()

const categories = ["film", "livre", "jeuvideo", "serie", "bd", "album"]


import { Sequelize, DataTypes, Optional, ModelAttributes, Model, Op, FindOptions } from 'sequelize'


export const orm = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' })

export async function checkDBConnection() {
	try {
		await orm.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}




export interface ItemAttributes {
	category: string
	id: number
	originalTitle: string
	frenchTitle: string
	year: Date
	watchedDate?: string
	watchedYear?: Date
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
	public category: string
	public id: number
	public originalTitle: string
	public frenchTitle: string
	public year: Date
	public watchedDate?: string
	public watchedYear?: Date
	public pageUrl: string
	public slugTitle?: string
	public fullPictureUrl?: string
	public CDNUrl?: string
	public directors?: string
	public illustrators?: string
	public creators?: string[]
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;
}



Item.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	category: DataTypes.STRING,
	originalTitle: DataTypes.STRING,
	frenchTitle: DataTypes.STRING,
	year: DataTypes.INTEGER,
	watchedDate: DataTypes.DATE,
	watchedYear: DataTypes.DATE,
	pageUrl: DataTypes.STRING,
	slugTitle: DataTypes.STRING,
	fullPictureUrl: DataTypes.STRING,
	CDNUrl: DataTypes.STRING
}, {
	sequelize: orm,
	timestamps: true,
	paranoid: true,
	defaultScope: { attributes: { exclude: ['originalTitle', 'year', 'slugTitle', 'fullPictureUrl', 'createdAt'] } }
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
		timestamps: true,
		paranoid: true,
	})



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