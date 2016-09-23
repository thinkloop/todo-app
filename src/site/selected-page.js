import memoizerific from 'memoizerific';
import { state } from 'todo-redux-state';

import todoReactComponents from 'todo-react-components';

export default function () {
	const { selectedPage } = state;
	return selectSelectedPage(selectedPage, todoReactComponents.constants.PAGES);
}

export const selectSelectedPage = memoizerific(1)((selectedPage, PAGES) => {
	return PAGES[selectedPage];
});
