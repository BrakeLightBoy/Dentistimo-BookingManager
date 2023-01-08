const Appointment = require('../models/appointment')
const mongoose = require('mongoose')
const Dentist = require('../models/dentist')
const User = require('../models/user')


// Create a new appointment
const createAppointment = async (issuance, date, user_id, dentist_id, request_id) => {
    if(issuance && date && user_id && dentist_id && request_id){
        try{            
            const appointment = await Appointment.create({
                issuance: issuance,
                date: date,
                user_id: user_id,
                dentist_id: dentist_id,
                request_id: request_id
            });
            console.log(appointment)
            return appointment;

        } catch(e){
            console.log(e)
            return Promise.reject('Malformed appointment data');
        }

    } else {
       return Promise.reject('All appointment details must be filled')
    }
}

// Edit an already existing appointment
const editAppointment = async (id, newAppointment) => {
    if(id && newAppointment){
        try{
            const oldAppointment = await Appointment.findById({_id: id})
            
            if (!oldAppointment) {
                return Promise.reject({ message: 'Appointment does not exist', code: 404 });
            }

            const appointment = await Appointment.findByIdAndUpdate(
                {_id: id},
                {
                    date: newAppointment.date || oldAppointment.date,
                    dentist_id: newAppointment.dentist_id || oldAppointment.dentist_id
                },{new: true}
            )

            //await appointment.save(); 
            return appointment;

        } catch(e){
            console.log(e)
            return Promise.reject('Malformed appointment data');
        }

    } else {
       return Promise.reject('All appointment details must be filled')
    }
}

// Find existing appointments by date
const getAppointmentsByDate = async (date) => {
    if(date){     
        const appointment = await Appointment.findOne({date: date})

        return appointment;

    } else {
        return Promise.reject('Appointment date cannot be empty')
    }
}



// Find a specific user's appointments
const getAppointmentsByUser = async (personal_number) => {
    if(personal_number){     
        const user = await User.findOne({personal_number: personal_number})
        
        const userAppointments = await Appointment.find({user_id: user._id}).populate({
            path: 'dentist_id',
            populate: {
            path:'works_at',
            model:'Clinic'
            }
        }) 
        return userAppointments;

    } else {
        return Promise.reject('User personal number cannot be empty')
    }
}

// Return a specific dentist's appointments
const getAppointmentsByDentist = async (username) =>{
    try {
        if(username) {
            const dentist = await Dentist.findOne({username: username})

            const dentistAppointments = await Appointment.find({dentist_id: dentist._id}).populate({
                path: 'dentist_id',
                populate: {
                    path:'works_at',
                    model:'Clinic'
                }
            }).populate({
                path: 'user_id'
            }) ;

            return dentistAppointments;
        } else {
            return Promise.reject('Dentist id cannot be null')
        }   
    } catch (error) {
        return Promise.reject("Failed to get dentist appointments")
    }
}

const getAppointmentsByDentistAndMonth = async (dentist_id,year,month) =>{
    try {
        if(dentist_id && year && month && !isNaN(year) && !isNaN(month)) {
            const appointments = await Appointment.find({
                $and: [
                    {dentist_id: dentist_id},
                    {$expr: { "$eq": [{ "$month": "$date" }, month] }},
                    {$expr: { "$eq": [{ "$year": "$date" }, year] }}
                ]
            }).lean().populate({path: 'dentist_id', select: 'first_name last_name'}).exec();

            return appointments;
        } else {
            return Promise.reject('Invalid parameter')
        }   
    } catch (error) {
        return Promise.reject("Failed to get dentist appointments")
    }
}

const checkIfTaken = async (dentist_id,date) => {
    const appointment = await Appointment.findOne({$and: [
        {dentist_id: dentist_id},
        {date: date}
    ]})
    return appointment
}

// Find existing appointment by appointment ID
const getAppointmentById = async (id) => {
    if(id){     
        const appointment = await Appointment.findById({_id: id})

        return appointment;

    } else {
        return Promise.reject('Appointment ID cannot be empty')
    }
}

// Find existing appointment by appointment issuance
const getAppointmentByIssuance = async (issuance) => {
    if(issuance){     
        const appointment = await Appointment.findOne({issuance: issuance})

        return appointment;

    } else {
        return Promise.reject('Appointment issuance number cannot be empty')
    }
}

// Find and delete an existing appointment
const deleteAppointment = async (id) => {
    if(id){     
        console.log(id)

        const appointment = await Appointment.deleteOne({_id: id})

        return appointment;

    } else {
        return Promise.reject('Appointment ID cannot be empty')
    }
}


module.exports = {
    createAppointment,
    editAppointment,
    getAppointmentsByDate,
    getAppointmentsByUser,
    getAppointmentById,
    getAppointmentByIssuance,
    deleteAppointment,
    getAppointmentsByDentist,
    getAppointmentsByDentistAndMonth,
    checkIfTaken
}
