import { loadFiles } from '@graphql-tools/load-files'
const query = await loadFiles('./src/query.graphql')
export default async function checkConnection() {


	let url = 'https://apollo.senscritique.com/';
	let options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'authorization': '5fb8d21123591558e76eee7f429ce80e',
		},
		body: JSON.stringify
			([{ "operationName": "UserDiary", "variables": { "isDiary": true, "limit": 20, "offset": 0, "universe": null, "username": "Saint-Loup", "yearDateDone": null }, "query": "query UserDiary($isDiary: Boolean, $limit: Int, $offset: Int, $universe: String, $username: String!, $yearDateDone: Int) {\n  user(username: $username) {\n    ...UserMinimal\n    ...ProfileStats\n    collection(\n      isDiary: $isDiary\n      limit: $limit\n      offset: $offset\n      universe: $universe\n      yearDateDone: $yearDateDone\n    ) {\n      total\n      filters {\n        universe {\n          count\n          label\n          value\n          __typename\n        }\n        yearDateDone {\n          count\n          label\n          value\n          __typename\n        }\n        __typename\n      }\n      products {\n        ...ProductMinimal\n        currentUserInfos {\n          ...ProductUserInfos\n          __typename\n        }\n        otherUserInfos(username: $username) {\n          ...ProductUserInfos\n          lists {\n            id\n            label\n            listSubtype\n            url\n            __typename\n          }\n          review {\n            id\n            title\n            url\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      yearStats {\n        year\n        stats {\n          count\n          universe\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment UserMinimal on User {\n  ...UserNano\n  settings {\n    about\n    birthDate\n    country\n    dateLastSession\n    displayedName\n    email\n    firstName\n    gender\n    lastName\n    privacyName\n    privacyProfile\n    showAge\n    showProfileType\n    urlWebsite\n    username\n    zipCode\n    __typename\n  }\n  __typename\n}\n\nfragment UserNano on User {\n  following\n  id\n  isBlocked\n  isScout\n  name\n  url\n  username\n  medias {\n    avatar\n    backdrop\n    __typename\n  }\n  __typename\n}\n\nfragment ProductMinimal on Product {\n  ...CommonProductMinimalInfos\n  ...ProductProfessions\n  __typename\n}\n\nfragment CommonProductMinimalInfos on Product {\n  ...ProductNano\n  category\n  channel\n  dateCreation\n  dateLastUpdate\n  dateRelease\n  dateReleaseEarlyAccess\n  dateReleaseJP\n  dateReleaseOriginal\n  dateReleaseUS\n  displayedYear\n  duration\n  episodeNumber\n  frenchReleaseDate\n  listCount\n  numberOfEpisodes\n  numberOfSeasons\n  originalRun\n  originalTitle\n  parentTvShowId\n  productionStatus\n  retailReleaseDate\n  seasonId\n  seasonNumber\n  subtitle\n  synopsis\n  url\n  tvChannel {\n    name\n    url\n    __typename\n  }\n  countries {\n    id\n    name\n    __typename\n  }\n  franchises {\n    id\n    label\n    slug\n    url\n    __typename\n  }\n  gameSystems {\n    id\n    label\n    __typename\n  }\n  genresInfos {\n    id\n    label\n    slug\n    url\n    __typename\n  }\n  isbn\n  medias(backdropSize: \"1200\") {\n    randomBackdrop\n    backdrop\n    picture\n    screenshot\n    videos {\n      id\n      image\n      provider\n      type\n      __typename\n    }\n    __typename\n  }\n  soundtracks {\n    id\n    title\n    url\n    __typename\n  }\n  stats {\n    currentCount\n    ratingCount\n    recommendCount\n    reviewCount\n    wishCount\n    __typename\n  }\n  __typename\n}\n\nfragment ProductNano on Product {\n  id\n  rating\n  slug\n  title\n  universe\n  url\n  yearOfProduction\n  medias(backdropSize: \"1200\") {\n    backdrop\n    picture\n    screenshot\n    __typename\n  }\n  __typename\n}\n\nfragment ProductProfessions on Product {\n  actors {\n    name\n    person_id\n    url\n    __typename\n  }\n  artists {\n    name\n    person_id\n    url\n    __typename\n  }\n  authors {\n    name\n    person_id\n    url\n    __typename\n  }\n  tvChannel {\n    name\n    url\n    __typename\n  }\n  creators {\n    name\n    person_id\n    url\n    __typename\n  }\n  developers {\n    name\n    person_id\n    url\n    __typename\n  }\n  directors {\n    name\n    person_id\n    url\n    __typename\n  }\n  distributors {\n    name\n    person_id\n    url\n    __typename\n  }\n  illustrators {\n    name\n    person_id\n    url\n    __typename\n  }\n  musicLabels {\n    name\n    person_id\n    url\n    __typename\n  }\n  pencillers {\n    name\n    person_id\n    url\n    __typename\n  }\n  producers {\n    name\n    person_id\n    url\n    __typename\n  }\n  publishers {\n    name\n    person_id\n    url\n    __typename\n  }\n  translators {\n    name\n    person_id\n    url\n    __typename\n  }\n  __typename\n}\n\nfragment ProductUserInfos on ProductUserInfos {\n  dateDone\n  hasStartedReview\n  isCurrent\n  id\n  isDone\n  isListed\n  isRecommended\n  isRejected\n  isReviewed\n  isWished\n  productId\n  rating\n  userId\n  numberEpisodeDone\n  lastEpisodeDone {\n    episodeNumber\n    id\n    season {\n      seasonNumber\n      id\n      episodes {\n        title\n        id\n        episodeNumber\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  gameSystem {\n    id\n    label\n    __typename\n  }\n  review {\n    url\n    __typename\n  }\n  __typename\n}\n\nfragment ProfileStats on User {\n  likePositiveCountStats {\n    contact\n    feed\n    list\n    paramIndex\n    review\n    total\n    __typename\n  }\n  stats {\n    collectionCount\n    diaryCount\n    listCount\n    followerCount\n    ratingCount\n    reviewCount\n    scoutCount\n    __typename\n  }\n  __typename\n}\n" }]
			)
		/*		body: JSON.stringify(
					[
						{
							"operationName": "UserDiary",
							"variables": {
								"isDiary": true,
								"limit": 20,
								"offset": 0,
								"universe": null,
								"username": "Saint-Loup",
								"yearDateDone": null
							},
							"query": query.join()
						}
					])*/
	}
	try {
		const res = await fetch(url, options)
		const data = await res.json()
		if (!res.ok) {
			throw Error(res.statusText)
		}
		console.log(await data[0].data.user.collection.products.length, res.status);

	} catch (error) {
		console.error('error:' + error)
	}
}

/*export default async function checkConnection() {

	const request = require('request');

	const options = {
		method: 'POST',
		url: 'https://apollo.senscritique.com/',
		headers: {
			'Content-Type': 'application/json',
			authorization: '5fb8d21123591558e76eee7f429ce80e'
		},
		body: [
			{
				operationName: 'UserDiary',
				variables: {
					isDiary: true,
					limit: 20,
					offset: 20,
					universe: null,
					username: 'Saint-Loup',
					yearDateDone: null
				},
				query: 'query UserDiary($isDiary: Boolean, $limit: Int, $offset: Int, $universe: String, $username: String!, $yearDateDone: Int) {\n  user(username: $username) {\n    ...UserMinimal\n    ...ProfileStats\n    collection(\n      isDiary: $isDiary\n      limit: $limit\n      offset: $offset\n      universe: $universe\n      yearDateDone: $yearDateDone\n    ) {\n      total\n      filters {\n        universe {\n          count\n          label\n          value\n          __typename\n        }\n        yearDateDone {\n          count\n          label\n          value\n          __typename\n        }\n        __typename\n      }\n      products {\n        ...ProductMinimal\n        currentUserInfos {\n          ...ProductUserInfos\n          __typename\n        }\n        otherUserInfos(username: $username) {\n          ...ProductUserInfos\n          lists {\n            id\n            label\n            listSubtype\n            url\n            __typename\n          }\n          review {\n            id\n            title\n            url\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      yearStats {\n        year\n        stats {\n          count\n          universe\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment UserMinimal on User {\n  ...UserNano\n  settings {\n    about\n    birthDate\n    country\n    dateLastSession\n    displayedName\n    email\n    firstName\n    gender\n    lastName\n    privacyName\n    privacyProfile\n    showAge\n    showProfileType\n    urlWebsite\n    username\n    zipCode\n    __typename\n  }\n  __typename\n}\n\nfragment UserNano on User {\n  following\n  id\n  isBlocked\n  isScout\n  name\n  url\n  username\n  medias {\n    avatar\n    backdrop\n    __typename\n  }\n  __typename\n}\n\nfragment ProductMinimal on Product {\n  ...CommonProductMinimalInfos\n  ...ProductProfessions\n  __typename\n}\n\nfragment CommonProductMinimalInfos on Product {\n  ...ProductNano\n  category\n  channel\n  dateCreation\n  dateLastUpdate\n  dateRelease\n  dateReleaseEarlyAccess\n  dateReleaseJP\n  dateReleaseOriginal\n  dateReleaseUS\n  displayedYear\n  duration\n  episodeNumber\n  frenchReleaseDate\n  listCount\n  numberOfEpisodes\n  numberOfSeasons\n  originalRun\n  originalTitle\n  parentTvShowId\n  productionStatus\n  retailReleaseDate\n  seasonId\n  seasonNumber\n  subtitle\n  synopsis\n  url\n  tvChannel {\n    name\n    url\n    __typename\n  }\n  countries {\n    id\n    name\n    __typename\n  }\n  franchises {\n    id\n    label\n    slug\n    url\n    __typename\n  }\n  gameSystems {\n    id\n    label\n    __typename\n  }\n  genresInfos {\n    id\n    label\n    slug\n    url\n    __typename\n  }\n  isbn\n  medias(backdropSize: "1200") {\n    randomBackdrop\n    backdrop\n    picture\n    screenshot\n    videos {\n      id\n      image\n      provider\n      type\n      __typename\n    }\n    __typename\n  }\n  soundtracks {\n    id\n    title\n    url\n    __typename\n  }\n  stats {\n    currentCount\n    ratingCount\n    recommendCount\n    reviewCount\n    wishCount\n    __typename\n  }\n  __typename\n}\n\nfragment ProductNano on Product {\n  id\n  rating\n  slug\n  title\n  universe\n  url\n  yearOfProduction\n  medias(backdropSize: "1200") {\n    backdrop\n    picture\n    screenshot\n    __typename\n  }\n  __typename\n}\n\nfragment ProductProfessions on Product {\n  actors {\n    name\n    person_id\n    url\n    __typename\n  }\n  artists {\n    name\n    person_id\n    url\n    __typename\n  }\n  authors {\n    name\n    person_id\n    url\n    __typename\n  }\n  tvChannel {\n    name\n    url\n    __typename\n  }\n  creators {\n    name\n    person_id\n    url\n    __typename\n  }\n  developers {\n    name\n    person_id\n    url\n    __typename\n  }\n  directors {\n    name\n    person_id\n    url\n    __typename\n  }\n  distributors {\n    name\n    person_id\n    url\n    __typename\n  }\n  illustrators {\n    name\n    person_id\n    url\n    __typename\n  }\n  musicLabels {\n    name\n    person_id\n    url\n    __typename\n  }\n  pencillers {\n    name\n    person_id\n    url\n    __typename\n  }\n  producers {\n    name\n    person_id\n    url\n    __typename\n  }\n  publishers {\n    name\n    person_id\n    url\n    __typename\n  }\n  translators {\n    name\n    person_id\n    url\n    __typename\n  }\n  __typename\n}\n\nfragment ProductUserInfos on ProductUserInfos {\n  dateDone\n  hasStartedReview\n  isCurrent\n  id\n  isDone\n  isListed\n  isRecommended\n  isRejected\n  isReviewed\n  isWished\n  productId\n  rating\n  userId\n  numberEpisodeDone\n  lastEpisodeDone {\n    episodeNumber\n    id\n    season {\n      seasonNumber\n      id\n      episodes {\n        title\n        id\n        episodeNumber\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  gameSystem {\n    id\n    label\n    __typename\n  }\n  review {\n    url\n    __typename\n  }\n  __typename\n}\n\nfragment ProfileStats on User {\n  likePositiveCountStats {\n    contact\n    feed\n    list\n    paramIndex\n    review\n    total\n    __typename\n  }\n  stats {\n    collectionCount\n    diaryCount\n    listCount\n    followerCount\n    ratingCount\n    reviewCount\n    scoutCount\n    __typename\n  }\n  __typename\n}\n'
			}
		],
		json: true
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);

		console.log(body);
	});

}*/