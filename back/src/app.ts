#!/usr/bin/env ts-node
'use strict'

import { config } from './setEnv.js'

// imports placés après pour éviter des refs circulaires
import historyFallback from 'connect-history-api-fallback'
import serveStatic from 'serve-static'
import { createCountsByYear, Item, Setting as Settings } from './storing_data/orm.js'
import { router } from './serving_data/routes.js'
import initApp from './firstFetch.js'
import { fetchUser } from './getting_data/fetchSC.js'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import path from 'node:path'
import AutoLoad from '@fastify/autoload'


export async function app(fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
