import { getState, actions, subscribe } from 'todo-redux-state';
import { render } from 'todo-react-components';

import selectors from './selectors';

// debug stuff
Object.defineProperty(window, "state", { get: getState });
window.selectors = selectors;
window.actions = actions;
console.log('********************************************* \n DEVELOPMENT MODE \n window.state available \n window.selectors available \n ********************************************* \n');

// read the url and navigate to the right page
actions.site.updateURL(window.location.pathname + window.location.search);

// load todos
actions.todos.loadTodos();

// listen for back button, forward button, etc
window.onpopstate = (e) => {
    actions.site.updateURL(window.location.pathname + window.location.search);
};

// subscribe to state changes and re-render view on every change
const htmlElement = document.getElementById('app');
subscribe(() => render(selectors, htmlElement));
