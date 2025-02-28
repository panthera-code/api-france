const { Router } = require('express')
const router = Router()
const connection = require('../middlewares/connection')

const fs = require('fs')
const path = require('path')

const CountryService = require('../services/country').default
const countryRouter = require('../controllers/country')

const RegionService = require('../services/region').default
const regionRouter = require('../controllers/region')

const DepartmentService = require('../services/department').default
const departmentRouter = require('../controllers/department')

const MunicipalityService = require('../services/municipality').default
const municipalityRouter = require('../controllers/municipality')

router.use('/countries', countryRouter)
router.use('/regions', regionRouter)
router.use('/departments', departmentRouter)
router.use('/municipalities', municipalityRouter)

router.post('/france', connection, async (req, res) => {

    try {
        
        const sql = fs.readFileSync(path.join(__dirname, '../schemas/database.sql'), 'utf8')
        await req.database.query(sql)

        const countryService = new CountryService(req.database)
        await countryService.fetchCountries()

        const regionService = new RegionService(req.database)
        await regionService.fetchRegions()

        const departmentService = new DepartmentService(req.database)
        await departmentService.fetchDepartments()

        const municipalityService = new MunicipalityService(req.database)
        await municipalityService.fetchMunicipalities()

        res.status(201).json({ message: 'Database created successfully' })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

module.exports = router