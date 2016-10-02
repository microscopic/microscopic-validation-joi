'use strict'

const Joi = require('joi')

class ValidationPlugin {
  static validate (options) {
    return (request, next) => {
      const methodDefinition = request._method.definition

      const params = request.params
      const paramsDefinition = methodDefinition.params

      if (!params || !paramsDefinition) {
        return next()
      }

      const result = Joi.validate(params, paramsDefinition, options)
      if (result.error) {
        return next(result.error)
      }

      next()
    }
  }

  static register (service, options = null) {
    service.ext('onPreMethod', ValidationPlugin.validate(options))
  }
}

module.exports = ValidationPlugin
