import memoizerific from 'memoizerific';
import { actions, constants } from 'todo-redux-state';

export default function (state) {
	const { todos, selectedSummaryStatus } = state;

	return selectTodos(todos, selectedSummaryStatus);
}

export const selectTodos = memoizerific(1)((todos, selectedSummaryStatus) => {

	const newForm = {
		placeholder: 'What do you need to do?',
		onSubmit: description => actions.todos.addTodo(description)
	};

	let list = Object.keys(todos).map(key => {
		return {
			...todos[key],
			id: key,
			buttonLabel: 'delete',
			onButtonClicked: () => actions.todos.removeTodo(key),
			onCheckboxToggled: () => actions.todos.completeTodo(key, !todos[key].isComplete)
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
			selectedSummaryStatus === constants.TODOS_STATUSES.TOTAL ||
			(selectedSummaryStatus === constants.TODOS_STATUSES.COMPLETE && todo.isComplete)  ||
			(selectedSummaryStatus === constants.TODOS_STATUSES.PENDING && !todo.isComplete)
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

	summary.onClickPending = () => actions.todos.updateSelectedSummaryStatus(constants.TODOS_STATUSES.PENDING);
	summary.onClickComplete = () => actions.todos.updateSelectedSummaryStatus(constants.TODOS_STATUSES.COMPLETE);
	summary.onClickTotal = () => actions.todos.updateSelectedSummaryStatus(constants.TODOS_STATUSES.TOTAL);

	return {
		newForm,
		list,
		summary
	};
});
