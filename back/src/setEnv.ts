// Variables d'environnement obligatoires
import Path from 'path'
import dotenv from 'dotenv'
dotenv.config()
export const config = process.env
import { fileURLToPath } from 'url'
import path from 'node:path'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

//config.STATIC_URL = setStaticUrl()
const checkEnv = ['TB_USERNAME', 'TB_PWD', 'TB_EMAIL', 'CLOUDINARY_URL', 'TB_HOST'].every((el) => {
	return Object.keys(config).includes(el)
})
if (!checkEnv) {
	console.log('il manque une clé dans .env')
}

function setStaticUrl() {
	switch (config.NODE_ENV) {
		case 'production':
			console.log('env : ' + config.NODE_ENV)
			return Path.normalize('front/dist')
		default:
			throw new Error("please set NODE_ENV")
	}
}