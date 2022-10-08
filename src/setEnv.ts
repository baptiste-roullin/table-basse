// Variables d'environnement obligatoires
import Path from 'path'
import dotenv from 'dotenv'
dotenv.config()
export const config = process.env
config.STATIC_URL = setStaticUrl();
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
			return Path.normalize('front/dist');
		case 'dev':
			console.log('env : ' + config.NODE_ENV)
			return Path.normalize('front/public');
		default:
			throw new Error("please set NODE_ENV");
	}
}