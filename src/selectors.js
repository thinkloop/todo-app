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

module.exports = {};

Object.keys(selectors).forEach(selectorKey =>
	Object.defineProperty(module.exports, selectorKey, { get: selectors[selectorKey], enumerable: true }
));
