const Joi = require('joi')

const regionSchema = Joi.object({
    nom: Joi.string().required(),
    code: Joi.string().pattern(/^[0-9]{1,2}$/).required(),
})

const validateRegion = (country) => {

    const { error, value } = regionSchema.validate(country)

    if (error) throw new Error(`Validation error: ${error.details.map(e => e.message).join(', ')}`)
    return value

}

module.exports = validateRegion