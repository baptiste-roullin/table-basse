import dotenv from 'dotenv'
dotenv.config()
import debug from 'debug'
const error = debug('TB:error')
const warning = debug('TB:warning')
export enum Universes {

	"Films",
	"Livres",
	"Jeux vidéo",
	"Séries",
	"Musique",
	"BDs",
}

import { Sequelize, DataTypes, Model, Op, FindOptions } from 'sequelize'


export const orm = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres'
}
)

export async function checkDBConnection() {
	try {
		await orm.authenticate()
		warning('Connection has been established successfully.')
	} catch (err) {
		error('Unable to connect to the database:', err)
	}
}



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




