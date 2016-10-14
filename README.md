*See [Extreme Decoupling
React, Redux, Selectors ](http://www.thinkloop.com/article/extreme-decoupling-react-redux-selectors/) for more details.*

# Todo App: Selectors (Integration)
This project integrates the [todo view layer](https://github.com/thinkloop/todo-react-components) project and the [todo state container](https://github.com/thinkloop/todo-redux-state) project to create a functional todo app. Its primary task is to take flat, normalized, shallow state provided by the state container, and transform it into the nested, denormalized, hierarchical structures that the view demands. The mechanism by which it does this is called [selectors](https://github.com/thinkloop/selectors).

## Run

To run the full todo app, clone the repo and start the webserver:

```
> git clone https://github.com/thinkloop/todo-app
> npm start

// open localhost url
```

## License

Released under an MIT license.

## Related
1. [todo-react-components](https://github.com/thinkloop/todo-react-components) (view-layer)
2. [todo-redux-state](https://github.com/thinkloop/todo-redux-state) (data-layer)
3. [todo-app](https://github.com/thinkloop/todo-app) (integration)

## Other
- [memoizerific](https://github.com/thinkloop/memoizerific/)
- [link-react](https://github.com/thinkloop/link-react/)
- [spa-webserver](https://github.com/thinkloop/spa-webserver/)

## Like it? Star It
