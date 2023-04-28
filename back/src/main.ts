#!/usr/bin/env ts-node

//TODO https://github.com/fastify/help/issues/74
//TODO : enregistrer errors et warnings dans /var/log
import { __dirname } from './setEnv.js'
import path from 'node:path'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import staticServe from '@fastify/static'
import sensible from '@fastify/sensible'
import { apiRoutes } from './serving_data/routes.js'
import updatingData from './storing_data/updatingData.js'

const fastify = Fastify({
  logger: true
})

try {
  fastify.register(sensible)
  fastify.register(staticServe, {
    root: path.join(__dirname, '../../front/dist'),
  })
  await fastify.register(cors)

  fastify.setNotFoundHandler({

  }, function (request, res) {
    res.status(200).sendFile("/")
  }
  )

  await fastify.register(apiRoutes, { prefix: 'api' })
  await fastify.listen({ port: Number(process.env['PORT']) || 3000 })
}
catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

try {
  //await updatingData()
} catch (error) {
  console.log(error)
}
