(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
module.exports = function(selectors, getState) {
	return Object.keys(selectors).reduce((p, selectorKey) => {
		Object.defineProperty(p, selectorKey, {
			get: function() { return selectors[selectorKey](getState()) },
			enumerable: true
		});
		return p;
	}, {});
};

},{}],3:[function(require,module,exports){
(function (process){
if (typeof Map !== 'function' || (process && process.env && process.env.TEST_MAPORSIMILAR === 'true')) {
	module.exports = require('./similar');
}
else {
	module.exports = Map;
}
}).call(this,require('_process'))

},{"./similar":4,"_process":1}],4:[function(require,module,exports){
function Similar() {
	this.list = [];
	this.lastItem = undefined;
	this.size = 0;

	return this;
}

Similar.prototype.get = function(key) {
	var index;

	if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
		return this.lastItem.val;
	}

	index = this.indexOf(key);
	if (index >= 0) {
		this.lastItem = this.list[index];
		return this.list[index].val;
	}

	return undefined;
};

Similar.prototype.set = function(key, val) {
	var index;

	if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
		this.lastItem.val = val;
		return this;
	}

	index = this.indexOf(key);
	if (index >= 0) {
		this.lastItem = this.list[index];
		this.list[index].val = val;
		return this;
	}

	this.lastItem = { key: key, val: val };
	this.list.push(this.lastItem);
	this.size++;

	return this;
};

Similar.prototype.delete = function(key) {
	var index;

	if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
		this.lastItem = undefined;
	}

	index = this.indexOf(key);
	if (index >= 0) {
		this.size--;
		return this.list.splice(index, 1)[0];
	}

	return undefined;
};


// important that has() doesn't use get() in case an existing key has a falsy value, in which case has() would return false
Similar.prototype.has = function(key) {
	var index;

	if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
		return true;
	}

	index = this.indexOf(key);
	if (index >= 0) {
		this.lastItem = this.list[index];
		return true;
	}

	return false;
};

Similar.prototype.forEach = function(callback, thisArg) {
	var i;
	for (i = 0; i < this.size; i++) {
		callback.call(thisArg || this, this.list[i].val, this.list[i].key, this);
	}
};

Similar.prototype.indexOf = function(key) {
	var i;
	for (i = 0; i < this.size; i++) {
		if (this.isEqual(this.list[i].key, key)) {
			return i;
		}
	}
	return -1;
};

// check if the numbers are equal, or whether they are both precisely NaN (isNaN returns true for all non-numbers)
Similar.prototype.isEqual = function(val1, val2) {
	return val1 === val2 || (val1 !== val1 && val2 !== val2);
};

module.exports = Similar;
},{}],5:[function(require,module,exports){
var MapOrSimilar = require('map-or-similar');

module.exports = function (limit) {
	var cache = new MapOrSimilar(),
		lru = [];

	return function (fn) {
		var memoizerific = function () {
			var currentCache = cache,
				newMap,
				fnResult,
				argsLengthMinusOne = arguments.length - 1,
				lruPath = Array(argsLengthMinusOne + 1),
				isMemoized = true,
				i;

			if ((memoizerific.numArgs || memoizerific.numArgs === 0) && memoizerific.numArgs !== argsLengthMinusOne + 1) {
				throw new Error('Memoizerific functions should always be called with the same number of arguments');
			}

			// loop through each argument to traverse the map tree
			for (i = 0; i < argsLengthMinusOne; i++) {
				lruPath[i] = {
					cacheItem: currentCache,
					arg: arguments[i]
				};

				// climb through the hierarchical map tree until the second-last argument has been found, or an argument is missing.
				// if all arguments up to the second-last have been found, this will potentially be a cache hit (determined below)
				if (currentCache.has(arguments[i])) {
					currentCache = currentCache.get(arguments[i]);
					continue;
				}

				isMemoized = false;

				// make maps until last value
				newMap = new MapOrSimilar();
				currentCache.set(arguments[i], newMap);
				currentCache = newMap;
			}

			// we are at the last arg, check if it is really memoized
			if (isMemoized) {
				if (currentCache.has(arguments[argsLengthMinusOne])) {
					fnResult = currentCache.get(arguments[argsLengthMinusOne]);
				}
				else {
					isMemoized = false;
				}
			}

			if (!isMemoized) {
				fnResult = fn.apply(null, arguments);
				currentCache.set(arguments[argsLengthMinusOne], fnResult);
			}

			if (limit > 0) {
				lruPath[argsLengthMinusOne] = {
					cacheItem: currentCache,
					arg: arguments[argsLengthMinusOne]
				};

				if (isMemoized) {
					moveToMostRecentLru(lru, lruPath);
				}
				else {
					lru.push(lruPath);
				}

				if (lru.length > limit) {
					removeCachedResult(lru.shift());
				}
			}

			memoizerific.wasMemoized = isMemoized;
			memoizerific.numArgs = argsLengthMinusOne + 1;

			return fnResult;
		};

		memoizerific.limit = limit;
		memoizerific.wasMemoized = false;
		memoizerific.cache = cache;
		memoizerific.lru = lru;

		return memoizerific;
	};
};

// move current args to most recent position
function moveToMostRecentLru(lru, lruPath) {
	var lruLen = lru.length,
		lruPathLen = lruPath.length,
		isMatch,
		i, ii;

	for (i = 0; i < lruLen; i++) {
		isMatch = true;
		for (ii = 0; ii < lruPathLen; ii++) {
			if (!isEqual(lru[i][ii].arg, lruPath[ii].arg)) {
				isMatch = false;
				break;
			}
		}
		if (isMatch) {
			break;
		}
	}

	lru.push(lru.splice(i, 1)[0]);
}

// remove least recently used cache item and all dead branches
function removeCachedResult(removedLru) {
	var removedLruLen = removedLru.length,
		currentLru = removedLru[removedLruLen - 1],
		tmp,
		i;

	currentLru.cacheItem.delete(currentLru.arg);

	// walk down the tree removing dead branches (size 0) along the way
	for (i = removedLruLen - 2; i >= 0; i--) {
		currentLru = removedLru[i];
		tmp = currentLru.cacheItem.get(currentLru.arg);

		if (!tmp || !tmp.size) {
			currentLru.cacheItem.delete(currentLru.arg);
		} else {
			break;
		}
	}
}

// check if the numbers are equal, or whether they are both precisely NaN (isNaN returns true for all non-numbers)
function isEqual(val1, val2) {
	return val1 === val2 || (val1 !== val1 && val2 !== val2);
}
},{"map-or-similar":3}],6:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.todoReactComponents=e()}}(function(){var e;return function e(t,n,o){function a(l,r){if(!n[l]){if(!t[l]){var u="function"==typeof require&&require;if(!r&&u)return u(l,!0);if(s)return s(l,!0);var c=new Error("Cannot find module '"+l+"'");throw c.code="MODULE_NOT_FOUND",c}var i=n[l]={exports:{}};t[l][0].call(i.exports,function(e){var n=t[l][1][e];return a(n?n:e)},i,i.exports,e,t,n,o)}return n[l].exports}for(var s="function"==typeof require&&require,l=0;l<o.length;l++)a(o[l]);return a}({1:[function(t,n){!function(){"use strict";function t(){for(var e=[],n=0;n<arguments.length;n++){var a=arguments[n];if(a){var s=typeof a;if("string"===s||"number"===s)e.push(a);else if(Array.isArray(a))e.push(t.apply(null,a));else if("object"===s)for(var l in a)o.call(a,l)&&a[l]&&e.push(l)}}return e.join(" ")}var o={}.hasOwnProperty;"undefined"!=typeof n&&n.exports?n.exports=t:"function"==typeof e&&"object"==typeof e.amd&&e.amd?e("classnames",[],function(){return t}):window.classNames=t}()},{}],2:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var a="undefined"!=typeof window?window.React:"undefined"!=typeof global?global.React:null,s=o(a),l=e("classnames"),r=o(l),u=e("../site/site-header"),c=o(u),i=function(e){return s.default.createElement("div",null,s.default.createElement(c.default,e.siteHeader),s.default.createElement("main",{className:r.default("page",e.className)},"About Page"))};i.propTypes={className:s.default.PropTypes.string,siteHeader:s.default.PropTypes.object},n.default=i},{"../site/site-header":6,classnames:1}],3:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),c="undefined"!=typeof window?window.React:"undefined"!=typeof global?global.React:null,i=o(c),f=function(e){function t(e){a(this,t);var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleClick=function(e){n.props.target||n.props.href&&0===n.props.href.indexOf("mailto:")||0===!e.button||e.metaKey||e.altKey||e.ctrlKey||e.shiftKey||(e.preventDefault(),n.props.onClick&&n.props.onClick(n.props.href))},n.handleClick=n.handleClick.bind(n),n}return l(t,e),u(t,[{key:"render",value:function(){return i.default.createElement("a",r({},this.props,{href:this.props.href,className:"link "+this.props.className,onClick:this.handleClick}))}}]),t}(c.Component);f.propTypes={className:c.PropTypes.string,href:c.PropTypes.string,target:c.PropTypes.string,onClick:c.PropTypes.func},n.default=f},{}],4:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};n.default=function(e,t){var n=void 0;switch(t.url!==window.location.pathname&&window.history.pushState(null,null,t.url),t.selectedPage){case u.ABOUT:n=l.default.createElement(d.default,{className:"about-page",siteHeader:t.siteHeader});break;default:n=l.default.createElement(i.default,a({className:"todos-page"},t.todos,{siteHeader:t.siteHeader}))}r.render(n,e)};var s="undefined"!=typeof window?window.React:"undefined"!=typeof global?global.React:null,l=o(s),r="undefined"!=typeof window?window.ReactDOM:"undefined"!=typeof global?global.ReactDOM:null,u=e("./site/constants/pages"),c=e("./todos/todos-page"),i=o(c),f=e("./about/about-page"),d=o(f)},{"./about/about-page":2,"./site/constants/pages":5,"./todos/todos-page":12}],5:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.HOME="HOME",n.ABOUT="ABOUT"},{}],6:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var a="undefined"!=typeof window?window.React:"undefined"!=typeof global?global.React:null,s=o(a),l=e("classnames"),r=o(l),u=e("../site/constants/pages"),c=e("../common/link"),i=o(c),f=function(e){return s.default.createElement("header",{className:r.default("site-header",e.className)},s.default.createElement("nav",null,s.default.createElement(i.default,{className:r.default({selected:e.selectedPage===u.HOME}),href:e.hrefHome,onClick:e.onClickHome},e.labelHome),s.default.createElement(i.default,{className:r.default({selected:e.selectedPage===u.ABOUT}),href:e.hrefAbout,onClick:e.onClickAbout},e.labelAbout)))};f.propTypes={className:s.default.PropTypes.string,selectedPage:s.default.PropTypes.string,labelHome:s.default.PropTypes.string,labelAbout:s.default.PropTypes.string,hrefHome:s.default.PropTypes.string,hrefAbout:s.default.PropTypes.string,onClickHome:s.default.PropTypes.func,onClickAbout:s.default.PropTypes.func},n.default=f},{"../common/link":3,"../site/constants/pages":5,classnames:1}],7:[function(e,t,n){"use strict";function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0}),n.constants=n.component=void 0;var s=e("./component"),l=a(s),r=e("./site/constants/pages"),u=o(r),c=e("./todos/constants/statuses"),i=o(c),f={PAGES:u,TODO_STATUSES:i};n.default={component:l.default,constants:{PAGES:u,TODO_STATUSES:i}},n.component=l.default,n.constants=f},{"./component":4,"./site/constants/pages":5,"./todos/constants/statuses":8}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.PENDING="PENDING",n.COMPLETE="COMPLETE",n.TOTAL="TOTAL"},{}],9:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var a="undefined"!=typeof window?window.React:"undefined"!=typeof global?global.React:null,s=o(a),l=e("classnames"),r=o(l),u=function(e){return s.default.createElement("article",{className:r.default("list-item",{checked:e.isComplete},e.className)},s.default.createElement("label",{className:"description"},s.default.createElement("input",{className:"checkbox",type:"checkbox",checked:e.isComplete,onChange:e.onCheckboxToggled}),e.description),s.default.createElement("button",{className:"button",onClick:e.onButtonClicked},e.buttonLabel))};u.propTypes={className:s.default.PropTypes.string,description:s.default.PropTypes.string,isComplete:s.default.PropTypes.bool,buttonLabel:s.default.PropTypes.string,onButtonClicked:s.default.PropTypes.func,onCheckboxToggled:s.default.PropTypes.func},n.default=u},{classnames:1}],10:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},s="undefined"!=typeof window?window.React:"undefined"!=typeof global?global.React:null,l=o(s),r=e("classnames"),u=o(r),c=e("../todos/todo-item"),i=o(c),f=function(e){return l.default.createElement("section",{className:u.default("list",e.className)},!!e.todos&&e.todos.map(function(e){return l.default.createElement(i.default,a({key:e.id},e))}))};f.propTypes={className:l.default.PropTypes.string,todos:l.default.PropTypes.array},n.default=f},{"../todos/todo-item":9,classnames:1}],11:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u="undefined"!=typeof window?window.React:"undefined"!=typeof global?global.React:null,c=o(u),i=e("classnames"),f=o(i),d=function(e){function t(e){a(this,t);var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleOnChange=function(e){n.setState({value:e.target.value})},n.handleOnSubmit=function(e){e.preventDefault(),n.setState({value:""}),n.props.onSubmit(n.state.value)},n.state={value:n.props.value||""},n.handleOnChange=n.handleOnChange.bind(n),n.handleOnSubmit=n.handleOnSubmit.bind(n),n}return l(t,e),r(t,[{key:"render",value:function(){var e=this.props,t=this.state;return c.default.createElement("form",{className:f.default(e.className),onSubmit:this.handleOnSubmit},c.default.createElement("input",{className:"todos-new-form-input",value:t.value,placeholder:e.placeholder,onChange:this.handleOnChange}))}}]),t}(u.Component);d.propTypes={className:c.default.PropTypes.string,placeholder:c.default.PropTypes.string,onSubmit:c.default.PropTypes.func},n.default=d},{classnames:1}],12:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},s="undefined"!=typeof window?window.React:"undefined"!=typeof global?global.React:null,l=o(s),r=e("classnames"),u=o(r),c=e("../site/site-header"),i=o(c),f=e("../todos/todos-new-form"),d=o(f),p=e("../todos/todos-list"),m=o(p),y=e("../todos/todos-summary"),b=o(y),g=function(e){return l.default.createElement("div",null,l.default.createElement(i.default,e.siteHeader),l.default.createElement("main",{className:u.default("page",e.className)},!!e.newForm&&l.default.createElement(d.default,a({className:"todos-new-form"},e.newForm)),!!e.list&&l.default.createElement(m.default,{className:"todos-list",todos:e.list}),!!e.summary&&l.default.createElement(b.default,a({className:"todos-summary"},e.summary))))};g.propTypes={className:l.default.PropTypes.string,siteHeader:l.default.PropTypes.object,newForm:l.default.PropTypes.object,list:l.default.PropTypes.array,summary:l.default.PropTypes.object},n.default=g},{"../site/site-header":6,"../todos/todos-list":10,"../todos/todos-new-form":11,"../todos/todos-summary":13,classnames:1}],13:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var a="undefined"!=typeof window?window.React:"undefined"!=typeof global?global.React:null,s=o(a),l=e("classnames"),r=o(l),u=e("../todos/constants/statuses"),c=function(e){return s.default.createElement("section",{className:r.default("todo-summary",e.className)},s.default.createElement("span",{className:r.default("todo-summary-pending",{"is-selected":e.selectedSummaryStatus===u.PENDING}),onClick:e.onClickPending},e.countIncomplete),s.default.createElement("span",{className:r.default("todo-summary-complete",{"is-selected":e.selectedSummaryStatus===u.COMPLETE}),onClick:e.onClickComplete},e.countComplete),s.default.createElement("span",{className:r.default("todo-summary-total",{"is-selected":e.selectedSummaryStatus===u.TOTAL}),onClick:e.onClickTotal},e.countTotal))};c.propTypes={className:s.default.PropTypes.string,countIncomplete:s.default.PropTypes.string,countComplete:s.default.PropTypes.string,countTotal:s.default.PropTypes.string,selectedSummaryStatus:s.default.PropTypes.oneOf([u.PENDING,u.COMPLETE,u.TOTAL]),onClickPending:s.default.PropTypes.func,onClickComplete:s.default.PropTypes.func,onClickTotal:s.default.PropTypes.func},n.default=c},{"../todos/constants/statuses":8,classnames:1}]},{},[7])(7)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
(function (process,global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.todoReduxState = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
},{}],2:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = applyMiddleware;

var _compose = _dereq_('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":5}],3:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],4:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = combineReducers;

var _createStore = _dereq_('./createStore');

var _isPlainObject = _dereq_('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = _dereq_('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2['default'])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if ("development" !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        (0, _warning2['default'])('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  if ("development" !== 'production') {
    var unexpectedKeyCache = {};
  }

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if ("development" !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        (0, _warning2['default'])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
},{"./createStore":6,"./utils/warning":8,"lodash/isPlainObject":12}],5:[function(_dereq_,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  var last = funcs[funcs.length - 1];
  var rest = funcs.slice(0, -1);
  return function () {
    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}
},{}],6:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports['default'] = createStore;

var _isPlainObject = _dereq_('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = _dereq_('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2['default'])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2['default']] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
}
},{"lodash/isPlainObject":12,"symbol-observable":13}],7:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = _dereq_('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = _dereq_('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = _dereq_('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = _dereq_('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = _dereq_('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = _dereq_('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if ("development" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2['default'])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2['default'];
exports.combineReducers = _combineReducers2['default'];
exports.bindActionCreators = _bindActionCreators2['default'];
exports.applyMiddleware = _applyMiddleware2['default'];
exports.compose = _compose2['default'];
},{"./applyMiddleware":2,"./bindActionCreators":3,"./combineReducers":4,"./compose":5,"./createStore":6,"./utils/warning":8}],8:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],9:[function(_dereq_,module,exports){
var overArg = _dereq_('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":10}],10:[function(_dereq_,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],11:[function(_dereq_,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],12:[function(_dereq_,module,exports){
var getPrototype = _dereq_('./_getPrototype'),
    isObjectLike = _dereq_('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_getPrototype":9,"./isObjectLike":11}],13:[function(_dereq_,module,exports){
module.exports = _dereq_('./lib/index');

},{"./lib/index":14}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ponyfill = _dereq_('./ponyfill');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root = undefined; /* global window */

if (typeof global !== 'undefined') {
	root = global;
} else if (typeof window !== 'undefined') {
	root = window;
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
},{"./ponyfill":15}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.subscribe = exports.constants = exports.actions = undefined;

var _store = _dereq_('../src/store');

var _store2 = _interopRequireDefault(_store);

var _pages = _dereq_('./site/constants/pages');

var PAGES = _interopRequireWildcard(_pages);

var _statuses = _dereq_('./todos/constants/statuses');

var TODOS_STATUSES = _interopRequireWildcard(_statuses);

var _updateSelectedPage = _dereq_('./site/actions/update-selected-page');

var _updateSelectedPage2 = _interopRequireDefault(_updateSelectedPage);

var _addTodo = _dereq_('./todos/actions/add-todo');

var _addTodo2 = _interopRequireDefault(_addTodo);

var _loadTodos = _dereq_('./todos/actions/load-todos');

var _loadTodos2 = _interopRequireDefault(_loadTodos);

var _removeTodo = _dereq_('./todos/actions/remove-todo');

var _removeTodo2 = _interopRequireDefault(_removeTodo);

var _completeTodo = _dereq_('./todos/actions/complete-todo');

var _completeTodo2 = _interopRequireDefault(_completeTodo);

var _updateSelectedSummaryStatus = _dereq_('./todos/actions/update-selected-summary-status');

var _updateSelectedSummaryStatus2 = _interopRequireDefault(_updateSelectedSummaryStatus);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var final = {};

var actionsSet = {
	site: {
		updateSelectedPage: _updateSelectedPage2.default
	},
	todos: {
		addTodo: _addTodo2.default,
		loadTodos: _loadTodos2.default,
		removeTodo: _removeTodo2.default,
		completeTodo: _completeTodo2.default,
		updateSelectedSummaryStatus: _updateSelectedSummaryStatus2.default
	}
};

final.actions = Object.keys(actionsSet).reduce(function (p1, key1) {
	p1[key1] = Object.keys(actionsSet[key1]).reduce(function (p2, key2) {
		p2[key2] = function () {
			var action = actionsSet[key1][key2].apply(null, arguments);
			_store2.default.dispatch(action);
			return action;
		};
		return p2;
	}, {});
	return p1;
}, {});

final.constants = {
	PAGES: PAGES,
	TODOS_STATUSES: TODOS_STATUSES
};

final.subscribe = _store2.default.subscribe;

Object.defineProperty(final, "state", { get: _store2.default.getState });

exports.default = final;
var actions = exports.actions = final.actions;
var constants = exports.constants = final.constants;
var subscribe = exports.subscribe = final.subscribe;

Object.defineProperty(exports, "state", { get: _store2.default.getState });

},{"../src/store":20,"./site/actions/update-selected-page":17,"./site/constants/pages":18,"./todos/actions/add-todo":21,"./todos/actions/complete-todo":22,"./todos/actions/load-todos":23,"./todos/actions/remove-todo":24,"./todos/actions/update-selected-summary-status":25,"./todos/constants/statuses":27}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (newSelectedPage) {
	return function (dispatch, getState) {
		var _getState = getState();

		var selectedPage = _getState.selectedPage;

		if (selectedPage !== newSelectedPage) {
			dispatch({ type: UPDATE_SELECTED_PAGE, selectedPage: newSelectedPage });
		}
	};
};

var UPDATE_SELECTED_PAGE = exports.UPDATE_SELECTED_PAGE = 'UPDATE_SELECTED_PAGE';

},{}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var HOME = exports.HOME = 'HOME';
var ABOUT = exports.ABOUT = 'ABOUT';

},{}],19:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var selectedPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _pages.HOME;
	var action = arguments[1];

	switch (action.type) {
		case _updateSelectedPage.UPDATE_SELECTED_PAGE:
			return action.selectedPage;

		default:
			return selectedPage;
	}
};

var _updateSelectedPage = _dereq_('../../site/actions/update-selected-page');

var _pages = _dereq_('../../site/constants/pages');

},{"../../site/actions/update-selected-page":17,"../../site/constants/pages":18}],20:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _redux = _dereq_('redux');

var _reduxThunk = _dereq_('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _selectedPage = _dereq_('./site/reducers/selected-page');

var _selectedPage2 = _interopRequireDefault(_selectedPage);

var _todos = _dereq_('./todos/reducers/todos');

var _todos2 = _interopRequireDefault(_todos);

var _selectedSummaryStatus = _dereq_('./todos/reducers/selected-summary-status');

var _selectedSummaryStatus2 = _interopRequireDefault(_selectedSummaryStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducers = {
	selectedPage: _selectedPage2.default,
	todos: _todos2.default,
	selectedSummaryStatus: _selectedSummaryStatus2.default
};

// middleware that logs all actions to console


// reducers
var consoleLog = function consoleLog(store) {
	return function (next) {
		return function (action) {
			if (typeof action !== 'function') {
				console.log(action);
			}
			return next(action);
		};
	};
};

// middleware
var middleWare = void 0;
if (process.env.NODE_ENV !== 'production') {
	middleWare = (0, _redux.applyMiddleware)(consoleLog, _reduxThunk2.default);
} else {
	middleWare = (0, _redux.applyMiddleware)(_reduxThunk2.default);
}

// create store
exports.default = (0, _redux.createStore)((0, _redux.combineReducers)(reducers), middleWare);

},{"./site/reducers/selected-page":19,"./todos/reducers/selected-summary-status":28,"./todos/reducers/todos":29,"redux":7,"redux-thunk":1}],21:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (description) {
	return function (dispatch, getState) {
		if (!description || !description.length) {
			return Promise.resolve(null);
		}

		return (0, _newTodo2.default)(description).then(function (todo) {
			var id = todo.id;
			delete todo.id;
			dispatch((0, _updateTodos3.default)(_defineProperty({}, id, todo)));
		});
	};
};

var _newTodo = _dereq_('../../todos/services/fake-backend/new-todo');

var _newTodo2 = _interopRequireDefault(_newTodo);

var _updateTodos2 = _dereq_('../../todos/actions/update-todos');

var _updateTodos3 = _interopRequireDefault(_updateTodos2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

},{"../../todos/actions/update-todos":26,"../../todos/services/fake-backend/new-todo":32}],22:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (id, isComplete) {
	return function (dispatch, getState) {
		var _getState = getState();

		var todos = _getState.todos;

		var todo = todos[id];

		if (!todo) {
			return;
		}

		todo.isComplete = isComplete;

		return (0, _saveTodo2.default)(id, todo).then(function (res) {
			dispatch((0, _updateTodos3.default)(_defineProperty({}, res.id, res.todo)));
		});
	};
};

var _saveTodo = _dereq_('../../todos/services/fake-backend/save-todo');

var _saveTodo2 = _interopRequireDefault(_saveTodo);

var _updateTodos2 = _dereq_('../../todos/actions/update-todos');

var _updateTodos3 = _interopRequireDefault(_updateTodos2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

},{"../../todos/actions/update-todos":26,"../../todos/services/fake-backend/save-todo":33}],23:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.LOAD_TODOS = undefined;

exports.default = function (todos) {
	return function (dispatch, getState) {
		return (0, _loadAllTodos2.default)().then(function (todos) {
			if (!todos) {
				return Promise.resolve(null);
			}
			dispatch((0, _updateTodos2.default)(todos));
		});
	};
};

var _loadAllTodos = _dereq_('../../todos/services/fake-backend/load-all-todos');

var _loadAllTodos2 = _interopRequireDefault(_loadAllTodos);

var _updateTodos = _dereq_('../../todos/actions/update-todos');

var _updateTodos2 = _interopRequireDefault(_updateTodos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOAD_TODOS = exports.LOAD_TODOS = 'LOAD_TODOS';

},{"../../todos/actions/update-todos":26,"../../todos/services/fake-backend/load-all-todos":31}],24:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (id) {
	return function (dispatch, getState) {
		return (0, _deleteTodo2.default)(id).then(function (todo) {
			dispatch((0, _updateTodos3.default)(_defineProperty({}, id, null)));
		});
	};
};

var _deleteTodo = _dereq_('../../todos/services/fake-backend/delete-todo');

var _deleteTodo2 = _interopRequireDefault(_deleteTodo);

var _updateTodos2 = _dereq_('../../todos/actions/update-todos');

var _updateTodos3 = _interopRequireDefault(_updateTodos2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

},{"../../todos/actions/update-todos":26,"../../todos/services/fake-backend/delete-todo":30}],25:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (selectedSummaryStatus) {
	return { type: UPDATE_SELECTED_SUMMARY_STATUS, selectedSummaryStatus: selectedSummaryStatus };
};

var UPDATE_SELECTED_SUMMARY_STATUS = exports.UPDATE_SELECTED_SUMMARY_STATUS = 'UPDATE_SELECTED_SUMMARY_STATUS';

},{}],26:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (todos) {
	return { type: UPDATE_TODOS, todos: todos };
};

var UPDATE_TODOS = exports.UPDATE_TODOS = 'UPDATE_TODOS';

},{}],27:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PENDING = exports.PENDING = 'PENDING';
var COMPLETE = exports.COMPLETE = 'COMPLETE';
var TOTAL = exports.TOTAL = 'TOTAL';

},{}],28:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var selectedSummaryStatus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _statuses.TOTAL;
	var action = arguments[1];

	switch (action.type) {
		case _updateSelectedSummaryStatus.UPDATE_SELECTED_SUMMARY_STATUS:
			return action.selectedSummaryStatus;

		default:
			return selectedSummaryStatus;
	}
};

var _updateSelectedSummaryStatus = _dereq_('../../todos/actions/update-selected-summary-status');

var _statuses = _dereq_('../../todos/constants/statuses');

},{"../../todos/actions/update-selected-summary-status":25,"../../todos/constants/statuses":27}],29:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var todos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	var newTodos = void 0;

	switch (action.type) {
		case _updateTodos.UPDATE_TODOS:
			newTodos = _extends({}, todos);

			Object.keys(action.todos).forEach(function (key) {
				if (action.todos[key]) {
					newTodos[key] = action.todos[key];
				} else {
					delete newTodos[key];
				}
			});

			return newTodos;

		default:
			return todos;
	}
};

var _updateTodos = _dereq_('../../todos/actions/update-todos');

},{"../../todos/actions/update-todos":26}],30:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (id) {
	return new Promise(function (r, x) {
		setTimeout(function () {
			return r(true);
		}, 50);
	});
};

},{}],31:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var todos = {
		'10': {
			description: 'Buy tomatoes from grocery store',
			dateCreated: '2016-09-19T18:44:15.635',
			isComplete: false
		},
		'3': {
			description: 'Finish writing blog post',
			dateCreated: '2016-09-20T18:44:18.635',
			isComplete: false
		}
	};

	return new Promise(function (r, x) {
		setTimeout(function () {
			return r(todos);
		}, 50);
	});
};

},{}],32:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (description) {
	var id = Math.round(Math.random() * 10000).toFixed();
	var newTodo = {
		id: id,
		description: description,
		dateCreated: new Date().toISOString(),
		isComplete: false
	};

	return new Promise(function (r, x) {
		setTimeout(function () {
			return r(newTodo);
		}, 50);
	});
};

},{}],33:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (id, todo) {
	return new Promise(function (r, x) {
		setTimeout(function () {
			return r({ id: id, todo: todo });
		}, 50);
	});
};

},{}]},{},[16])(16)
});
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":1}],8:[function(require,module,exports){
'use strict';

var _todoReduxState = require('todo-redux-state');

var _todoReactComponents = require('todo-react-components');

var _paths = require('./site/constants/paths');

var PATHS = _interopRequireWildcard(_paths);

var _selectors = require('./selectors');

var _selectors2 = _interopRequireDefault(_selectors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// debug stuff
Object.defineProperty(window, "state", { get: function get() {
        return _todoReduxState.state;
    } });
window.selectors = _selectors2.default;
window.actions = _todoReduxState.actions;
console.log('********************************************* \n DEVELOPMENT MODE \n window.state available \n window.selectors available \n ********************************************* \n');

// subscribe to state changes and re-render view on every change
var htmlElement = document.getElementById('app');
(0, _todoReduxState.subscribe)(function () {
    return (0, _todoReactComponents.component)(htmlElement, _selectors2.default);
});

// read the url and navigate to the right page
var initialSelectedPage = Object.keys(PATHS).find(function (key) {
    return PATHS[key] === window.location.pathname;
}) || PATHS.HOME;
_todoReduxState.actions.site.updateSelectedPage(initialSelectedPage);

// load todos
_todoReduxState.actions.todos.loadTodos();

// listen for back button, forward button, etc
window.onpopstate = function (e) {
    var newSelectedPage = Object.keys(PATHS).find(function (key) {
        return PATHS[key] === window.location.pathname;
    }) || PATHS.HOME;
    _todoReduxState.actions.site.updateSelectedPage(newSelectedPage);
};

},{"./selectors":9,"./site/constants/paths":10,"todo-react-components":6,"todo-redux-state":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _combineSelectors = require('combine-selectors');

var _combineSelectors2 = _interopRequireDefault(_combineSelectors);

var _todoReduxState = require('todo-redux-state');

var _selectedPage = require('./site/selected-page');

var _selectedPage2 = _interopRequireDefault(_selectedPage);

var _url = require('./site/url');

var _url2 = _interopRequireDefault(_url);

var _siteHeader = require('./site/site-header');

var _siteHeader2 = _interopRequireDefault(_siteHeader);

var _todos = require('./todos/todos');

var _todos2 = _interopRequireDefault(_todos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectors = {
	selectedPage: _selectedPage2.default,
	url: _url2.default,
	siteHeader: _siteHeader2.default,
	todos: _todos2.default
};

exports.default = (0, _combineSelectors2.default)(selectors, function () {
	return _todoReduxState.state;
});

},{"./site/selected-page":11,"./site/site-header":12,"./site/url":13,"./todos/todos":14,"combine-selectors":2,"todo-redux-state":7}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var HOME = exports.HOME = '/';
var ABOUT = exports.ABOUT = '/about';

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectSelectedPage = undefined;

exports.default = function (state) {
	var selectedPage = state.selectedPage;

	return selectSelectedPage(selectedPage);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _todoReactComponents = require('todo-react-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectSelectedPage = exports.selectSelectedPage = (0, _memoizerific2.default)(1)(function (selectedPage) {
	return _todoReactComponents.constants.PAGES[selectedPage];
});

},{"memoizerific":5,"todo-react-components":6}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectSiteHeader = undefined;

exports.default = function (state) {
	var selectedPage = state.selectedPage;

	return selectSiteHeader(selectedPage);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _todoReduxState = require('todo-redux-state');

var _paths = require('../site/constants/paths');

var PATHS = _interopRequireWildcard(_paths);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectSiteHeader = exports.selectSiteHeader = (0, _memoizerific2.default)(1)(function (selectedPage) {

	return {
		labelHome: 'Todo App',
		labelAbout: 'About',

		hrefHome: PATHS[_todoReduxState.constants.PAGES.HOME],
		hrefAbout: PATHS[_todoReduxState.constants.PAGES.ABOUT],

		selectedPage: selectedPage,

		onClickHome: function onClickHome() {
			return _todoReduxState.actions.site.updateSelectedPage(_todoReduxState.constants.PAGES.HOME);
		},
		onClickAbout: function onClickAbout() {
			return _todoReduxState.actions.site.updateSelectedPage(_todoReduxState.constants.PAGES.ABOUT);
		}
	};
});

},{"../site/constants/paths":10,"memoizerific":5,"todo-redux-state":7}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectURL = undefined;

exports.default = function (state) {
	var selectedPage = state.selectedPage;

	return selectURL(selectedPage);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _paths = require('../site/constants/paths');

var PATHS = _interopRequireWildcard(_paths);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectURL = exports.selectURL = (0, _memoizerific2.default)(1)(function (selectedPage) {
	var SITE_PATHS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PATHS;

	return SITE_PATHS[selectedPage];
});

},{"../site/constants/paths":10,"memoizerific":5}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectTodos = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (state) {
	var todos = state.todos;
	var selectedSummaryStatus = state.selectedSummaryStatus;


	return selectTodos(todos, selectedSummaryStatus);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _todoReduxState = require('todo-redux-state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectTodos = exports.selectTodos = (0, _memoizerific2.default)(1)(function (todos, selectedSummaryStatus) {

	var newForm = {
		placeholder: 'What do you need to do?',
		onSubmit: function onSubmit(description) {
			return _todoReduxState.actions.todos.addTodo(description);
		}
	};

	var list = Object.keys(todos).map(function (key) {
		return _extends({}, todos[key], {
			id: key,
			buttonLabel: 'delete',
			onButtonClicked: function onButtonClicked() {
				return _todoReduxState.actions.todos.removeTodo(key);
			},
			onCheckboxToggled: function onCheckboxToggled() {
				return _todoReduxState.actions.todos.completeTodo(key, !todos[key].isComplete);
			}
		});
	});

	var summary = list.reduce(function (p, todo) {
		!todo.isComplete && p.countIncomplete++;
		todo.isComplete && p.countComplete++;
		p.countTotal++;
		return p;
	}, {
		countIncomplete: 0,
		countComplete: 0,
		countTotal: 0
	});

	list = list.filter(function (todo) {
		return selectedSummaryStatus === _todoReduxState.constants.TODOS_STATUSES.TOTAL || selectedSummaryStatus === _todoReduxState.constants.TODOS_STATUSES.COMPLETE && todo.isComplete || selectedSummaryStatus === _todoReduxState.constants.TODOS_STATUSES.PENDING && !todo.isComplete;
	}).sort(function (a, b) {
		if (a.dateCreated < b.dateCreated) {
			return -1;
		}
		if (a.dateCreated > b.dateCreated) {
			return 1;
		}
		if (a.id < b.id) {
			return -1;
		}
		return 1;
	});

	summary.countIncomplete = summary.countIncomplete + ' pending';
	summary.countComplete = summary.countComplete + ' complete';
	summary.countTotal = summary.countTotal + ' total';

	summary.selectedSummaryStatus = selectedSummaryStatus;

	summary.onClickPending = function () {
		return _todoReduxState.actions.todos.updateSelectedSummaryStatus(_todoReduxState.constants.TODOS_STATUSES.PENDING);
	};
	summary.onClickComplete = function () {
		return _todoReduxState.actions.todos.updateSelectedSummaryStatus(_todoReduxState.constants.TODOS_STATUSES.COMPLETE);
	};
	summary.onClickTotal = function () {
		return _todoReduxState.actions.todos.updateSelectedSummaryStatus(_todoReduxState.constants.TODOS_STATUSES.TOTAL);
	};

	return {
		newForm: newForm,
		list: list,
		summary: summary
	};
});

},{"memoizerific":5,"todo-redux-state":7}]},{},[8])
//# sourceMappingURL=build.js.map
