import { getState, actions, subscribe } from 'todo-redux-state';
import { render } from 'todo-react-components';

import * as PATHS from './site/constants/paths';
import selectors from './selectors';

// debug stuff
Object.defineProperty(window, "state", { get: getState });
window.selectors = selectors;
window.actions = actions;
console.log('********************************************* \n DEVELOPMENT MODE \n window.state available \n window.selectors available \n ********************************************* \n');

// subscribe to state changes and re-render view on every change
const htmlElement = document.getElementById('app');
subscribe(() => render(selectors, htmlElement));

// read the url and navigate to the right page
const initialSelectedPage = Object.keys(PATHS).find(key => PATHS[key] === `.${window.location.pathname}`) || PATHS.HOME;
actions.site.updateSelectedPage(initialSelectedPage);

// load todos
actions.todos.loadTodos();

// listen for back button, forward button, etc
window.onpopstate = (e) => {
    const newSelectedPage = Object.keys(PATHS).find(key => PATHS[key] === window.location.pathname) || PATHS.HOME;
    actions.site.updateSelectedPage(newSelectedPage);
};
