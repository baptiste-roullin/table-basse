#!/usr/bin/env ts-node

//TODO : enregistrer errors et warnings dans /var/log
import path from 'node:path'

import Fastify from 'fastify'
import cors from '@fastify/cors'
import staticServe from '@fastify/static'
import sensible from '@fastify/sensible'


import { config, __dirname } from './setEnv.js'
// imports placés après pour éviter des refs circulaires
import historyFallback from 'connect-history-api-fallback'
import { apiRoutes } from './serving_data/routes.js'
import initApp from './initApp.js'

const fastify = Fastify({
  logger: true
})

const port = Number(config.PORT) || 3000


try {
  fastify.register(sensible)
  fastify.register(staticServe, {
    root: path.join(__dirname, '../../front/dist'),
  })
  await fastify.register(cors)
  await fastify.register(apiRoutes, { prefix: 'api' })
  await fastify.listen({ port: port })
}
catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

/*//Au rechargement de page par l'utilisateur, réécrit l'URL pour renvoyer à index.html, afin que le routage soit géré par Vue.
app.use(historyFallback())
*/



try {
  initApp()
} catch (error) {
  console.log(error)
}


/*process.on('unhandledRejection', up => {
  console.log(up)
  throw up
})
*/
