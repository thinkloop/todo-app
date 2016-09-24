import { state, actions, subscribe } from 'todo-redux-state';
import { component } from 'todo-react-components';

import * as PATHS from './site/constants/paths';
import selectors from './selectors';

// debug stuff
window.state = state;
window.selectors = selectors;
window.actions = actions;
console.log('********************************************* \n DEVELOPMENT MODE \n window.state available \n window.selectors available \n ********************************************* \n');

// subscribe to state changes and re-render app on every change
const htmlElement = document.getElementById('app');
subscribe(() => component(htmlElement, selectors));

// read the url and navigate to the right page
const initialSelectedPage = Object.keys(PATHS).find(key => PATHS[key] === window.location.pathname) || PATHS.HOME;
actions.site.updateSelectedPage(initialSelectedPage);

// load todos
actions.todos.loadTodos();

// listen for back button, forward button, etc
window.onpopstate = (e) => {
    const newSelectedPage = Object.keys(PATHS).find(key => PATHS[key] === window.location.pathname) || PATHS.HOME;
    actions.site.updateSelectedPage(newSelectedPage);
};
