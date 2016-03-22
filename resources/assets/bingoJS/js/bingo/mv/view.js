
(function (bingo) {
    //version 1.1.0
    "use strict";

    bingo.view = function (jqSelector) {
        /// <summary>
        /// 获取view
        /// </summary>
        /// <param name="jqSelector"></param>
        var jo = $(jqSelector);
        if (jo.size() == 0)
            return null;
        else {
            var viewnode = _viewnodeClass.getViewnode(jo[0]);
            return viewnode ? viewnode.view() : null;
        }
    };

    var _rootView = null;
    bingo.rootView = function () { return _rootView; };

    //view==提供视图==================
    var _viewClass = bingo.view.viewClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Define({
            _setParent: function (view) {
                if (view) {
                    this.$parentView(view);
                    view._addChild(this);
                }
            },
            _addChild: function (view) {
                this.$children.push(view);
            },
            _removeChild: function (view) {
                var list = this.$children;
                list = bingo.removeArrayItem(view, list);
                this.$children = list;
            },
            _compile: function () {
                var viewnode = this.$viewnode();
                if (!viewnode.isDisposed)
                    viewnode._compile();
            },
            _action: function () {
                var $this = this;
                if (this._actions.length > 0) {
                    this.end('_actionBefore_');
                    var actionList = this._actions;
                    this._actions = [];

                    bingo.each(actionList, function () {
                        bingo.factory(this).view($this).inject();
                    });
                }

                var viewnode = this.$viewnode();
                if (!viewnode.isDisposed)
                    viewnode._action();

               
                if (!this.isDisposed && this._isReadyDec_ !== true) {
                    this._isReadyDec_ = true;
                    setTimeout(function () { $this._decReadyDep(); }, 10);
                }

            },
            _link: function () {
                var viewnode = this.$viewnode();
                if (!viewnode.isDisposed)
                    viewnode._link();
            },
            _handel: function () {

                this._action();//根据action做初始
                this._compile();//编译指令
                this._link();//连接指令

                this._handleChild();//处理子级
            },
            _handleChild: function () {
                bingo.each(this.$children, function () {
                    if (!this.isDisposed) {
                        this._handel();
                    }
                });
            },
            $isReady: false,
            _sendReady: function () {
                this._sendReady = bingo.noop;
                var $this = this;
                bingo.ajaxSyncAll(function () {

                    $this.end('_initdatasrv_');

                }, this).alway(function () {
                    bingo.ajaxSyncAll(function () {
                        $this.end('_initdata_');
                    }, $this).alway(function () {
                        //所有$axaj加载成功
                        $this.end('_ready_');
                        $this.$isReady = true;
                        $this._decReadyParentDep();
                        $this.$update();
                    });
                });

            },
            onActionBefore: function (callback) {
                return this.on('_actionBefore_', callback);
            },
            onInitDataSrv: function (callback) {
                return this.on('_initdatasrv_', callback);
            },
            onInitData: function (callback) {
                return this.on('_initdata_', callback);
            },
            onReady: function (callback) {
                return this.on('_ready_', callback);
            },
            //处理readyAll
            onReadyAll: function (callback) {
                return this.on('_readyAll_', callback);
            },
            _addReadyDep: function () {
                var readySync = this.__readySync;
                if (!readySync) {
                    readySync = this.__readySync = bingo.ajaxSync(this).success(bingo.proxy(this, function () {
                        if (this.isDisposed) return;
                        this._sendReady();
                    }));
                }
                !readySync.isDisposed && readySync.addCount();
                return this;
            },
            _decReadyDep: function () {
                var readySync = this.__readySync;
                readySync && !readySync.isDisposed && readySync.decCount();
                return this;
            },
            _addReadyParentDep: function () {
                var sync = this.__readyParentSync;
                if (!sync) {
                    sync = this.__readyParentSync = bingo.ajaxSync(this).success(bingo.proxy(this, function () {
                        if (this.isDisposed) return;
                        this.end('_readyAll_');
                        var parentView = this.$parentView();
                        parentView && parentView.disposeStatus == 0 && parentView._decReadyParentDep();
                    }));
                }
                !sync.isDisposed && sync.addCount();
                return this;
            },
            _decReadyParentDep: function () {
                var sync = this.__readyParentSync;
                sync && !sync.isDisposed && sync.decCount();
                return this;
            },
            //end--处理readyAll

            //设置module_app
            $setModule: function (module) {
                module && (this._module = module);
                return this;
            },
            $getModule: function () {
                return this._module || bingo.defaultModule(this.$getApp());
            },
            $setApp: function (app) {
                app && (this._app = app);
                return this;
            },
            $getApp: function () {
                return this._app || (this._module ? this._module.app : bingo.defaultApp());
            },
            $addAction: function (action) {
                action && this._actions.push(action);
                return this;
            },
            $getViewnode: function (node) {
                //node可选, 要原型node
                return _viewnodeClass.getViewnode(node || this.$node());
            },
            $getNode: function (jqSelector) {
                var jo = this.__$node || (this.__$node = $(this.$node()));
                return jqSelector ?  jo.find(jqSelector) : jo;
            },
            $update: function () { return this.$publish(); },
            $updateAsync: function () {
                if (this.$isReady === true) {
                    this.$observer().publishAsync();
                }
                return this;
            },
            $apply: function (callback, thisArg) {
                if (callback) {
                    this.$update();
                    callback.apply(thisArg || this);
                    this.$updateAsync();
                }
                return this;
            },
            $proxy: function (callback, thisArg) {
                var $view = this;
                return function () {
                    $view.$update();
                    callback.apply(thisArg || this, arguments);
                    $view.$updateAsync();
                };
            },
            $publish: function () {
                if (this.$isReady) {
                    this.$observer().publish();
                }
                return this;
            },
            $observer: function () {
                return bingo.observer(this);
            },
            $subscribe: function (p, callback, deep, disposer, priority) {
                return this.$observer().subscribe(p, callback, deep, disposer, priority);
            },
            $subs: function (p, callback, deep, disposer, priority) {
                return this.$subscribe.apply(this, arguments);
            },
            $using: function (js, callback) {
                this._addReadyDep();
                var $this = this;
                bingo.using(js, function () {
                    if ($this.isDisposed) return;
                    callback && callback();
                    $this._decReadyDep();
                }, bingo.usingPriority.NormalAfter);
                return this;
            },
            $timeout: function (callback, time) {
                this._addReadyDep();
                var $this = this;
                return setTimeout(function () {
                    if (!$this.isDisposed) {
                        callback && callback();
                        $this.$updateAsync()._decReadyDep();
                    }
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
            this.linkToDom(node);

            bingo.extend(this, {
                $children: [],
                _module: null,
                _app:null,
                _actions: []
            });

            this.$node(node);
            if (parentView) {
                this._setParent(parentView);
                parentView._addReadyParentDep();
            }

            this._addReadyDep();
            this._addReadyParentDep();

            this.onDispose(function () {
                //console.log('dispose view');

                //处理父子
                var parentView = this.$parentView();
                if (parentView && parentView.disposeStatus == 0)
                    parentView._removeChild(this);

                //不是从dom删除
                if (!this.isDisposeFormDom) {
                    if (!this.$viewnode().isDisposed)
                        this.$viewnode().dispose();

                    bingo.each(this.$children, function (item) {
                        if (item) item.dispose();
                    });
                }

            });

        });
    });

    //viewnode==管理与node节点连接====================
    var _viewnodeClass = bingo.view.viewnodeClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Static({
            vnName: ['bg_cpl_node', bingo.makeAutoId()].join('_'),
            vnDataName: ['bg_domnode', bingo.makeAutoId()].join('_'),
            //向node及node的父层搜索viewnode, node必须原生node
            getViewnode: function (node) {
                if (node) {
                    if (this.isViewnode(node))
                        return $(node).data(this.vnDataName);
                    return this.getViewnode(node.parentNode || document.documentElement);
                } else {
                    return null;
                }
            },
            setViewnode: function (node, viewnode) {
                node[this.vnName] = "1";
                $(node).data(this.vnDataName, viewnode);
            },
            removeViewnode: function (viewnode) {
                var node = viewnode.node;
                node[this.vnName] == "0";
                $(node).removeData(this.vnDataName);
            },
            isViewnode: function (node) {
                return node[this.vnName] == "1";
            }
        });

        this.Define({
            _setParent: function (viewnode) {
                if (viewnode) {
                    this.parentViewnode(viewnode);
                    viewnode._addChild(this);
                } else {
                    //如果没有父节点时, 添加到view
                    this.view().$viewnode(this);
                }
            },
            _addChild: function (viewnode) {
                this.children.push(viewnode);
            },
            _removeChild: function (viewnode) {
                var list = this.children;
                list = bingo.removeArrayItem(viewnode, list);
                this.children = list;
            },
            _sortAttrs: function () {
                if (this.attrList.length > 1) {
                    // 根据优先级(priority)排序， 越大越前,
                    this.attrList = bingo.linq(this.attrList).sortDesc('_priority').toArray();
                }
            },
            _compile: function () {
                if (!this._isCompiled) {
                    this._isCompiled = true;
                    this._sortAttrs();

                    bingo.each(this.attrList, function () {
                        if (!this.isDisposed) {
                            this._compile();
                        }
                    });
                }
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._compile();
                    }
                });
                this._resetCmpText();
            },
            _action: function () {
                if (!this._isAction) {
                    this._isAction = true;
                    bingo.each(this.attrList, function () {
                        if (!this.isDisposed) {
                            this._action();
                        }
                    });
                }
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._action();
                    }
                });
            },
            _link: function () {
                if (!this._isLinked) {
                    this._isLinked = true;
                    bingo.each(this.attrList, function () {
                        if (!this.isDisposed) {
                            this._link();
                        }
                    });
                }
                bingo.each(this.textList, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
            },
            $getAttr: function (name) {
                name = name.toLowerCase();
                var item = null;
                bingo.each(this.attrList, function () {
                    if (this.attrName == name) { item = this; return false; }
                });
                return item;
            },
            $html: function (html) {
                var node = this.node();
                if (arguments.length > 0) {
                    $(node).html('');
                    bingo.compile(this.view()).fromHtml(html).appendTo(node).compile();
                    return this;
                } else
                    return $(node).html();
            },
            getWithData: function () {
                /// <summary>
                /// withData只在编译时能设置, 之后不能变动
                /// </summary>
                return this._withData;
            },
            _isCompileText: function (node) {
                return node ? bingo.inArray(node, this._textNodes) >= 0 : false;
            },
            _setCompileText: function (node) {
                this._textNodes.push(node);
            },
            _rmCompileText: function (node) {
                this._textNodes = bingo.removeArrayItem(node, this._textNodes);
            },
            _resetCmpText: function () {
                this._textNodes = bingo.linq(this._textNodes)
                    .where(function () { return !_isRmTxNode(this); }).toArray();

                var rootviewnode = bingo.rootView().$viewnode();
                this != rootviewnode && rootviewnode._resetCmpText();
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
            this.linkToDom(node);
            //连接node
            _viewnodeClass.setViewnode(node, this);

            bingo.extend(this, {
                attrList: [],//command属性
                textList: [],
                children: [],
                _isCompiled: false,
                _isLinked: false,
                _isAction: false,
                _textNodes:[]
            });

            this._withData = withData || (parentViewnode && parentViewnode.getWithData());

            this.view(view).node(node)._setParent(parentViewnode);

            this.onDispose(function () {

                //不是从dom删除
                if (!this.isDisposeFormDom) {
                    _viewnodeClass.removeViewnode(this);

                    bingo.each(this.children, function (item) {
                        if (item) item.dispose();
                    });
                }

                //释放attrLst
                bingo.each(this.attrList, function (item) {
                    if (item) item.dispose();
                });

                //释放textList
                bingo.each(this.textList, function (item) {
                    if (item) item.dispose();
                });

                //处理父子
                var parentViewnode = this.parentViewnode();
                if (parentViewnode) {
                    (parentViewnode.disposeStatus == 0) && parentViewnode._removeChild(this);
                }

                this.attrList = this.children = this.textList = this._textNodes = [];
                //console.log('dispose viewnode');
            });

        });
    });

    //viewnode attr====管理与指令连接================
    var _viewnodeAttrClass = bingo.view.viewnodeAttrClass = bingo.Class(bingo.compile.bindClass, function () {

        this.Define({
            _priority: 50,
            _compile: function () {
                var command = this.command;
                var compile = command.compile;
                if (compile) {
                    bingo.factory(compile).viewnodeAttr(this).widthData(this.getWithData()).inject();
                }
            },
            _action: function () {
                var command = this.command;
                var action = command.action;
                if (action) {
                    bingo.factory(action).viewnodeAttr(this).widthData(this.getWithData()).inject();
                }
            },
            _link: function () {
                var command = this.command;
                var link = command.link;
                if (link) {
                    bingo.factory(link).viewnodeAttr(this).widthData(this.getWithData()).inject();
                }
                this._init();
            },
            onChange: function (callback) { return this.on('onChange', callback); },
            onInit: function (callback) { return this.on('onInit', callback); },
            $subs: function (p, p1, deep) {
                if (arguments.length == 1) {
                    p1 = p;
                    var $this = this;
                    p = function () { return $this.$results(); };
                }
                var fn = p1;
                var $this = this;
                p1 = function (val) { var r = fn.apply(this, arguments); $this.trigger('onChange', [val]); return r; };
                this.view().$subs(p, p1, deep, this, 100);
                return this;
            },
            $subsResults: function (p, deep) {
                var isV = false;
                return this.$subs(bingo.proxy(this, function () {
                    var res = this.$resultsNoFilter();
                    isV = bingo.isVariable(res);
                    return isV ? res : this.$filter(res);
                }), bingo.proxy(this,function (value) {
                    p && (p.call(this, isV ? this.$filter(value) : value));
                }), deep);
            },
            $subsValue: function (p, deep) {
                var isV = false;
                return this.$subs(bingo.proxy(this, function () {
                    var res = this.$getValNoFilter();
                    isV = bingo.isVariable(res);
                    return isV ? res : this.$filter(res);
                }), bingo.proxy(this, function (value) {
                    p && (p.call(this, isV ? this.$filter(value) : value));
                }), deep);
            },
            _init: function () {
                this.__isinit = true;
                var para = this.__initParam;
                if (para) {
                    var p = para.p, p1 = para.p1;
                    this.__initParam = null;
                    var val = bingo.isFunction(p) ? p.call(this) : p;
                    val = bingo.variableOf(val);
                    p1.call(this, val);
                    this.trigger('onInit', [val]);
                }
            },
            $init: function (p, p1) {
                if (arguments.length == 1) {
                    p1 = p;
                    var $this = this;
                    p = function () { return $this.$results(); };
                }
                this.__initParam = { p: p, p1: p1 };
                if (this.__isinit)
                    this._init();
                return this;
            },
            $initResults: function (p) {
                return this.$init(bingo.proxy(this, function () {
                    return this.$results();
                }), p);
            },
            $initValue: function (p) {
                return this.$init(bingo.proxy(this, function () {
                    return this.$value();
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
            viewnode.attrList.push(this);

            this.type = type;
            this.attrName = attrName.toLowerCase();

            this.command = command;
            this._priority = command.priority || 50;

        });
    });

    var _isRmTxNode = function (node) {
        try {
            return !node || !node.parentNode
                        || !node.parentNode.parentNode
                        || !node.parentNode.parentElement;
        } catch (e) { return true; }
    };
    //标签==========================
    var _textTagClass = bingo.view.textTagClass = bingo.Class(function () {

        this.Static({
            _regex: /\{\{(.+?)\}\}/gi,
            _regexRead: /^\s*:\s*/,
            hasTag: function (text) {
                this._regex.lastIndex = 0;
                return this._regex.test(text);
            }
        });

        this.Define({
            _link: function () {
                if (!this._isLinked) {
                    this._isLinked = true;

                    var nodeValue = this.attrValue;
                    var tagList = [],
                        $this = this,
                        node = this.node(),
                        nodeType = node.nodeType,
                        attrName = this.attrName,
                        view = this.view(),
                        parentNode = this.parentNode(),
                        hasSub = false;//是否要绑定(不只读)


                    var _nodes = null, _serValue = function (value) {
                        //node.nodeValue = value;
                        //return;
                        if (nodeType != 3) {
                            node.nodeValue = value;
                            //parentNode.setAttribute(attrName, value);
                        } else {
                            _removeValue();
                            _nodes = $.parseHTML(value);
                            $(_nodes).insertAfter(node);
                        }
                    }, _removeValue = function () {
                        if (_nodes) {
                            bingo.compile.removeNode(_nodes);
                        }
                        _nodes = null;
                    };

                    //解释内容, afasdf{{test | val:'sdf'}}
                    var s = nodeValue.replace(_textTagClass._regex, function (findText, textTagContain, findPos, allText) {
                        var item = {};

                        if (_textTagClass._regexRead.test(textTagContain)) {
                            textTagContain = textTagContain.replace(_textTagClass._regexRead, '');
                        } else
                            hasSub = true;

                        var context = bingo.compile.bind(view, node,
                            textTagContain, $this.getWithData());

                        item.text = findText, item.context = context;
                        tagList.push(item);

                        var value = context.$results();
                        return item.value = bingo.toStr(bingo.variableOf(value));
                    });
                    _serValue(s); s = '';

                    if (hasSub) {
                        //console.log('tagList', tagList);
                        bingo.each(tagList, function (item) {
                            var context = item.context, text = item.text;

                            //检查是否删除
                            view.$subs(function () { return $this._isRemvoe() ? bingo.makeAutoId() : context.$results(); }, function (newValue) {
                                if ($this._isRemvoe()) {
                                    $this.dispose();
                                    return;
                                }
                                item.value = bingo.toStr(newValue);
                                changeValue();
                            }, false, $this, 100);
                        });
                        var changeValue = function () {
                            var allValue = nodeValue;
                            bingo.each(tagList, function (item) {
                                var text = item.text;
                                var value = item.value;
                                allValue = allValue.replace(text, value);
                            });
                            //node.nodeValue = allValue;
                            _serValue(allValue);
                        };
                    }

                    var _dispose = function () {
                        _removeValue();
                        bingo.each(tagList, function (item) {
                            item.context && item.context.dispose();
                        });
                        tagList = null;
                    };

                    this.onDispose(function () {
                        //console.log('onDispose=====', attrName);
                        $this = _nodes = node = view = parentNode = null;
                        _dispose();
                    });

                    if (!hasSub) setTimeout(bingo.proxy(this, function () { this.dispose();}), 1);
                }
            },
            _isRemvoe: function () {
                var node = this.node && this.node();
                return  this.isDisposed || _isRmTxNode(this.parentNode() || node);
            },
            getWithData: function () {
                return this._withData;
            }
        });

        this.Prop({
            view: null,
            node: null,//为text node
            parentNode:null,//所有的节点， 属性节点时用, text节点时为空
            viewnode:null
        });

        this.Initialization(function (view, viewnode, node, attrName, attrValue, withData, parentNode) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="viewnode">属性名称</param>
            /// <param name="attrName">属性名称</param>
            /// <param name="attrValue">属性名称</param>
            /// <param name="command">指令定义</param>
            //console.log('textTag', node.nodeType);

            this._withData = withData || viewnode.getWithData();

            this.view(view).viewnode(viewnode).node(node).parentNode(parentNode);

            viewnode.textList.push(this);

            this.attrName = attrName && attrName.toLowerCase();
            this.attrValue = attrValue;
            node.nodeValue = '';
            //console.log('attrValue', attrValue);

            this.onDispose(function () {
                //var viewnode = this.viewnode();
                //console.log('dispose textTaag', viewnode.disposeStatus, viewnode.isDisposed);

                //处理text node
                if (this.node().nodeType == 3) {
                    var viewnode = this.viewnode();
                    if (viewnode && viewnode.disposeStatus == 0) {
                        viewnode.textList = bingo.removeArrayItem(this, viewnode.textList);
                        viewnode._rmCompileText(this.node());
                    }
                }
            });
        });
    });


    (function () {
        var node = document.documentElement,
        _viewST = bingo.view;

        _rootView = _viewST.viewClass.NewObject(node);

        _viewST.viewnodeClass.NewObject(_rootView, node, null, null);
    })();

})(bingo);
