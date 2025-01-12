
const view = {
    updateCaloriesDisplay(state) {
        document.getElementById('total-calories').textContent = state.totalCalories;
        document.getElementById('total-burned').textContent = state.totalBurned;
    },

    updateCalorieBalance(balance) {
        document.getElementById('calorie-balance').textContent = balance;
    },

    renderDayHistory(dayData) {
        const dayHistory = document.getElementById('day-history');
        dayHistory.innerHTML = '';

        for (const date in dayData) {
            const day = dayData[date];
            const foodItemsHTML = day.food.map(f => `<li>${f.foodName} - ${f.calories} калорий</li>`).join('');
            const workoutItemsHTML = day.workout.map(w => `<li>${w.workoutName} (${w.duration} мин.) - ${w.burnedCalories} калорий</li>`).join('');
            const calorieBalance = day.balance;

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
        }
    },

    clearLists() {
        document.getElementById('food-list').innerHTML = '';
        document.getElementById('workout-list').innerHTML = '';
    },
};
export default view;