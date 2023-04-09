

export async function test(cloudinary) {


	try {
		let next_cursor = ''
		console.log(await cloudinary.api.resources())
		/*while (next_cursor !== undefined) {
			let data = await cloudinary.api.resources({ next_cursor: next_cursor })
			let listOfCDNResources = data.resources
			next_cursor = data?.next_cursor
		}*/


		/*await cloudinary.search
			.expression('cat').execute()*/

	} catch (error) {
		console.log(error)

	}

}





"https://api.cloudinary.com/v1_1/hvpzbaqi0/resources/image/upload/369197?"
"https://api.cloudinary.com/v1_1/hvpzbaqi0/resources/image/upload/444032"