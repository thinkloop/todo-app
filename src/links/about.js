import memoizerific from 'memoizerific';
import { actions, constants } from 'todo-redux-state';

import * as PATHS from '../site/constants/paths';

export default function (state) {
	return selectAboutLink();
}

export const selectAboutLink = memoizerific(1)(() => {
	const url = PATHS[constants.PAGES.ABOUT];
	return {
		label: 'About',
		href: url,
		onClick: () => actions.site.updateURL(url)
	};
});
