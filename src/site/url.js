import memoizerific from 'memoizerific';
import * as PATHS from '../site/constants/paths';

export default function (state) {
	const { selectedPage } = state;
	return selectURL(selectedPage);
}

export const selectURL = memoizerific(1)((selectedPage, SITE_PATHS = PATHS) => {
	return SITE_PATHS[selectedPage];
});
