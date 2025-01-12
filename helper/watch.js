import WatchJS from './melanke-watchjs.js';
import model from '../js/model.js';
import view from '../js/view.js';

const {watch} = WatchJS;

const watchState = () => {
    watch(model.state, 'totalCalories', () => {
        localStorage.setItem('totalCalories', JSON.stringify(model.state.totalCalories));
        view.updateCaloriesDisplay(model.state);
    });

    watch(model.state, 'totalBurned', () => {
        localStorage.setItem('totalBurned', JSON.stringify(model.state.totalBurned));
        view.updateCaloriesDisplay(model.state);
    });

    watch(model.state, 'balance', () => {
        view.updateCalorieBalance(model.state.balance);
    });

    watch(model.state, 'dayData', () => {
        localStorage.setItem('dayData', JSON.stringify(model.state.dayData));
        view.renderDayHistory(model.state.dayData);
    });
};

export {watch, watchState};
