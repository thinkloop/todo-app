import memoizerific from 'memoizerific';
import { actions, constants } from 'todo-redux-state';

const { addTodo, removeTodo, completeTodo, updateSelectedSummaryStatus } = actions.todos;
const { TODOS_STATUSES } = constants;

export default function (state) {
	const { todos, selectedSummaryStatus } = state;

	return selectTodos(todos, selectedSummaryStatus);
}

export const selectTodos = memoizerific(1)((todos, selectedSummaryStatus) => {

	const newForm = {
		placeholder: 'What do you need to do?',
		onSubmit: description => addTodo(description)
	};

	let list = Object.keys(todos).map(key => {
		return {
			...todos[key],
			id: key,
			buttonLabel: 'delete',
			onButtonClicked: () => removeTodo(key),
			onCheckboxToggled: () => completeTodo(key, !todos[key].isComplete)
		};
	});

	const summary = list.reduce((p, todo) => {
			!todo.isComplete && p.countIncomplete++;
			todo.isComplete && p.countComplete++;
			p.countTotal++;
			return p;
		}, {
			countIncomplete: 0,
			countComplete: 0,
			countTotal: 0
		});

	list = list
		.filter(todo => (
			selectedSummaryStatus === TODOS_STATUSES.TOTAL ||
			(selectedSummaryStatus === TODOS_STATUSES.COMPLETE && todo.isComplete)  ||
			(selectedSummaryStatus === TODOS_STATUSES.PENDING && !todo.isComplete)
		))
		.sort((a, b) => {
			if (a.dateCreated < b.dateCreated) { return -1; }
			if (a.dateCreated > b.dateCreated) { return 1; }
			if (a.id < b.id) { return -1; }
			return 1;
		});

	summary.countIncomplete = `${summary.countIncomplete} pending`;
	summary.countComplete = `${summary.countComplete} complete`;
	summary.countTotal = `${summary.countTotal} total`;

	summary.selectedSummaryStatus = selectedSummaryStatus;

	summary.onClickPending = () => updateSelectedSummaryStatus(TODOS_STATUSES.PENDING);
	summary.onClickComplete = () => updateSelectedSummaryStatus(TODOS_STATUSES.COMPLETE);
	summary.onClickTotal = () => updateSelectedSummaryStatus(TODOS_STATUSES.TOTAL);

	return {
		newForm,
		list,
		summary
	};
});
