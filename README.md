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
- [todo-react-components](https://github.com/thinkloop/todo-react-components): React components for extreme decoupling todo app example
- [todo-redux-state](https://github.com/thinkloop/todo-redux-state): Redux state container for extreme decoupling todo app example

## Other
- [memoizerific](https://github.com/thinkloop/memoizerific/): Fast, small, efficient JavaScript memoization to memoize JS functions
- [link-react](https://github.com/thinkloop/link-react/): A generalized link <a> component that allows client-side navigation while taking into account exceptions
- [spa-webserver](https://github.com/thinkloop/spa-webserver/): Webserver that redirects to root index.html if path is missing for client-side SPA navigation

## Like it? Star It
