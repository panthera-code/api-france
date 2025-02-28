const Joi = require('joi')

const municipalitySchema = Joi.object({
    nom: Joi.string().required(),
    code: Joi.string().pattern(/^[0-9A-B]{5}$/).required(),
    codesPostaux: Joi.array().items(Joi.string().pattern(/^[0-9A-B]{5}$/)).required(),
    mairie: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(
            Joi.number().required(),
            Joi.number().required()
        ).length(2).required()
    }).required(),
    population: Joi.number(),
    codeDepartement: Joi.string().pattern(/^[0-9A-B]{1,3}$/).required()
})

const validateMunicipality = (municipality) => {

    const { error, value } = municipalitySchema.validate(municipality)

    if (error) throw new Error(`Validate error: ${error.details.map(e => e.message).join(', ')}`)
    return value

}

module.exports = validateMunicipality