const Joi = require('joi')

const countrySchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().pattern(/^[A-Z]{2}$/).required()
})

const validateCountry = (country) => {

    const { error, value } = countrySchema.validate(country)

    if (error) throw new Error(`Validation error: ${error.details.map(e => e.message).join(', ')}`)
    return value

}

module.exports = validateCountry