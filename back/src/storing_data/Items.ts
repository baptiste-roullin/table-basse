import { Optional, Model, DataTypes, FindOptions, Op } from 'sequelize'
import { orm } from './orm.js'

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
