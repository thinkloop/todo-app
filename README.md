# Todo App (Advanced)
This project integrates a [todo view layer](https://github.com/thinkloop/todo-react-components) and a [todo state container](https://github.com/todo-redux-state) to create a functional todo app. Its primary task is to take flat, normalized, shallow state provided by the redux state container, and transform it into nested, denormalized, hierarchical structures that the react view demands. The mechanism by which it doe this is called *selectors*. Selectors are functions that take state as input (nothing else), and return view-specific structures. 

To run it, clone the repo and start the webserver:

```
> git clone https://github.com/thinkloop/todo-app
> npm start

// open localhost url
```

### License

Released under an MIT license.

### Related
1. [todo-react-components](https://github.com/thinkloop/todo-react-components): view-layer
2. [todo-redux-state](https://github.com/thinkloop/todo-redux-state): data-layer
3. [todo-app](https://github.com/thinkloop/todo-app): integration

### Like it? Star It
