const MqttHandler = require('./MqttHandler')
const client = new MqttHandler().getClient() 

const clinicService = require('./services/clinic')
const appointmentService = require('./services/appointment')
const dentistService = require('./services/dentist')
const userService = require('./services/user')


const slotHandler = require('./slotHandler')
const dateUtil = require('./dateUtil')

//list of all retained appointment messages that have been posted
//prevents needless calculation if a client requests a month that is already posted
const postedEntries = []


function postAppointments(clinic, year, month){

    if(!postedEntries.includes(clinic+year+month)){
        // postedEntries.push(clinic+year+month)

        getClinicFreeSlots(clinic,year,month).then(res => {
            const resPayload = {data: res, operation: 'clinic-free-slots'}
            client.publish(`clinics/${clinic}/${year}/${month}`,JSON.stringify(resPayload),{qos:2, retain:true})
        }).catch(e => {
        })
    }
}

const getDentistFreeSlots = async function (dentistId, year, month) {
    const appointments = await appointmentService.getAppointmentsByDentistAndMonth(dentistId, year, month)
    const dentist = await dentistService.getDentistsById(dentistId)
    const clinic = await clinicService.getClinicById(dentist.works_at)
    const cHours = clinic.opening_hours.toJSON()
    const clinicHours = slotHandler.calcClinicSlots(cHours) 

    //implement fika and lunch time checks here
    const fikaSlot = slotHandler.calcFikaSlot(dentist.fika_time)
    const lunchSlots = slotHandler.calcLunchSlots(dentist.lunch_time)
    let dentistTakenSlots = fikaSlot ? [fikaSlot] : []
    dentistTakenSlots = dentistTakenSlots.concat(lunchSlots)

    const daysInMonth = dateUtil.getDaysInMonth(year,month)
    
    const freeSlots = {
        dentist: dentistId,
        month: month,
        year: year,
        days: []
    }
    
    for (let i=1; i<=daysInMonth; i++){
        const weekday = dateUtil.getWeekDayByDate(year,month,i)

        freeSlots.days[i-1] = {
            day:i,
            daySlots: new Set()
        }

        const currentDayHours= clinicHours[weekday]

        if(currentDayHours){
            for (let j=clinicHours[weekday][0]; j<=clinicHours[weekday][1]; j++){
                if(!dentistTakenSlots.includes(j)){
                    freeSlots.days[i-1].daySlots.add(j)
                }
            }
        }
    }
    

    for (const appointment of appointments){
        const appointDay = appointment.date.getDate()
        const timeStr =appointment.date.getHours()+":"+appointment.date.getMinutes()
        const appointSlot = slotHandler.stringToSlot(timeStr)
        
        const dayAppSet = freeSlots.days[appointDay-1].daySlots

        dayAppSet.delete(appointSlot)
    }
    return freeSlots
}



async function getClinicFreeSlots(clinicId, year, month){
    const dentists = await dentistService.getDentistsByClinic(clinicId)
    const clinic = await clinicService.getClinicById(clinicId);
    const daysInMonth = dateUtil.getDaysInMonth(year,month)

    const cHours = clinic.opening_hours.toJSON()
    const clinicHours = slotHandler.calcClinicSlots(cHours) 

    const totalSlots = {
        m: month,
        yr: year,
        slots: []
    }

    const allDentists = []

    for await (const dentist of dentists){
        const dentFreeSlots = await getDentistFreeSlots(dentist._id, year, month)
        allDentists.push(dentFreeSlots)
    }

    for (let i=1; i<=daysInMonth; i++){
        const weekday = dateUtil.getWeekDayByDate(year,month,i)
        const currentDayHours= clinicHours[weekday]

        if(currentDayHours){
            for(let cSlot=clinicHours[weekday][0]; cSlot<=clinicHours[weekday][1]; cSlot++){
                for (const dentSlots of allDentists){
                    if(dentSlots.days[i-1].daySlots.has(cSlot)){
                        totalSlots.slots.push({
                            d:i,
                            s:cSlot
                        })
                        break;
                    }
                }
            }
        }
    }
    return totalSlots
}


//add response if booking unsuccessful
async function registerBooking(userPnum,clinic,dt){
    const date = new Date(dt)
    if(!( (userPnum !== []) && userPnum && clinic && date)){
        console.log('Parameter value')
    } else {
               //getMonth is 0 indexed (returns int from 0 to 11)
        const month = date.getMonth()+1
        const year = date.getFullYear()

        let success = false

        const dentists = await dentistService.getDentistsByClinic(clinic)
        
        const user = await userService.getUserByPnum(userPnum)

        if(user){
            for await(const dentist of dentists){
                const result = await appointmentService.checkIfTaken(dentist._id,date)
                
                if(!result){
                    const appointment = await appointmentService.createAppointment(1,date,user._id,dentist._id,"reqId1")
                    await postAppointments(clinic, year, month)
                    return true
                    break;
                }
            }
        } else {
            console.log('No such user')
        }     
    }
}


module.exports = {
    postAppointments,
    getDentistFreeSlots,
    getClinicFreeSlots,
    registerBooking
}