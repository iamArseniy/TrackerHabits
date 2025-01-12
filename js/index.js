import {watchState} from '../helper/watch.js';
import init from './controller.js';
import model from './model.js';

window.model = model;
const initializeApp = () => {
    watchState();
    init();
}
initializeApp();

