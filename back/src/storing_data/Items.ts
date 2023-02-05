import { Optional, Model, DataTypes, FindOptions, Op } from 'sequelize'
import { getEnumKey, getEnumValue } from '../utils.js'
import { orm } from './orm.js'

export interface ItemAttributes {
	universe: number
	id: number
	originalTitle: string
	frenchTitle: string
	dateRelease: Date
	watchedDate: Date | undefined
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
	declare universe: number
	declare id: number
	declare originalTitle: string
	declare frenchTitle: string
	declare dateRelease: Date
	declare watchedDate: Date | undefined
	declare watchedYear: number
	declare pageUrl: string
	declare slugTitle?: string
	declare fullPictureUrl?: string
	declare CDNUrl?: string
	declare directors?: string
	declare illustrators?: string
	declare creators?: string[]
	declare readonly createdAt?: Date
	declare readonly updatedAt?: Date
	declare readonly deletedAt?: Date
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



export async function requestItems(req) {
	const params = (): FindOptions => {
		if (req.params.universe === '0') {
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
