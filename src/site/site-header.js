import memoizerific from 'memoizerific';
import { state, actions, constants } from 'todo-redux-state';

import * as PATHS from '../site/constants/paths';

export default function () {
	const { selectedPage } = state;
	return selectSiteHeader(selectedPage,
							actions.site.updateSelectedPage,
							PATHS,
							constants.PAGES.HOME,
							constants.PAGES.ABOUT);
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
