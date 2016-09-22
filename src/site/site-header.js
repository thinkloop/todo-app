import memoizerific from 'memoizerific';
import todoReduxState from 'todo-redux-state';

import * as PATHS from '../site/constants/paths';

export default function () {
	const { selectedPage } = todoReduxState.state;
	return selectSiteHeader(selectedPage, todoReduxState.actions.site.updateSelectedPage, PATHS, todoReduxState.constants.PAGES.HOME, todoReduxState.constants.PAGES.ABOUT);
}

export const selectSiteHeader = memoizerific(1)((selectedPage, updateSelectedPage, PATHS, HOME, ABOUT) => {

	return {
		labelHome: 'Todo App',
		labelAbout: 'About',

		hrefHome: PATHS[HOME],
		hrefAbout: PATHS[ABOUT],

		selectedPage: selectedPage,

		onClickHome: () => updateSelectedPage(HOME),
		onClickAbout: () => updateSelectedPage(ABOUT)
	};
});
