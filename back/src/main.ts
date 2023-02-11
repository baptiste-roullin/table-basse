#!/usr/bin/env ts-node
import path from 'node:path'

import Fastify from 'fastify'
import cors from '@fastify/cors'
import staticServe from '@fastify/static'
import sensible from '@fastify/sensible'

import { config, __dirname } from './setEnv.js'
// imports placés après pour éviter des refs circulaires
import historyFallback from 'connect-history-api-fallback'
import { Setting as Settings } from './storing_data/orm.js'
import { apiRoutes } from './serving_data/routes.js'
import initApp from './firstFetch.js'
//import { fetchUser } from './getting_data/fetchSC.js'

import pg from '@fastify/postgres'

const fastify = Fastify({
  logger: true
})

const port = Number(config.PORT) || 3000


try {
  fastify.register(sensible)
  fastify.register(staticServe, {
    root: path.join(__dirname, '../../front/dist'),
    prefix: '/dist/'
  })
  await fastify.register(cors, {
    // put your options here
  })
  await fastify.register(apiRoutes, { prefix: 'api' })

  await fastify.listen({ port: port })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

/*//Au rechargement de page par l'utilisateur, réécrit l'URL pour renvoyer à index.html, afin que le routage soit géré par Vue.
app.use(historyFallback())
*/


//Un champ dans la table Settings détermine si l'app a été initialisée.
//On checke si elle existe et si elle est true
async function checkIfAppNeedInit() {
  await Settings.sync()
  let [initValue, created] = await Settings.findOrCreate({
    where: { name: 'initStatus' },
    defaults: { value: false }
  })
  initValue.value = true
  if (initValue.value !== 'true') {
    initApp(initValue)
  }
  else (
    console.log("app déjà initialisée")

  )
}

try {
  checkIfAppNeedInit()
  //const { collection: { products } } = await fetchSC(config.token, 'UserDiary')

} catch (error) {
  console.log(error)
}


/*process.on('unhandledRejection', up => {
  console.log(up)
  throw up
})
*/