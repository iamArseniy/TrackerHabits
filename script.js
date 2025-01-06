const foodForm = document.getElementById('food-form');
const foodList = document.getElementById('food-list');
const totalCaloriesElem = document.getElementById('total-calories');

const workoutForm = document.getElementById('workout-form');
const workoutList = document.getElementById('workout-list');
const totalBurnedElem = document.getElementById('total-burned');

const saveDayButton = document.getElementById('save-day');
const balanceDateInput = document.getElementById('balance-date');
const dayHistory = document.getElementById('day-history');

const calorieBalanceElem = document.getElementById('calorie-balance');

let totalCalories = 0;
let totalBurned = 0;

const dayData = {};

function loadData() {
    const data = JSON.parse(localStorage.getItem('trackerData'));
    if (data) {
        totalCalories = data.totalCalories;
        totalBurned = data.totalBurned;
        foodList.innerHTML = data.foodItems;
        workoutList.innerHTML = data.workoutItems;

        totalCaloriesElem.textContent = totalCalories;
        totalBurnedElem.textContent = totalBurned;
        updateCalorieBalance();
    }
}

function clearInfo() {
    localStorage.clear();
    foodList.innerHTML = '';
    workoutList.innerHTML = '';
    totalCalories = 0;
    totalBurned = 0;
    totalCaloriesElem.textContent = totalCalories;
    totalBurnedElem.textContent = totalBurned;
    calorieBalanceElem.textContent = 0;
}

function updateCalorieBalance() {
    const balance = totalCalories - totalBurned;
    calorieBalanceElem.textContent = balance;
}

function saveData() {
    const data = {
        totalCalories,
        totalBurned,
        foodItems: foodList.innerHTML,
        workoutItems: workoutList.innerHTML,
    };
    localStorage.setItem('trackerData', JSON.stringify(data));
}

foodForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const foodName = document.getElementById('food-name').value;
    const eatenCalories = parseInt(document.getElementById('calories').value);

    const listItem = document.createElement('li');
    listItem.textContent = `${foodName} - ${eatenCalories} калорий`;
    foodList.appendChild(listItem);

    totalCalories += eatenCalories;
    totalCaloriesElem.textContent = totalCalories;

    saveData();

    foodForm.reset();
});

workoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const workoutName = document.getElementById('workout-name').value;
    const workoutDuration = document.getElementById('workout-duration').value;
    const burnedCalories = parseInt(document.getElementById('burned-calories').value);

    const listItem = document.createElement('li');
    listItem.textContent = `${workoutName} (${workoutDuration} мин.) - ${burnedCalories}`;
    workoutList.appendChild(listItem);

    totalBurned += burnedCalories;
    totalBurnedElem.textContent = totalBurned;

    saveData();

    workoutForm.reset();
});

foodForm.addEventListener('submit', updateCalorieBalance);
workoutForm.addEventListener('submit', updateCalorieBalance);

saveDayButton.addEventListener('click', () => {
    const date = balanceDateInput.value;
    if (!date) {
        alert('Пожалуйста, выберите дату перед добавлением еды или тренировки.');
        return;
    }

    if (!dayData[date]) {
        dayData[date] = {food: [], workout: []};
    }

    const newFoodItems = Array.from(foodList.children).map(item => {
        const text = item.textContent.split(' - ');
        return {
            foodName: text[0],
            calories: parseInt(text[1]),
        };
    });

    dayData[date].food = [
        ...dayData[date].food.filter(f => !newFoodItems.some(nf => nf.foodName === f.foodName && nf.calories === f.calories)),
        ...newFoodItems,
    ];

    const newWorkoutItems = Array.from(workoutList.children).map(item => {
        const text = item.textContent.split(' - ');
        const workoutDetails = text[0].split(' (');
        return {
            workoutName: workoutDetails[0],
            duration: parseInt(workoutDetails[1].replace(' мин.)', '')),
            burnedCalories: parseInt(text[1].replace(' калорий', '')),
        };
    });

    dayData[date].workout = [
        ...dayData[date].workout.filter(w =>
            !newWorkoutItems.some(nw => nw.workoutName === w.workoutName &&
                nw.duration === w.duration &&
                nw.burnedCalories === w.burnedCalories)
        ),
        ...newWorkoutItems,
    ];

    const calorieBalance = dayData[date].food.reduce((sum, item) => sum + item.calories, 0) -
        dayData[date].workout.reduce((sum, item) => sum + item.burnedCalories, 0);
    dayData[date].balance = calorieBalance;

    const foodItemsHTML = dayData[date].food.map(f => `<li>${f.foodName} - ${f.calories} калорий</li>`).join('');
    const workoutItemsHTML = dayData[date].workout.map(w => `<li>${w.workoutName} (${w.duration} мин.) - ${w.burnedCalories} калорий</li>`).join('');

    let daySummary = document.getElementById(`day-summary-${date}`);
    if (!daySummary) {
        daySummary = document.createElement('div');
        daySummary.id = `day-summary-${date}`;
        dayHistory.appendChild(daySummary);
    }
    daySummary.innerHTML = `
        <h3>${date}</h3>
        <p><strong>Еда:</strong></p>
        <ul>${foodItemsHTML}</ul>
        <p><strong>Тренировки:</strong></p>
        <ul>${workoutItemsHTML}</ul>
        <p><strong>Баланс калорий:</strong> ${calorieBalance} калорий</p>
    `;

    // Отправка данных на сервер
    fetch('https://jsonVidumanniyServer', {
        method: 'POST',
        body: JSON.stringify({date, food: dayData[date].food, workout: dayData[date].workout, balance: calorieBalance}),
        headers: {'Content-Type': 'application/json'},
    })
        .then(response => response.json())
        .then(data => console.log('Данные успешно отправлены:', data))
        .catch(error => console.error('Ошибка отправки данных:', error));

    clearInfo();
});


// Загрузить данные при старте
window.addEventListener('load', loadData);