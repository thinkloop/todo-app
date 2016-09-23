import memoizerific from 'memoizerific';
import { state } from 'todo-redux-state';

import * as PATHS from '../site/constants/paths';

export default function () {
	const { selectedPage } = state;
	return selectURL(selectedPage, PATHS);
}

export const selectURL = memoizerific(1)((selectedPage, PATHS) => {
	return PATHS[selectedPage];
});
