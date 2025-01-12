import model from './model.js';
import view from './view.js';

const foodForm = document.getElementById('food-form');
const foodList = document.getElementById('food-list');

const workoutForm = document.getElementById('workout-form');
const workoutList = document.getElementById('workout-list');

const dayHistory = document.getElementById('day-history');

function handleFoodSubmit(e) {
    e.preventDefault();

    const foodName = document.getElementById('food-name').value;
    const eatenCalories = parseInt(document.getElementById('calories').value);

    const foodList = document.getElementById('food-list');
    foodList.innerHTML += `<li>${foodName} - ${eatenCalories} калорий</li>`;

    model.state.totalCalories += eatenCalories;
    model.state.balance = model.state.totalCalories - model.state.totalBurned;

    foodForm.reset();
}

function handleWorkoutSubmit(e) {
    e.preventDefault();

    const workoutName = document.getElementById('workout-name').value;
    const workoutDuration = document.getElementById('workout-duration').value;
    const burnedCalories = parseInt(document.getElementById('burned-calories').value);

    const workoutList = document.getElementById('workout-list');
    workoutList.innerHTML += `<li>${workoutName} (${workoutDuration} мин.) - ${burnedCalories}</li>`;

    model.state.totalBurned += burnedCalories;
    model.state.balance = model.state.totalCalories - model.state.totalBurned;

    workoutForm.reset();
}

function handleSaveDay() {

    const date = document.getElementById('balance-date').value;
    if (!date) {
        alert('Пожалуйста, выберите дату перед добавлением еды или тренировки.');
        return;
    }

    if (!model.state.dayData[date]) {
        model.state.dayData[date] = {food: [], workout: []};
    }

    const foodItems = Array.from(foodList.children);
    const workoutItems = Array.from(workoutList.children);

    if (foodItems.length === 0 && workoutItems.length === 0) {
        alert('Пожалуйста, добавьте еду или тренировки перед сохранением дня.');
        return;
    }

    const newFoodItems = foodItems.map(item => {
        const text = item.textContent.split(' - ');
        return {
            foodName: text[0],
            calories: parseInt(text[1]),
        };
    });

    const newWorkoutItems = workoutItems.map(item => {
        const text = item.textContent.split(' - ');
        const workoutDetails = text[0].split(' (');
        return {
            workoutName: workoutDetails[0],
            duration: parseInt(workoutDetails[1].replace(' мин.)', '')),
            burnedCalories: parseInt(text[1].replace(' калорий', '')),
        };
    });

    model.state.dayData[date].food = [
        ...model.state.dayData[date].food.filter(f => !newFoodItems.some(nf => nf.foodName === f.foodName && nf.calories === f.calories)),
        ...newFoodItems,
    ];


    model.state.dayData[date].workout = [
        ...model.state.dayData[date].workout.filter(w =>
            !newWorkoutItems.some(nw => nw.workoutName === w.workoutName &&
                nw.duration === w.duration &&
                nw.burnedCalories === w.burnedCalories)
        ),
        ...newWorkoutItems,
    ];

    const calorieBalance = model.state.dayData[date].food.reduce((sum, item) => sum + item.calories, 0) -
        model.state.dayData[date].workout.reduce((sum, item) => sum + item.burnedCalories, 0);
    model.state.dayData[date].balance = calorieBalance;

    model.saveData();
    view.renderDayHistory(model.state.dayData);
    view.clearLists();
    model.clearBalances();
}

function init() {
    model.loadData();

    document.getElementById('food-form').addEventListener('submit', handleFoodSubmit);
    document.getElementById('workout-form').addEventListener('submit', handleWorkoutSubmit);
    document.getElementById('save-day').addEventListener('click', handleSaveDay);
}

export default init;
