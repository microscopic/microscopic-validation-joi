'use strict'

const chai = require('chai')
const sinon = require('sinon')

const expect = chai.expect

const Joi = require('joi')

const ValidationPlugin = require('../lib/validation')

describe('Validation Plugin', () => {
  describe('validation()', () => {
    it('should call next if params or params definition does not exist', (done) => {
      const request = {
        _method: {
          definition: {
            params: {
              a: Joi.number().integer().min(10).max(20),
              b: Joi.number().integer().min(1).max(5)
            }
          }
        }
      }

      ValidationPlugin.validation(request, (error) => {
        expect(error).to.be.undefined

        done()
      })
    })

    it('should return undefined if validation is ok', (done) => {
      const request = {
        params: { a: 11, b: 2 },
        _method: {
          definition: {
            params: {
              a: Joi.number().integer().min(10).max(20),
              b: Joi.number().integer().min(1).max(5)
            }
          }
        }
      }

      ValidationPlugin.validation(request, (error) => {
        expect(error).to.be.undefined

        done()
      })
    })

    it('should return error if is a problem with validation', (done) => {
      const request = {
        params: { a: 1, b: 2 },
        _method: {
          definition: {
            params: {
              a: Joi.number().integer().min(10).max(20),
              b: Joi.number().integer().min(1).max(5)
            }
          }
        }
      }

      ValidationPlugin.validation(request, (error) => {
        expect(error.isJoi).to.be.true
        expect(error.name).to.be.equal('ValidationError')

        done()
      })
    })
  })

  describe('register()', () => {
    it('should add onPreMethod extension to service', () => {
      const nextSpy = sinon.spy()
      const extSpy = sinon.spy()

      const service = {
        ext: extSpy
      }

      ValidationPlugin.register(service, nextSpy)

      expect(nextSpy.called).to.be.true
      expect(extSpy.calledWith('onPreMethod', ValidationPlugin.validation)).to.be.true
    })
  })
})
