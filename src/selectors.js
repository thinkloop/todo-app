import combineSelectors from 'combine-selectors';
import { getState } from 'todo-redux-state';

import selectedPage from './site/selected-page';
import url from './site/url';
import siteHeader from './site/site-header';
import todos from './todos/todos';

const selectors = {
	selectedPage,
	url,
	siteHeader,
	todos
};

export default combineSelectors(selectors, getState);
