const Clinic = require('../models/clinic')
const mongoose = require('mongoose')

const dentistService = require('./dentist')
const appointmentService = require('./appointment')

// Create a clinic
const createClinic = async (newClinic) => {
    if(newClinic){
        try{
            const clinic = await Clinic.create(
                {
                    name: newClinic.name,
                    owner: newClinic.owner,
                    address: newClinic.address,
                    city: newClinic.city,
                    coordinate: {
                        longitude: newClinic.coordinate.longitude,
                        latitude: newClinic.coordinate.latitude,
                    },
                    opening_hours: {
                        monday: newClinic.opening_hours.monday,
                        tuesday: newClinic.opening_hours.tuesday,
                        wednesday: newClinic.opening_hours.wednesday,
                        thursday: newClinic.opening_hours.thursday,
                        friday: newClinic.opening_hours.friday
                    }
                }
            )
            return clinic;

        } catch(e){
            console.log(e)
            return Promise.reject('Malformed clinic data');
        }

    } else {
       return Promise.reject('All clinic details must be filled')
    }
}

// Find a clinic by its ID
const getClinicById = async (id) => {
    if(id){     
        const clinic = await Clinic.findById({_id: id})

        return clinic;

    } else {
        return Promise.reject('Clinic ID cannot be empty')
    }
}

// Retrieve all clinics
const getAllClinics = async () => {
    const clinics = await Clinic.find();
    
    if(clinics){     
        return clinics;

    } else {
        return Promise.reject('No clinics found')
    }
}

// Edit a clinic in the database
const editClinic = async (id, newClinic) => {
    if(id && newClinic){
        try{
            const oldClinic = await Clinic.findById({_id: id})

            if (!oldClinic) {
                return Promise.reject({ message: 'Clinic does not exist', code: 404 });
            }

            const clinic = await Clinic.findByIdAndUpdate(
                {_id: id},
                {
                    name: newClinic.name || oldClinic.name,
                    owner: newClinic.owner || oldClinic.owner,
                    address: newClinic.address || oldClinic.address,
                    city: newClinic.city || oldClinic.city,
                    longitude: newClinic.longitude || oldClinic.longitude,
                    latitude: newClinic.latitude || oldClinic.latitude,
                    monday: newClinic.monday || oldClinic.monday,
                    tuesday: newClinic.tuesday || oldClinic.tuesday,
                    wednesday: newClinic.wednesday || oldClinic.wednesday,
                    thursday: newClinic.thursday || oldClinic.thursday,
                    friday: newClinic.friday || oldClinic.friday
                }
            )

            await clinic.save(); 
            return clinic;

        } catch(e){
            console.log(e)
            return Promise.reject('Malformed clinic data');
        }

    } else {
       return Promise.reject('All clinic details must be filled')
    }
}

// Find and delete a clinic in the database
const deleteClinic = async (id) => {
    if(id){     
        const clinic = await Clinic.findByIdAndDelete({_id: id})

        return clinic;

    } else {
        return Promise.reject('Clinic ID cannot be empty')
    }
}

const getClinicAppointments = async (id) => {
    try {
        const dentists = await dentistService.getDentistsByClinic(id)
        if(!dentists){
            return Promise.reject('No dentists at clinic:'+id)
        }
        let appointments = []
        for await (const dentist of dentists){
            const dentistAppointments = await appointmentService.getAppointmentsByDentist(dentist._id)
            appointments = appointments.concat(dentistAppointments)
        } 
        console.log("ap1:",appointments)

        if(appointments.length === 0) {
            return Promise.reject('No appointments for clinic:'+id)
        } else {
            return appointments
        }

           
    } catch (error) {
        return Promise.reject(error.message)
    }
}

const getClinicAppointmentsByMonth = async (id,year,month) => {
    try {
        const dentists = await dentistService.getDentistsByClinic(id)
        if(!dentists){
            return Promise.reject('No dentists at clinic:'+id)
        }
        let appointments = []
        for await (const dentist of dentists){
            const dentistAppointments = await appointmentService.getAppointmentsByDentistAndMonth(dentist._id,year,month)
            appointments = appointments.concat(dentistAppointments)
        } 

        if(appointments.length === 0) {
            return Promise.reject('No appointments for clinic:'+id)
        } else {
            return appointments
        }

           
    } catch (error) {
        return Promise.reject(error.message)
    }
}

module.exports = {
    getClinicById,
    getAllClinics,
    editClinic,
    deleteClinic,
    createClinic,
    getClinicAppointments,
    getClinicAppointmentsByMonth
}
