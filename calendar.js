window.addEventListener('DOMContentLoaded', () => {

    document.getElementById('backBtn').addEventListener('click', () => {
        window.history.back();
    });
    
    const monthYear = document.getElementById("monthYear");
    const calendarDays = document.getElementById("calendarDays");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");
    
    const current = new Date();
    
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    
    const formattedDate = current.toLocaleDateString('en-US', options);
    document.querySelector(".time-cover p").textContent = "Availability for " + formattedDate;
    
    const timeBox = document.querySelectorAll('.time-box');
    const defaultTime = timeBox[0];
    defaultTime.classList.add('default-time');
    
    const selection = document.querySelector('.selection');
    const secondP = selection.children[1];
    
    let previouslySelected = null;
    
    timeBox.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTime = btn.textContent;
            const current = new Date();
            const options2 = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
        
            secondP.textContent = `${selectedDay.toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric'
            })} at ${selectedTime}`;
        
            if (defaultTime.classList.contains('default-time')) {
                defaultTime.classList.remove('default-time');
            }
        
            if (previouslySelected) {
                previouslySelected.classList.remove('selected-time');
            }
        
            btn.classList.add('selected-time');
            previouslySelected = btn;
        });
    });
    
    
    const options2 = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate2 = current.toLocaleDateString('en-US', options2);
    
    secondP.textContent = `${formattedDate2} at ${defaultTime.textContent}`;
    
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();
    let selectedDay = null;
    
    const renderCalendar = () => {
        calendarDays.innerHTML = '';
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDay = (firstDay.getDay() + 6) % 7; // convert Sunday=0 to end of week
        const daysInMonth = lastDay.getDate();
    
        monthYear.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}`;
    
        // Fill empty slots before first day
        for (let i = 0; i < startDay; i++) {
        const empty = document.createElement('div');
        empty.classList.add('empty');
        calendarDays.appendChild(empty);
        }
    
        // Fill actual days
        for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.textContent = i;
    
    
        const thisDate = new Date(currentYear, currentMonth, i);
    
        const isToday =
            thisDate.getDate() === now.getDate() &&
            thisDate.getMonth() === now.getMonth() &&
            thisDate.getFullYear() === now.getFullYear();
    
        const isSelected =
            selectedDay &&
            selectedDay.getDate() === i &&
            selectedDay.getMonth() === currentMonth &&
            selectedDay.getFullYear() === currentYear;
    
        if (isToday) {
            day.classList.add('today');
        }
    
        if (isSelected) {
            day.classList.add('selected');
        }

        // isToday = isSelected
    
        const isPast = thisDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    
        if (!isPast) {
            day.addEventListener('click', () => {
    
            selectedDay = thisDate;
            secondP.textContent = `${selectedDay.toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric'
            })} at ${defaultTime.textContent}`;
    
            document.querySelector(".time-cover p").textContent = `Availability for ${selectedDay.toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric'
            })}`;
    
            if (previouslySelected) {
                previouslySelected.classList.remove('selected-time');
                defaultTime.classList.add('default-time');
            }
    
            renderCalendar();
            });
        } else {
            day.classList.add('disabled');
        }
    
        calendarDays.appendChild(day);
        }
    };
    
    prevMonth.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
        }
        renderCalendar();
    });
    
    nextMonth.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
        }
        renderCalendar();
    });
    
    selectedDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    renderCalendar();
    
    const storedTitle = localStorage.getItem('selectedTitle');
    if (storedTitle) {
        const selection = document.querySelector('.selection');
        const firstP = selection.children[0];
        firstP.textContent = storedTitle;
    }
    
    const storedPrice = localStorage.getItem('selectedPrice');
    if (storedPrice) {
        const selection2 = document.querySelector('.selection2');
        const selectedPrice = selection2.children[1];
        selectedPrice.textContent = storedPrice;
    }
    
    document.querySelector('.service-btn').addEventListener('click', () => { 
        const pickedDate = secondP.textContent;
        localStorage.setItem('selectedDate', pickedDate);
        
        window.location.href = 'client-details.html';
    });

});







// const timeSlotsEl = document.getElementById('timeSlots');
// const serviceDetailsEl = document.getElementById('serviceDetails');
// const availabilityLabel = document.getElementById('availabilityLabel');

// // Replace with dynamic service info from clicked card if needed
// const serviceInfo = {
//   title: "Muhabura: 2 Seats",
//   location: "Boho",
//   restaurant: "BOHO RESTAURANT",
//   duration: "10 min",
//   price: "RF 50,000"
// };

// let selectedTime = null; // Assuming selectedDate already handled

// function renderTimeSlots() {
//   timeSlotsEl.innerHTML = '';
//   const times = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
//                  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
//                  "14:00", "14:30", "15:00", "15:30"];

//   times.forEach(time => {
//     const slot = document.createElement('div');
//     slot.textContent = time;
//     slot.className = 'time-slot';
//     slot.addEventListener('click', () => {
//       document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
//       slot.classList.add('selected');
//       selectedTime = time;
//       updateServiceDetails();
//     });
//     timeSlotsEl.appendChild(slot);
//   });
// }

// function updateServiceDetails() {
//   if (!selectedDate || !selectedTime) return;

//   availabilityLabel.textContent = `Availability for ${selectedDate.toLocaleDateString('en-UK', {
//     weekday: 'long',
//     day: 'numeric',
//     month: 'long'
//   })}`;

//   serviceDetailsEl.innerHTML = `
//     <p><strong>${serviceInfo.title}</strong></p>
//     <p>${selectedDate.toLocaleDateString('en-UK', {
//       day: 'numeric', month: 'long', year: 'numeric'
//     })} at ${selectedTime}</p>
//     <p>${serviceInfo.location}</p>
//     <p>${serviceInfo.restaurant}</p>
//     <p>${serviceInfo.duration}</p>
//     <p>${serviceInfo.price}</p>
//   `;
// }