/**
 * Tiny, modular implementation of the CommonJS
 * Modules/AsynchronousDefinition as described in
 * http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition
 *
 * This extension provides friendly integration points for manipulating
 * modules before or after they are defined.
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

/*global define */

define('tAMD/hooks', ['tAMD'], function(tAMD, undef) {
    var queues = {};

    tAMD._pre = function(/* id, dependencies, factory */) {
        return runCallbacks('define', arguments);
    };

    tAMD._post = function(/* id, moduleValue */) {
        return runCallbacks('publish', arguments);
    };

    tAMD._req = function(/* id, contextId */) {
        return runCallbacks('require', arguments);
    };

    function runCallbacks(eventType, args) {
        var callbacks = getQueue(eventType, '**').concat(getQueue(eventType, args[0]))
          , ret, val;
        for (var i = 0; i < callbacks.length; i++) {
            if (ret !== false) {
                val = callbacks[i].apply(undef, ret || args);
                ret = (val !== false) && (val || ret);
            }
        }
        return ret;
    }

    function on(eventType, id, callback) {
        if (!callback) {
            callback = id;
            id = '**';  // hook runs on every module
        }
        getQueue(eventType, id).push(callback);
    }

    function off(eventType, id, callback) {
        if (typeof id === 'function') {
            callback = id;
            id = '**';  // hook runs on every module
        }
        var queue = getQueue(eventType, id || '**');
        for (var i = 0; i < queue.length; i++) {
            if (queue[i] === callback || !callback) {
                queue.splice(i, 1);  // Removes the matching callback from the array.
                i -= 1; // Compensate for array length changing within the loop.
            }
        }
    }

    function getQueue(eventType, id) {
        var typeSpecific = queues[eventType] = queues[eventType] || {}
          , queue = typeSpecific[id] = typeSpecific[id] || [];
        return queue;
    }

    return {
        'on': on,
        'off': off
    };
});
