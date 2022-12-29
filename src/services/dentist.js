const Dentist = require('../models/dentist')

const getDentistsByClinic = async (clinic_id) => {
    try {
        if(clinic_id) {
            const dentists = await Dentist.find({works_at: clinic_id})
            return dentists
        } else {
            return Promise.reject('Clinic id cannot be null')
        }   
    } catch (error) {
        return Promise.reject(error.message)
    }
}

const getDentistsById = async (dId) => {
    try {
        if(dId) {
            const dentists = await Dentist.findById(dId)
            return dentists
        } else {
            return Promise.reject('Dentist id cannot be null')
        }   
    } catch (error) {
        return Promise.reject(error.message)
    }
}

module.exports = {
    getDentistsByClinic,
    getDentistsById
}

