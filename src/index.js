import todoReduxState from 'todo-redux-state';
import { app } from 'todo-react-components';
import * as PATHS from './site/constants/paths';

import selectors from './selectors';

var appElement = document.getElementById('app');

window.state = todoReduxState.state;
window.selectors = selectors;
window.todoReduxState = todoReduxState;
console.log('********************************************* \n DEVELOPMENT MODE \n window.state available \n window.selectors available \n ********************************************* \n');

todoReduxState.subscribe(() => app(appElement, selectors));

const initialSelectedPage = Object.keys(PATHS).find(key => PATHS[key] === window.location.pathname) || PATHS.HOME;
todoReduxState.actions.site.updateSelectedPage(initialSelectedPage);
todoReduxState.actions.todos.loadTodos();
