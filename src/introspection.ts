import path from "path"
import fs from "fs"

import {
	getIntrospectionQuery,
	printSchema,
	buildClientSchema
} from "graphql"

export default async function main() {
	const introspectionQuery = getIntrospectionQuery();

	try {
		const res = await fetch(
			"https://apollo.senscritique.com/",
			{
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					authorization: '5fb8d21123591558e76eee7f429ce80e'
				},
				body: JSON.stringify([{ query: introspectionQuery }])
			}
		);

		if (!res.ok) {
			throw Error(res.statusText)
		}
		const { data } = await res.json();

		console.log(introspectionQuery);

		const schema = buildClientSchema(data);
		console.log(printSchema(schema));

		const outputFile = path.join(__dirname, "./result.gql");

		await fs.promises.writeFile(outputFile, printSchema(schema));

	} catch (error) {
		console.error('error:' + error)

	}
}