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
import initApp from './initApp.js'

const fastify = Fastify({
  logger: true
})

try {
  fastify.register(sensible)
  fastify.register(staticServe, {
    root: path.join(__dirname, '../../front/dist'),
  })
  await fastify.register(cors)
  await fastify.register(apiRoutes, { prefix: 'api' })
  await fastify.listen({ port: Number(process.env['PORT']) || 3000 })
}
catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

try {
  initApp()
} catch (error) {
  console.log(error)
}