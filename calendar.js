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
        const startDay = (firstDay.getDay() + 6) % 7;
        const daysInMonth = lastDay.getDate();
    
        monthYear.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}`;
    
        for (let i = 0; i < startDay; i++) {
        const empty = document.createElement('div');
        empty.classList.add('empty');
        calendarDays.appendChild(empty);
        }
    
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

    function cleanDateString(dateStr) {
        return dateStr.replace(/\s+/g, ' ').trim();
    }
    
    document.querySelector('.service-btn').addEventListener('click', () => { 
        const pickedDate = secondP.textContent;
        localStorage.setItem('selectedDate', cleanDateString(pickedDate));
        window.location.href = 'client-details.html';
    });

});