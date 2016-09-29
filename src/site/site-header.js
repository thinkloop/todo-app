import memoizerific from 'memoizerific';
import { actions, constants } from 'todo-redux-state';

import * as PATHS from '../site/constants/paths';

export default function (state) {
	const { selectedPage } = state;
	return selectSiteHeader(selectedPage);
}

export const selectSiteHeader = memoizerific(1)((selectedPage) => {

	return {
		labelHome: 'Todo App',
		labelAbout: 'About',

		hrefHome: PATHS[constants.PAGES.HOME],
		hrefAbout: PATHS[constants.PAGES.ABOUT],

		selectedPage: selectedPage,

		onClickHome: () => actions.site.updateSelectedPage(constants.PAGES.HOME),
		onClickAbout: () => actions.site.updateSelectedPage(constants.PAGES.ABOUT)
	};
});
