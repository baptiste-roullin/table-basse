#!/usr/bin/env ts-node

//TODO : enregistrer errors et warnings dans /var/log
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

const port = Number(process.env.PORT) || 3000


import { fileURLToPath } from 'url'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)


const checkEnv = ['TB_USERNAME', 'CLOUDINARY_URL', 'TB_TOKEN'].every((el) => {
  return Object.keys(process.env).includes(el)
})

if (!checkEnv) {
  console.log('il manque une clé dans .env')
}


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

try {
  initApp()
} catch (error) {
  console.log(error)
}

