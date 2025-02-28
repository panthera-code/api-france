const Joi = require('joi')

const departmentSchema = Joi.object({
    nom: Joi.string().required(),
    code: Joi.string().pattern(/^[0-9A-B]{1,3}$/).required(),
    codeRegion: Joi.string().pattern(/^[0-9]{1,2}$/).required()
})

const validateDepartment = (department) => {

    const { error, value } = departmentSchema.validate(department)

    if (error) throw new Error(`Validation error: ${error.details.map(e => e.message).join(', ')}`)
    return value

}

module.exports = validateDepartment