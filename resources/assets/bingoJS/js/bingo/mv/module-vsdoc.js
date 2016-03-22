
(function (bingo) {
    //version 1.1.0
    "use strict";

    /*
    bingo.app('sip', function(){
    
        //定义system/user/list 和 system/user/form 两个action
        bingo.module('system', function () {
    
            //控制器user
            bingo.controller('user', function () {
    
                //action list
                bingo.action('list', function ($view) {
                    //这里开始写业务代码
                    $view.on('ready', function () {
                    });
    
                });
    
                //action form
                bingo.action('form', function ($view) {
                });
            });

             //定义system 的 userService
            bingo.service('userService', function ($ajax) {
                //这里写服务代码
            });

            //定义system 的 factory1
            bingo.factory('factory1', function($view){});

            //定义system 的 command1
            bingo.command('command1', function(){ return function($view){}});

            //定义system 的 filter1
            bingo.filter('filter1', function($view){ return function(value, params){ return value; }});
    
        });
    
        //定义system/userService服务
        bingo.module('system', function () {
    
            //userService
            bingo.service('userService', function ($ajax) {
                //这里写服务代码
            });
    
        });

    });//end app
    
    */

    var _makeCommandOpt = function (fn) {
        var opt = {
            priority: 50,
            tmpl: '',
            tmplUrl: '',
            replace: false,
            include: false,
            view: false,
            compileChild: true
            //action: null,
            //compilePre: null,
            //as:null
            //compile: null,
            //link: null
        };
        fn = fn();
        if (bingo.isFunction(fn) || bingo.isArray(fn)) {
            opt.link = fn;
        } else {
            opt = bingo.extend(opt, fn);
        }
        opt.action && bingo.factory(opt.action);
        opt.compilePre && bingo.factory(opt.compilePre);
        opt.as && bingo.factory(opt.as);
        opt.compile && bingo.factory(opt.compile);
        opt.link && bingo.factory(opt.link);
        return opt;
    }, _commandFn = function (name, fn) {
        /// <summary>
        /// 定义或获取command
        /// </summary>
        /// <param name="name">定义或获取command名称</param>
        /// <param name="fn" type="function()">可选</param>
        if (bingo.isNullEmpty(name)) return;
        name = name.toLowerCase();
        if (arguments.length == 1)
            return _getModuleValue.call(this, '_commands', name);
        else {
            _lastModule = this;
            var cmd = this._commands[name] = _makeCommandOpt(fn);
            _lastModule = null;
            return cmd;
       }
    }, _filterFn = function (name, fn) {
        /// <summary>
        /// 定义或获取filter
        /// </summary>
        /// <param name="name">定义或获取filter名称</param>
        /// <param name="fn" type="function(injects..)">可选</param>
        if (bingo.isNullEmpty(name)) return null;
        if (fn) {
            _lastModule = this;
            bingo.factory(fn);
            _lastModule = null;
        }
        if (arguments.length == 1)
            return _getModuleValue.call(this, '_filters', name);
        else
            return this._filters[name] = fn;
    }, _factoryFn = function (name, fn) {
        /// <summary>
        /// 定义或获取factory
        /// </summary>
        /// <param name="name">定义或获取factory名称</param>
        /// <param name="fn" type="function(injects..)">可选</param>
        var len = arguments.length;
        if (len == 0)
            return this._factorys;
        else if (len == 1) {
            var fa = bingo.factory.factoryClass.NewObject().setFactory(name);
            fa.inject();
            return fa;
        } else {
            if (fn) {
                if (fn === true)
                    return _getModuleValue.call(this, '_factorys', name);
                _lastModule = this;
                bingo.factory(fn);
                _lastModule = null;
            }
            return this._factorys[name] = fn;
        }

    }, _factoryExtendFn = function (name, fn) {
        /// <summary>
        /// 定义或获取factory扩展
        /// </summary>
        /// <param name="name">定义或获取扩展名称</param>
        /// <param name="fn" type="function(injects..)">可选</param>
        if (bingo.isNullEmpty(name)) return;
        if (fn) {
            fn.$owner = { module: this };
            _lastModule = this;
            bingo.factory(fn);
            _lastModule = null;
        }
        if (arguments.length == 1)
            return _getModuleValue.call(this, '_factoryExtends', name);
        else
            return this._factoryExtends[name] = fn;
    }, _serviceFn = function (name, fn) {
        /// <summary>
        /// 定义或获取service
        /// </summary>
        /// <param name="name">定义或获取service名称</param>
        /// <param name="fn" type="function(injects..)">可选</param>
        if (bingo.isNullEmpty(name)) return;
        if (fn) {
            fn.$owner = { module: this };
            _lastModule = this;
            bingo.factory(fn);
            _lastModule = null;
        }
        if (arguments.length == 1)
            return _getModuleValue.call(this, '_services', name);
        else
            return this._services[name] = fn;
    }, _controllerFn = function (name, fn) {
        /// <summary>
        /// 定义或获取controller
        /// </summary>
        /// <param name="name">定义或获取controller名称</param>
        /// <param name="fn" type="function()">可选</param>
        if (bingo.isNullEmpty(name)) return;
        var conroller = this._controllers[name];
        if (!conroller)
            conroller = this._controllers[name] = {
                module: this,
                name: name, _actions: {},
                action: _actionFn
            };
        if (bingo.isFunction(fn)) {
            var hasLM = _lastModule
            !hasLM && (_lastModule = this);
            var hasApp = _lastApp;
            !hasApp && (_lastApp = _lastModule.app);

            _lastContoller = conroller;
            fn.call(conroller);
            _lastContoller = null;
            !hasLM && (_lastModule = null);
            !hasApp && (_lastApp = null);
        }
        return conroller;
    }, _actionFn = function (name, fn) {
        /// <summary>
        /// 定义或获取action
        /// </summary>
        /// <param name="name">定义或获取action名称</param>
        /// <param name="fn" type="function(injects..)">可选</param>
        if (fn) {
            fn.$owner = { conroller: this, module: this.module };
            _lastModule = this.module;
            bingo.factory(fn);
            _lastModule = null;
        }
        if (arguments.length == 1)
            return this._actions[name];
        else {
            return this._actions[name] = fn;
        }
    }, _actionMDFn = function (name, fn) {
        if (fn) {
            fn.$owner = { conroller: null, module: this };
            _lastModule = this;
            bingo.factory(fn);
            _lastModule = null;
        }
        if (arguments.length == 1)
            return this._actions[name];
        else {
            return this._actions[name] = fn;
        }
    }, _getLastModule = function () {
        return _lastModule || bingo.defaultModule(_lastApp);
    }, _getModuleValue = function (prop, name) {
        var val = this[prop][name];
        if (!val) {
            var defaultModule = bingo.defaultModule(this.app);
            if (this != defaultModule)
                val = defaultModule[prop][name]
            if (!val && this.app != _defaultApp) {
                var defaultModule = bingo.defaultModule();
                if (this != defaultModule)
                    val = defaultModule[prop][name]
            }
        }
        return val;
    };

    var _moduleFn = function (name, fn) {
        /// <summary>
        /// 定义或获取模块
        /// </summary>
        /// <param name="name">定义或获取模块名称</param>
        /// <param name="fn" type="function(injects..)">可选</param>
        if (bingo.isNullEmpty(name)) return null;

        var module = this._module[name];

        if (!module)
            module = this._module[name] = {
                name: name, _services: {}, _controllers: {},
                _commands: {}, _filters: {}, _factorys: {},
                _actions: {}, action: _actionMDFn,
                service: _serviceFn,
                controller: _controllerFn,
                command: _commandFn,
                filter: _filterFn,
                factory: _factoryFn,
                _factoryExtends: {}, factoryExtend: _factoryExtendFn,
                app: this
            };

        if (bingo.isFunction(fn)) {
            var hasApp = _lastApp;
            !hasApp && (_lastApp = this);
            _lastModule = module;
            fn.call(module);
            _lastModule = null;
            !hasApp && (_lastApp = null);
        }
        return module;

    }, _defaultModuleFn = function () {
        return this.module('_$defaultModule$_');
    };

    var _app = {}, _module = {}, _lastApp = null, _lastModule = null, _lastContoller = null;
    bingo.extend({
        defaultModule: function (app) {
            return app ? app.defaultModule() : _defaultApp.defaultModule();
        },
        getModuleByView: function (view) {
            return _lastModule || bingo.defaultModule();
        },
        module: function (name, fn) {
            /// <summary>
            /// 定义或获取模块
            /// </summary>
            /// <param name="name">定义或获取模块名称</param>
            /// <param name="fn" type="function(injects..)">可选</param>
            var app = _lastApp || _defaultApp;
            return app.module.apply(app, arguments);
        },
        defaultApp: function () {
            return _defaultApp;
        },
        getAppByView: function (view) { return this.getModuleByView(view).app; },
        //定义或获取app
        app: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            //if (arguments.length == 1)
            //    return _module[name];

            var app = _app[name];

            if (!app) {
                app = _app[name] = {
                    name: name, _module: {},
                    module: _moduleFn,
                    defaultModule: _defaultModuleFn,
                    action: function (name, fn) {
                        var defaultModule = this.defaultModule();
                        return defaultModule.action.apply(defaultModule, arguments);
                    },
                    service: function (name, fn) {
                        var defaultModule = this.defaultModule();
                        return defaultModule.service.apply(defaultModule, arguments);
                    },
                    controller: function (name, fn) {
                        var defaultModule = this.defaultModule();
                        return defaultModule.controller.apply(defaultModule, arguments);
                    },
                    command: function (name, fn) {
                        var defaultModule = this.defaultModule();
                        return defaultModule.command.apply(defaultModule, arguments);
                    },
                    filter: function (name, fn) {
                        var defaultModule = this.defaultModule();
                        return defaultModule.filter.apply(defaultModule, arguments);
                    },
                    factory: function (name, fn) {
                        var defaultModule = this.defaultModule();
                        return defaultModule.factory.apply(defaultModule, arguments);
                    },
                    factoryExtend: function (name, fn) {
                        var defaultModule = this.defaultModule();
                        return defaultModule.factoryExtend.apply(defaultModule, arguments);
                    }
                };
            }

            if (bingo.isFunction(fn)) {
                _lastApp = app;
                fn.call(app);
                _lastApp = null;
            }
            return app;
        },
        service: function (name, fn) {
            /// <summary>
            /// 定义服务service
            /// </summary>
            /// <param name="name">定义服务service名称</param>
            /// <param name="fn" type="function(injects..)"></param>
            var lm = _getLastModule();
            return lm.service.apply(lm, arguments);
        },
        factoryExtend: function (name, fn) {
            /// <summary>
            /// 定义或获取factory扩展
            /// </summary>
            /// <param name="name">定义或获取扩展名称</param>
            /// <param name="fn" type="function(injects..)">可选</param>
            var lm = _getLastModule();
            return lm.factoryExtend.apply(lm, arguments);
        },
        controller: function (name, fn) {
            /// <summary>
            /// 定义服务service
            /// </summary>
            /// <param name="name">定义服务service名称</param>
            /// <param name="fn" type="function(injects..)"></param>
            var lm = _getLastModule();
            return lm.controller.apply(lm, arguments);
        },
        action: function (name, fn) {
            /// <summary>
            /// 定义action
            /// </summary>
            /// <param name="name">定义action名称</param>
            /// <param name="fn" type="function(injects..)"></param>
            if (bingo.isFunction(name) || bingo.isArray(name)) {
                //intellisenseLogMessage('_lastModule', !bingo.isNull(_lastModule));
                //_lastModule = _lastContoller.module;
                bingo.factory(name);
                return name;
            } else if (_lastContoller)
                return _lastContoller.action.apply(_lastContoller, arguments);
            else {
                var lm = _getLastModule();
                return lm.action.apply(lm, arguments);
            }
        },
        command: function (name, fn) {
            var lm = _getLastModule();
            return lm.command.apply(lm, arguments);
        },
        filter: function (name, fn) {
            var lm = _getLastModule();
            return lm.filter.apply(lm, arguments);
        },
        factory: function (name, fn) {
            var lm = _getLastModule();
            return lm.factory.apply(lm, arguments);
        }
    });

    var _defaultApp = bingo.app('_$defaultApp$_');

})(bingo);
