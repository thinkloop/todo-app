import memoizerific from 'memoizerific';
import { constants } from 'todo-react-components';

export default function (state) {
	const { selectedPage } = state;
	return selectSelectedPage(selectedPage);
}

export const selectSelectedPage = memoizerific(1)((selectedPage) => {
	return constants.PAGES[selectedPage];
});
