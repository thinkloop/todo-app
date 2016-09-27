# Todo App: Selectors (Integration)
This project integrates the [todo view layer](https://github.com/thinkloop/todo-react-components) project and the [todo state container](https://github.com/thinkloop/todo-redux-state) project to create a functional todo app. Its primary task is to take flat, normalized, shallow state provided by the state container, and transform it into the nested, denormalized, hierarchical structures that the view demands. The mechanism by which it does this is called: **selectors**. Selectors are functions that take state (nothing else), and return view-specific structures. For example, the following selector builds a label out of `activePage` state:

```javascript
import todoReduxState from 'todo-redux-state';

export default function () {

	// get relevant state
	const { activePage } = todoReduxState.state;
	
	// generate and return label
	return `${activePage} is active`;
}
```

Whenever that label is needed, the selector is called and the value is returned. If underlying state changes, the selector will return an updated value. Given the same state, the selector will always return the same value.

Sometimes selectors become popular and get called many times between state changes (by ui elements or other selectors). Every time they are called, they re-run and re-calculate using the same underlying state, returning the same results. With expensive selectors, this can quickly start to degrade the app. A common example would be the selector that returns the app's main list of "things" (todos, books, cars, movies, ...). This often involves transforming, sorting, filtering, and paginating a large set of data - not stuff you want running multiple times a frame:

```javascript
/*
* BAD - this selector is expensive and re-computes every time it is called
*/

import todoReduxState from 'todo-redux-state';

export default function () {
	const { todos, searchPhrase } = todoReduxState.state;
	
	return Object.keys(todos)
				
		// convert objects to array
		.map(key => {
			return { ...todos[key], id: key };
		})
		
		// filter out those that do not match search phrase
		.filter(todo => todo.description.indexOf(searchPhrase) >= 0)
		
		// sort
		.sort((a, b) => a.createdDate < b.createdDate ? -1 : 1);
}
```

What is needed is a function cache that returns the same results, given the same arguments - or what is known as [memoization](https://github.com/thinkloop/memoizerific). That way selectors can return values instantly, behaving like static properties. Since they are deterministic and purely based on state, it is very easy to memoize them. The pattern we use looks like this:

```javascript
/*
* GOOD - computations only happen when state changes
*/
import memoizerific from 'memoizerific';
import todoReduxState from 'todo-redux-state';

// entry point, gathers state and runs memoized function
export default function () {
	
	// get relevant state
	const { todos, searchPhrase } = todoReduxState.state;
	
	// run memoized function
	return selectTodos(todos, searchPhrase);
}

// memoized function that houses all computation
export const selectTodos = memoizerific(1)((todos, searchPhrase) => {
	
	// run expensive computation
	return Object.keys(todos)
      .map(key => {
      	return {
      		...todos[key],
      		id: key
      	};
      })
      .filter(todo => todo.description.indexOf(searchPhrase))
      .sort((a, b) => a.createdDate < b.createdDate ? -1 : 1);  
});
```

Computations are moved to a separate memoized function that only runs when `todos` or `searchPhrase` have changed, otherwise it instantly returns the cached result. Additionally, since cached results refer to the exact same object, they can be compared cheaply in react using strict equality to minimize re-renders.

### Run

To run it, clone the repo and start the webserver:

```
> git clone https://github.com/thinkloop/todo-app
> npm start

// open localhost url
```

### License

Released under an MIT license.

### Related
1. [todo-react-components](https://github.com/thinkloop/todo-react-components) (view-layer)
2. [todo-redux-state](https://github.com/thinkloop/todo-redux-state) (data-layer)
3. [todo-app](https://github.com/thinkloop/todo-app) (integration)

### Like it? Star It
