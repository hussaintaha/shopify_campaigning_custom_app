
// export default 
function parseDate(input) {
    const currentDate = new Date();
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return currentDate.setDate(currentDate.getDate() + input)// months are 0-based
}

console.log(parseDate(5))