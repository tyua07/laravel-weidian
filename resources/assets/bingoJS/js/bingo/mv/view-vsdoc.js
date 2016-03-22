
(function (bingo) {
    //version 1.1.0
    "use strict";

    bingo.view = function (jqSelector) {
        /// <summary>
        /// 获取view
        /// </summary>
        /// <param name="jqSelector"></param>
        return _view;
    };

    bingo.rootView = function () {
        /// <summary>
        /// 根view
        /// </summary>
        return bingo.view();
    };

    //view==提供视图==================
    var _viewClass = bingo.view.viewClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Define({
            onActionBefore: function (callback) {
                /// <summary>
                /// 进入action前事件
                /// </summary>
                /// <param name="callback" type="function()"></param>
                return this;
            },
            onInitDataSrv: function (callback) {
                /// <summary>
                /// 初始数据用事件(用于服务或factory), onInitDataSrv --> onInitData --> onReady
                /// </summary>
                /// <param name="callback" type="function()"></param>
                return this;
            },
            onInitData: function (callback) {
                /// <summary>
                /// 初始数据用事件(用于业务), onInitDataSrv --> onInitData --> onReady
                /// </summary>
                /// <param name="callback" type="function()"></param>
                return this;
            },
            onReady: function (callback) {
                /// <summary>
                /// 本$view准备好后事件
                /// </summary>
                /// <param name="callback" type="function()"></param>
                return this;
            },
            //处理readyAll
            onReadyAll: function (callback) {
                /// <summary>
                /// 本$view，下级$view及要加载的数据准备好后事件
                /// </summary>
                /// <param name="callback" type="function()"></param>
                return this;
            },
            $setModule: function (module) {
                /// <summary>
                /// 设置module
                /// </summary>
                /// <param name="module"></param>
                this._module = module;
                return this;
            },
            $getModule: function () {
                /// <summary>
                /// 获取module
                /// </summary>
                return this._module || bingo.defaultModule(this.$getApp());
            },
            $setApp: function (app) {
                /// <summary>
                /// 设置app
                /// </summary>
                /// <param name="app"></param>
                app && (this._app = app);
                return this;
            },
            $getApp: function () {
                /// <summary>
                /// 获取App
                /// </summary>
                return this._app || (this._module ? this._module.app : bingo.defaultApp());
            },
            $addAction: function (action) {
                /// <summary>
                /// 添加action<br />
                /// $addAction(function($node){ });
                /// </summary>
                /// <param name="action"></param>
                return this;
            },
            $getViewnode: function (node) {
                /// <summary>
                /// 取得view
                /// </summary>
                /// <param name="node">可选, 要原型node</param>
                return this.$viewnode();
            },
            $getNode: function (jqSelector) {
                /// <summary>
                /// 查询本view里所有dom node, 返回jquery对象
                /// </summary>
                /// <param name="jqSelector">可选， 默认取得view所在的dom node</param>
                return $([]);
            },
            //如果准备好了?
            $isReady: true,
            $update: function () {
                /// <summary>
                /// 同步数据
                /// </summary>
                return this.$publish();
            },
            $updateAsync: function () {
                /// <summary>
                /// 同步数据, 异步
                /// </summary>
                return this;
            },
            $apply: function (callback, thisArg) {
                /// <summary>
                /// 执行callback, 并自己同步数据
                /// </summary>
                /// <param name="callback" type="function()"></param>
                /// <param name="thisArg">可选， 设置this对象， 默认view</param>
                if (callback) {
                    callback.apply(thisArg || this);
                }
                return this;
            },
            $proxy: function (callback, thisArg) {
                /// <summary>
                /// 定义callback, 并自己同步数据
                /// </summary>
                /// <param name="callback" type="function()"></param>
                /// <param name="thisArg">可选， 设置this对象， 默认view</param>
                var $view = this;
                return function () {
                    callback.apply(thisArg || this, arguments);
                };
            },
            $publish: function () {
                /// <summary>
                /// 向订阅发布信息
                /// </summary>
                return this;
            },
            $observer: function () {
                /// <summary>
                /// 取得本view的观察者
                /// </summary>
                return bingo.observer(this);
            },
            $subscribe: function (p, callback, deep, disposer, priority) {
                /// <summary>
                /// 订阅
                /// </summary>
                /// <param name="p">可以view的属性名称， 或function(){ return $view.datas; }</param>
                /// <param name="callback" type="function(value)"></param>
                /// <param name="deep">可选， 是否深比较， 默认false</param>
                /// <param name="disposer">释放者， 如果此对象已释放， 订阅自动删除</param>
                /// <param name="priority">优先级, 越大越前, 默认50</param>
                return this.$observer().subscribe(p, callback, deep, disposer, priority);
            },
            $subs: function (p, callback, deep, disposer, priority) {
                /// <summary>
                /// 订阅
                /// </summary>
                /// <param name="p">可以view的属性名称， 或function(){ return $view.datas; }</param>
                /// <param name="callback" type="function(value)"></param>
                /// <param name="deep">可选， 是否深比较， 默认false</param>
                /// <param name="disposer">释放者， 如果此对象已释放， 订阅自动删除</param>
                /// <param name="priority">优先级, 越大越前, 默认50</param>
                return this.$subscribe.apply(this, arguments);
            },
            $using: function (js, callback) {
                /// <summary>
                /// $using异步加载JS， 有同步view启动作用, ready之后， 没有作用
                /// </summary>
                /// <param name="js"></param>
                /// <param name="callback"></param>
                bingo.using(js, function () {
                    callback && callback();
                });
                return this;
            },
            $timeout: function (callback, time) {
                return setTimeout(function () {
                     callback && callback();
                }, time || 1);
            }
        });

        this.Prop({
            $parentView: null,
            //view必须只对应一个node
            $node: null,
            //只有一个viewnode
            $viewnode:null
        });

        this.Initialization(function (node, parentView) {
            this.base();

            this.$children = [];

            this.$node(node).$parentView(parentView);
            this.$viewnode(_viewnodeClass.NewObject());

        });
    });

    //viewnode==管理与node节点连接====================
    var _viewnodeClass = bingo.view.viewnodeClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Static({
            vnName: ['bg_cpl_node', bingo.makeAutoId()].join('_'),
            vnDataName: ['bg_domnode', bingo.makeAutoId()].join('_'),
            //向node及node的父层搜索viewnode, node必须原生node
            getViewnode: function (node) {
                /// <summary>
                /// 向node及node的父层搜索viewnode, node必须原生node
                /// </summary>
                /// <param name="node">必须原生node</param>
                return _viewnode;
            },
            setViewnode: function (node, viewnode) {
                /// <summary>
                /// 向node, 缓存viewnode
                /// </summary>
                /// <param name="node">必须原生node</param>
                /// <param name="viewnode"></param>
            },
            removeViewnode: function (viewnode) {
                /// <summary>
                /// 向node, 删除缓存viewnode
                /// </summary>
                /// <param name="viewnode"></param>
            },
            isViewnode: function (node) {
                /// <summary>
                /// 是否viewnode节点
                /// </summary>
                /// <param name="node">必须原生node</param>
            }
        });

        this.Define({
            $getAttr: function (name) {
                return _viewnodeAttr;
            },
            $html: function (html) {
                if (arguments.length > 0) {
                    return this;
                } else
                    return 'aaaa';
            },
            getWithData: function () {
                /// <summary>
                /// withData只在编译时能设置, 之后不能变动
                /// </summary>
                return this._withData;
            }
        });

        this.Prop({
            view: null,
            node: null,
            parentViewnode: null
        });

        this.Initialization(function (view, node, parentViewnode, withData) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="view">_viewClass</param>
            /// <param name="node">dom element</param>
            /// <param name="parentViewnode">父节点_viewnodeClass</param>
            /// <param name="withData">withData</param>
            this.base();

            this.attrList = [];
            this.textList = [];
            this.children = [];

            this._withData = withData || (parentViewnode && parentViewnode.getWithData());

            parentViewnode && parentViewnode.children.push(this);

            this.view(view).node(node).parentViewnode(parentViewnode);

        });
    });

    //viewnode attr====管理与指令连接================
    var _viewnodeAttrClass = bingo.view.viewnodeAttrClass = bingo.Class(bingo.compile.bindClass, function () {

        this.Define({
            onChange: function (callback) {
                /// <summary>
                /// 改变时事件
                /// </summary>
                /// <param name="callback" type="function(value)"></param>
                return this.on('onChange', callback);
            },
            onInit: function (callback) {
                /// <summary>
                /// 初始时事件
                /// </summary>
                /// <param name="callback" type="function(value)"></param>
                return this.on('onInit', callback);
            },
            $subs: function (p, p1, deep) {
                /// <summary>
                /// 观察执行结果
                /// </summary>
                /// <param name="p">可以属性名称或function(){ return datas; }</param>
                /// <param name="p1" type="function(value)">观察到变动时处理, function(value){}</param>
                /// <param name="deep">是否深比较</param>
                return this;
            },
            $subsResults: function (p, deep) {
                /// <summary>
                /// 观察执行结果
                /// </summary>
                /// <param name="p" type="function(value)">观察到变动时处理, function(value){}</param>
                /// <param name="deep">是否深比较</param>
            },
            $subsValue: function (p, deep) {
                /// <summary>
                /// 观察值
                /// </summary>
                /// <param name="p" type="function(value)">观察到变动时处理, function(value){}</param>
                /// <param name="deep">是否深比较</param>
                return this;
            },
            $init: function (p, p1) {
                /// <summary>
                /// 根据p执行结果, 做初始化
                /// </summary>
                /// <param name="p">可以属性名称或function(){ return datas; }</param>
                /// <param name="p1" type="function(value)">初始化, function(value){}</param>
                return this;
            },
            $initResults: function (p) {
                /// <summary>
                /// 根据执行结果
                /// </summary>
                /// <param name="p" type="function(value)">初始化, function(value){}</param>
                return this.$init(bingo.proxy(this, function () {
                    return this.$results()
                }), p);
            },
            $initValue: function (p) {
                /// <summary>
                /// 根据值
                /// </summary>
                /// <param name="p" type="function(value)">初始化, function(value){}</param>
                return this.$init(bingo.proxy(this, function () {
                    return this.$value()
                }), p);
            }
        });

        this.Initialization(function (view, viewnode, type, attrName, attrValue, command) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="viewnode">属性名称</param>
            /// <param name="attrName">属性名称</param>
            /// <param name="attrValue">属性名称</param>
            /// <param name="command">指令定义</param>

            //认为viewnode widthData只在编译时设置
            this.base(view, viewnode.node(), attrValue, viewnode.getWithData());

            this.viewnode(viewnode);

            this.type = type;
            this.attrName = attrName.toLowerCase();

            this.command = command;

        });
    });

    var _isRmTxNode = function (node) {
        return !node || !node.parentNode
                    || !node.parentNode.parentNode
                    || !node.parentNode.parentElement;;
    };
    //标签==========================
    var _textTagClass = bingo.view.textTagClass = bingo.Class(function () {


        this.Static({
            _regex: /\{\{([^}]+?)\}\}/gi,
            _regexRead: /^\s*:\s*/,
            hasTag: function (text) {
                this._regex.lastIndex = 0;
                return this._regex.test(text);
            }
        });

        this.Define({
            getWithData: function () {
                return this._withData;
            }
        });

        this.Prop({
            view: null,
            node: null,//为text node
            viewnode:null
        });

        this.Initialization(function (view, viewnode, node, attrName, attrValue, withData) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="viewnode">属性名称</param>
            /// <param name="attrName">属性名称</param>
            /// <param name="attrValue">属性名称</param>
            /// <param name="command">指令定义</param>
            //console.log('textTag', node.nodeType);

            this._withData = withData || (viewnode.getWithData());

            this.view(view).viewnode(viewnode).node(node);


            this.attrName = attrName && attrName.toLowerCase();
            this.attrValue = attrValue;

        });
    });

    var _pView = _viewClass.NewObject(document.body, _viewClass.NewObject(document.body, null));
    var _view = _viewClass.NewObject(document.body, _pView);
    var _cView = _viewClass.NewObject(document.body, _view);
    _view.$children.push(_cView);

    var _pViewnode = _viewnodeClass.NewObject(_view, _view.$node, null, {});
    var _viewnode = _viewnodeClass.NewObject(_view, _view.$node, _pViewnode, {});
    var _cViewnode = _viewnodeClass.NewObject(_view, _view.$node, _viewnode, {});
    _pView.$viewnode(_pViewnode);
    _view.$viewnode(_viewnode);
    _cView.$viewnode(_cViewnode);

    var _viewnodeAttr = _viewnodeAttrClass.NewObject(_view, _viewnode, 3, 'aaaa', '1111', bingo.command('aaaa'));

    _pViewnode.attrList.push(_viewnodeAttr);
    _viewnode.attrList.push(_viewnodeAttr);
    _cViewnode.attrList.push(_viewnodeAttr);

    var _textTag = _textTagClass.NewObject(_view, _viewnode, _view.$node(), 'aaaa', '1111', {});
    _pViewnode.textList.push(_textTag);
    _viewnode.textList.push(_textTag);
    _cViewnode.textList.push(_textTag);

})(bingo);
