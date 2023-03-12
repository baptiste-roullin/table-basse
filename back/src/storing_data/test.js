import dotenv from 'dotenv'
dotenv.config()

import { v2 as cloudinary } from "cloudinary"



try {


	await cloudinary.search
		.expression('cat').execute()

} catch (error) {
	console.log(error)

}





"https://api.cloudinary.com/v1_1/hvpzbaqi0/resources/image/upload/369197?"
"https://api.cloudinary.com/v1_1/hvpzbaqi0/resources/image/upload/444032"