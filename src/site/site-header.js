import memoizerific from 'memoizerific';

import * as PATHS from '../site/constants/paths';

import { selectHomeLink } from '../links/home';
import { selectAboutLink } from '../links/about';


export default function (state) {
	const { selectedPage } = state;
	return selectSiteHeader(selectedPage);
}

export const selectSiteHeader = memoizerific(1)((selectedPage) => {

	return {
		selectedPage: selectedPage,
		homeLink: selectHomeLink(),
		aboutLink: selectAboutLink()
	};
});
