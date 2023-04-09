
import path from 'path'
import { fileURLToPath } from 'url'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

const checkEnv = ['TB_USERNAME', 'CLOUDINARY_URL', 'TB_TOKEN'].every((el) => {
	return Object.keys(process.env).includes(el)
})

if (!checkEnv) {
	console.log('il manque une clé dans .env')
}
