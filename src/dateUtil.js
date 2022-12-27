function getWeekDayByDate (date) {
    const weekday = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    return weekday[date.getDay()] 
}


function getWeekDayByDate (year,month,day) {
    const dateStr = `${year}-${month}-${day}`
    const date = new Date(dateStr)
    
    const weekday = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    return weekday[date.getDay()] 
}

function getDaysInMonth(year,month) {
    return new Date(year,month,0).getDate()
}


module.exports = {
    getWeekDayByDate,
    getDaysInMonth
}