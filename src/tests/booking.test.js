const db = require('./db')
const userService = require('../services/user')
const dentistService = require('../services/dentist')
const appointmentService = require('../services/appointment')
//const appointmentHandler = require('../appointmentHandler')
const clinicService = require('../services/clinic')
const User = require('../models/user')
const Dentist = require('../models/dentist')
const Appointment = require('../models/appointment')
const Clinic = require('../models/clinic')
const uuid = require('uuid')
const mongoose = require('mongoose')

//Before tests all the tests, creates and connects to a new test DB
beforeAll(async () => await db.connect());
//After each test, clear to database to give each test an empty DB
afterEach(async () => await db.clearDatabase());
//When all tests are done we delete the DB and close the connection to mongodb
afterAll(async () =>  await db.closeDatabase())

describe('Booking tests', () => {
    
    it('should successfully create an appointment', done => {
        User.create({first_name : 'Sam', last_name :'Jobara',
         password : 'jultomte', email_address: 'notjobara@chalmers.se',
          personal_number: '7205261235'}).then(user => {
          
             Clinic.create({
            name: "test-clinic",
            owner: "test-owner",
            address: "Spannmålsgatan 20",
            city: "Gothenburg",
            coordinate: {
              longitude: 11.969388,
              latitude: 57.707619
            },
            opening_hours: {
              monday: "9:00-17:00",
              tuesday: "8:00-17:00",
              wednesday: "7:00-16:00",
              thursday: "9:00-17:00",
              friday: "9:00-15:00",
            }}).then(clinic => {
                Dentist.create({first_name: 'dentistfirst', last_name:'dentistlast', password:'jultomte',
                username: 'dentist1', clinic: clinic._id}).then(dentist => {
                const date = new Date()
       
                const requestid = uuid.v1()
                appointmentService.createAppointment(1, date, user._id , dentist._id , requestid)
                .then(appointment => {
                expect(appointment.issuance).toEqual(1)
                expect(appointment.date.getTime()).toEqual(date.getTime())
                expect(appointment.dentist_id).toEqual(dentist._id)
                expect(appointment.user_id).toEqual(user._id)
                expect(appointment.request_id).toEqual(requestid)
                done()
                })      
                })
                })
              }) 
})
it('should successfully edit an appointment', done => {
  User.create({first_name : 'Sam', last_name :'Jobara',
         password : 'jultomte', email_address: 'notjobara@chalmers.se',
          personal_number: '7205261235'}).then(user => {
            
             Clinic.create({
            name: "test-clinic",
            owner: "test-owner",
            address: "Spannmålsgatan 20",
            city: "Gothenburg",
            coordinate: {
              longitude: 11.969388,
              latitude: 57.707619
            },
            opening_hours: {
              monday: "9:00-17:00",
              tuesday: "8:00-17:00",
              wednesday: "7:00-16:00",
              thursday: "9:00-17:00",
              friday: "9:00-15:00",
            }}).then(clinic => {
                Dentist.create({first_name: 'dentistfirst', last_name:'dentistlast', password:'jultomte',
                username: 'dentist1', clinic: clinic._id}).then(dentist => {
               
                const date = new Date()
                const requestid = uuid.v1()
                appointmentService.createAppointment(1, date, user._id , dentist._id , requestid)
                .then(appointment => {
                  const newDate = new Date()
                  const newAppointment = {date: newDate, dentist_id: appointment.dentist_id}
                  appointmentService.editAppointment(appointment._id, newAppointment).then(newAppointment => {
                    expect(newAppointment.issuance).toEqual(1)
                    expect(newAppointment.date).toEqual(newDate)
                    expect(newAppointment.dentist_id).toEqual(appointment.dentist_id)
                    expect(newAppointment.user_id).toEqual(appointment.user_id)
                    expect(newAppointment.request_id).toEqual(appointment.request_id)
                    done()
                  })
                })      
                })
                })
              })
})
              it('successfully get all the appointments for a date', done => {
                User.create({first_name : 'Sam', last_name :'Jobara',
                       password : 'jultomte', email_address: 'notjobara@chalmers.se',
                        personal_number: '7205261235'}).then(user => {
                          
                           Clinic.create({
                          name: "test-clinic",
                          owner: "test-owner",
                          address: "Spannmålsgatan 20",
                          city: "Gothenburg",
                          coordinate: {
                            longitude: 11.969388,
                            latitude: 57.707619
                          },
                          opening_hours: {
                            monday: "9:00-17:00",
                            tuesday: "8:00-17:00",
                            wednesday: "7:00-16:00",
                            thursday: "9:00-17:00",
                            friday: "9:00-15:00",
                          }}).then(clinic => {
                              Dentist.create({first_name: 'dentistfirst', last_name:'dentistlast', password:'jultomte',
                              username: 'dentist1', clinic: clinic._id}).then(dentist => {
                             
                              const date = new Date()
                              const requestid = uuid.v1()
                              appointmentService.createAppointment(1, date, user._id , dentist._id , requestid)
                              .then(appointment => {
                                 appointmentService.getAppointmentsByDate(date).then(userappointments => {
                                    console.log('4', userappointments)
                                    expect(userappointments.length).toEqual(1)
                                    done()
                                 })
                                })
                              })      
                              })
                              })
                            }) 
                                    

  /*it('get all the free slots for a clinic', done => {
  Clinic.create({
  name: "test-clinic",
  owner: "test-owner",
  address: "Spannmålsgatan 20",
  city: "Gothenburg",
  coordinate: {
  longitude: 11.969388,
  latitude: 57.707619
},
opening_hours: {
  monday: "9:00-17:00",
  tuesday: "8:00-17:00",
  wednesday: "7:00-16:00",
  thursday: "9:00-17:00",
  friday: "9:00-15:00",
}}).then(clinic => {
  appointmentHandler.getClinicFreeSlots(clinic._id, 2023, 1).then(slots => {
    console.log(slots)
  })
})
})
*/
})