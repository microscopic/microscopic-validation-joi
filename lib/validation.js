'use strict'

const Joi = require('joi')

class ValidationPlugin {
  static validation (request, next) {
    const methodDefinition = request._method.definition

    const params = request.params
    const paramsDefinition = methodDefinition.params

    if (!params || !paramsDefinition) {
      return next()
    }

    const result = Joi.validate(params, paramsDefinition)
    if (result.error) {
      return next(result.error)
    }

    next()
  }

  static register (service) {
    service.ext('onPreMethod', ValidationPlugin.validation)
  }
}

module.exports = ValidationPlugin
