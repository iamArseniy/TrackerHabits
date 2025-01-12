const state = {
    totalCalories: 0,
    totalBurned: 0,
    balance: 0,
    dayData: {},
};

const model = {
    state,

    saveData() {
        const dataToSave = {
            dayData: Object.fromEntries(
                Object.entries(state.dayData).filter(([date, day]) =>
                    day.food.length > 0 || day.workout.length > 0
                )
            ),
            totalCalories: state.totalCalories,
            totalBurned: state.totalBurned,
            balance: state.balance,
        };
        localStorage.setItem('trackerData', JSON.stringify(dataToSave));
    },

    loadData() {
        const data = JSON.parse(localStorage.getItem('trackerData'));
        if (data) {
            state.totalCalories = data.totalCalories || 0;
            state.totalBurned = data.totalBurned || 0;
            state.balance = data.balance || 0;
            state.dayData = data.dayData || {};
        }
    },

    clearBalances() {
        state.totalCalories = 0;
        state.totalBurned = 0;
        state.balance = 0;

        let trackerData = JSON.parse(localStorage.getItem('trackerData'));

        if (trackerData) {
            trackerData.totalCalories = 0;
            trackerData.totalBurned = 0;
            trackerData.balance = 0;
            localStorage.setItem('trackerData', JSON.stringify(trackerData));
        } else {
            console.log('Данные trackerData не найдены в localStorage.');
        }
    },
};

export default model;
