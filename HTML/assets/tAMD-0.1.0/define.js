/**
 * Tiny, modular implementation of the CommonJS
 * Modules/AsynchronousDefinition as described in
 * http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition
 *
 * Copyright 2012-2013 Jive Software
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jshint laxcomma:true sub:true boss:true loopfunc:true */

(function(global, undef) {
    var definitions = {}
      , required = {};

    function define(/* [id], [dependencies], factory */) {
        var args = [].slice.call(arguments)
          , id = typeof args[0] === 'string' ? args.shift() : undef
          , dependencies = args.length > 1 ? args.shift() : []
          , factory = args[0]
          , hooked = tAMD._pre(id, dependencies, factory);

        if (hooked !== false) {
            if (hooked) {
                id = hooked[0];
                dependencies = hooked[1];
                factory = hooked[2];
            }

            run(function() {
                addDefinition(id, map(function(d) { return requireSync(d, id); }, dependencies), factory);
            }, dependencies);
        }
    }
    define['amd'] = {};  // According to the spec, define should have this property.

    function requireSync(id, contextId) {
        if (id === 'require') {
            return function(id) {
                return requireSync(id, contextId);
            };
        }

        var hooked = tAMD._req(id, contextId);
        return definitions[(hooked && hooked[0]) || id];
    }

    function noop() {}

    var tAMD = {
        _pre: noop,
        _post: noop,
        _req: noop
    };
    define('tAMD', tAMD);
    satisfy('require');

    global['define'] = define;
    global['require'] = define;

    function addDefinition(id, dependencies, factory) {
        var moduleValue = typeof factory === 'function' ?
              factory.apply(undef, dependencies) : factory
          , hooked = tAMD._post(id, moduleValue);

        if (hooked !== false) {
            if (hooked) {
                id = hooked[0];
                moduleValue = hooked[1];
            }

            if (moduleValue && id) {
                definitions[id] = moduleValue;
                satisfy(id);
            }
        }
    }

    function map(f, array) {
        var results = [];
        for (var i = 0; i < array.length; i++) {
            results.push(f(array[i]));
        }
        return results;
    }

    /**
     * The functions run() and satisfy() are adapted from the Kongregate
     * Asynchronous JavaScript Loader
     * https://gist.github.com/388e70bccd3fdb8a6617
     *
     * The MIT License
     *
     * Copyright (c) 2010 Kongregate Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    function run(fn, dependencies) {
        var ifn, len = dependencies.length;

        if (!len) {
            fn();
        } else if (1 === len) {
            ifn = fn;
        } else {
            var count = len;
            ifn = function() { if (!--count) { fn(); } };
        }

        for (var i = 0; i < len; i++) {
            var depFn = required[dependencies[i]];
            if (true === depFn) {
                ifn();
            } else {
                required[dependencies[i]] = depFn ? (function(origFn) {
                    return function() { origFn(); ifn(); };
                }(depFn)) : ifn;
            }
        }
    }

    function satisfy(dep) {
        if (required[dep] && true !== required[dep]) { required[dep](); }
        required[dep] = true;
    }
}(this));
