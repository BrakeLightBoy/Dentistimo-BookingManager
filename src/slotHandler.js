
//converts a string in a hh:mm time format (ex: 16:00) to the corresponding slot (ex: 32)
const stringToSlot = (timeStr) => {
    const hourMinutes = timeStr.split(':')
    
    const slot = (parseInt(hourMinutes[0])*2) + ((parseInt(hourMinutes[1])===30) ? 1:0)

    // console.log('orgStr:',timeStr)
    // console.log('slot:',slot)
    return slot
}

//converts a slot to a corresponding string in a time format hh:mm
const slotToString = (slot) => {

    const minutes = (slot % 2) ? '30' : '00'
    const hours = Math.floor(slot/2)
    const time = hours+":"+minutes

    // console.log('orgSlot:',slot)
    // console.log('time:',time)
    return time

}


const calcLunchSlots = (lunchTime) => {
    try {     
    const firstSlot = stringToSlot(lunchTime)
    return [firstSlot,firstSlot+1,firstSlot+2]
    } catch (error) {
        return []
    }}

const calcFikaSlot = (fikaTime) => {
    try {     
        return stringToSlot(fikaTime)
    } catch (error) {
        return null
    }
}

//returns the slots during which the clinic is operational (only for a singular day)
const calcClinicDaySlots = (dayOpeningHours) => {
    if(!dayOpeningHours){
        return [-1,-2]
    } else{
        const openCloseTimes = dayOpeningHours.split('-')
        const openingSlot = stringToSlot(openCloseTimes[0])
        const closingSlot = stringToSlot(openCloseTimes[1])-1
        return [openingSlot,closingSlot]   
    }
}

//calculates the opening and closing slot for every day of the week for the clinic
const calcClinicSlots = (openingHours) => {
    const weekSlots = {}
    for (const day in openingHours){
        weekSlots[day] = calcClinicDaySlots(openingHours[day])
    }
    return weekSlots
}

module.exports = {
    stringToSlot,
    slotToString,
    calcClinicDaySlots,
    calcClinicSlots,
    calcLunchSlots,
    calcFikaSlot
}