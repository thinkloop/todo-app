import { state, actions, subscribe } from 'todo-redux-state';
import { components } from 'todo-react-components';
import * as PATHS from './site/constants/paths';

import selectors from './selectors';

var appElement = document.getElementById('app');

window.state = state;
window.selectors = selectors;
window.actions = actions;
console.log('********************************************* \n DEVELOPMENT MODE \n window.state available \n window.selectors available \n ********************************************* \n');

subscribe(() => components(appElement, selectors));

const initialSelectedPage = Object.keys(PATHS).find(key => PATHS[key] === window.location.pathname) || PATHS.HOME;
actions.site.updateSelectedPage(initialSelectedPage);
actions.todos.loadTodos();


