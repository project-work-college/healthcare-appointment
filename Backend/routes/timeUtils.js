// Function to split time slots into 30-minute intervals
function splitTimeSlots(slots, interval = 30) {
    const allSlots = [];
  
    slots.forEach(slot => {
        const [startTime, endTime] = slot.split(/\s*-\s*/).map(time => time.trim());
        allSlots.push(...generateTimeSlots(startTime, endTime, interval));
    });
  
    return allSlots;
  }
  
  function generateTimeSlots(startTime, endTime, interval) {
    const slots = [];
    let current = new Date(`1970-01-01T${convertTo24Hour(startTime)}`);
    const end = new Date(`1970-01-01T${convertTo24Hour(endTime)}`);
  
    while (current < end) {
        let next = new Date(current);
        next.setMinutes(current.getMinutes() + interval);
  
        slots.push({ start: formatTime(current), end: formatTime(next) });
  
        current = next;
    }
    return slots;
  }
  
  // Convert 12-hour format (AM/PM) to 24-hour format
  function convertTo24Hour(time) {
    let [hour, minute = "00"] = time.match(/\d+/g); // Default to "00" if minutes are missing
    let ampm = time.includes("PM") ? "PM" : "AM";
    hour = parseInt(hour);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;
  }
  
  // Format time to 12-hour format
  function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }
  module.exports = { splitTimeSlots };