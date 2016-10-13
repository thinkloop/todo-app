import memoizerific from 'memoizerific';
import { actions, constants } from 'todo-redux-state';

import * as PATHS from '../site/constants/paths';

export default function (state) {
	return selectHomeLink();
}

export const selectHomeLink = memoizerific(1)(() => {
	const url = PATHS[constants.PAGES.HOME];
	return {
		label: 'Home',
		href: url,
		onClick: () => actions.site.updateURL(url)
	};
});
