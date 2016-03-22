
(function (bingo, $) {
    //version 1.1.0
    "use strict";

    bingo.extend({
        compile: function (view) {
            return _compileClass.NewObject().view(view);
        },
        tmpl: function (url, view) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="url"></param>
            /// <param name="view">可选</param>
            return _tmplClass.NewObject(url).view(view);
        },
        _startMvc: function () {

            //等待动态加载js完成后开始
            bingo.using(function () {
                var view = bingo.rootView(), node = view.$node();
                view.onReadyAll(function () {
                    bingo.__readyE.end();
                });
                bingo.compile(view).fromNode(node).compile();
            }, bingo.usingPriority.NormalAfter);
        },
        __readyE:bingo.Event(),
        ready: function (fn) {
            this.__readyE.on(fn);
        }
    });

    var _injectTmplWithDataIndex = bingo.compile.injectTmplWithDataIndex = function (html, index, pIndex) {
        /// <summary>
        /// 注入withDataList html
        /// </summary>
        return ['<!--bingo_cmpwith_', index, '-->', html, '<!--bingo_cmpwith_', pIndex, '-->'].join('');
    };

    bingo.compile.getNodeContentTmpl = function (jqSelector) {
        var $node = $(jqSelector), html = '';
        var jChild = $node.children();
        if (jChild.size() === 1 && jChild.is('script'))
            html = jChild.html();
        else
            html = $node.html();
        return html;
    };

    var _removeJo = null, _removeNode = bingo.compile.removeNode = function (jqSelector) {
        _removeJo.append(jqSelector);
        _removeJo.html('');
    };

    var _compiles = {
        compiledAttrName: ['_bg_cpl', bingo.makeAutoId()].join('_'),
        isCompileNode: function (node) {
            return node[this.compiledAttrName] == "1";
        },
        setCompileNode: function (node) {
            node[this.compiledAttrName] = "1";
        },
        _makeCommand: function (command, view, node, as) {
            
            var opt = command;

            if (!bingo.isNullEmpty(opt.tmplUrl)) {
                bingo.tmpl(opt.tmplUrl, view).cacheQurey(true).async(false).success(function (tmpl) { opt.tmpl = tmpl; }).get();
            }

            if (opt.compilePre)
                bingo.factory(opt.compilePre).view(view).node(node).inject();

            if (opt.as) {
                var alist = bingo.factory(opt.as).view(view).node(node).inject();
                if (alist && alist.length > 0)
                    as.list = (as.list || []).concat(alist);
            }

            return opt;
        },
        newTraverseParams: function () {
            //参数可以向下级传参数, 同级要备份
            return { node: null, parentViewnode: null, view: null, data: null, withData:null, action:null, withDataList:null };
        },
        //hasAttr: function (node, attrName) { return node.hasAttribute ? node.hasAttribute(attrName) : !bingo.isNullEmpty(node.getAttribute(attrName)); },
        traverseNodes: function (p) {
            /// <summary>
            /// 遍历node
            /// </summary>
            /// <param name="p" value='_compiles.newTraverseParams()'></param>
            
            //元素element 1
            //属性attr 2
            //文本text 3
            //注释comments 8
            //文档document 9

            var node = p.node;
            if (node.nodeType === 1) {

                if (!this.isCompileNode(node)) {
                    this.setCompileNode(node);

                    //解析节点， 如果不编译下级, 退出
                    if (!this.analyzeNode(node, p)) return;

                }
                var next = node.firstChild;
                if (next) {
                    var childNodes = [];
                    do {
                        childNodes.push(next);
                    } while (next = next.nextSibling);
                    this.traverseChildrenNodes(childNodes, p);
                }

            } else if (node.nodeType === 3) {

                if (!p.parentViewnode._isCompileText(node)) {
                    var _viewST = bingo.view;
                    p.parentViewnode._setCompileText(node);
                    
                    //收集textNode
                    var text = node.nodeValue;
                    if (_viewST.textTagClass.hasTag(text)) {
                        _viewST.textTagClass.NewObject(p.view, p.parentViewnode, node, node.nodeName, text, p.withData);
                    }
                }
            }
            node = p = null;
        },
        traverseChildrenNodes: function (nodes, p) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="nodes"></param>
            /// <param name="p" value="_compiles.newTraverseParams()"></param>
            /// <param name="withDataList"></param>

            var injectTmplWithList = [], commentList =[],
                withDataList = p.withDataList,
                withData = p.withData;

            var node, pBak = bingo.clone(p, false, true);
            var tmplIndex = -1;
            for (var i = 0, len = nodes.length; i < len; i++) {
                node = nodes[i];
                if (this.isComment(node)) {
                    //console.log('comment', node);
                    commentList.push(node);
                } else {
                    tmplIndex = withDataList ? this.getTmplWithdataIndex(node) : -1;
                    //tmplIndex > 0 && console.log('tmplIndex', tmplIndex);
                    if (tmplIndex == -1) {
                        //如果没有找到injectTmplWithDataIndex的index, 按正常处理
                        if (node.nodeType === 1 || node.nodeType === 3) {
                            p.node = node, p.withData = withData;
                            this.traverseNodes(p);
                            p = bingo.clone(pBak, false, true);
                        }
                    } else {
                        //如果找到injectTmplWithDataIndex的index, 取得index值为当前值, 添加injectTmplWithDataIndex节点到list
                        withData = p.withData = withDataList[tmplIndex];
                        //console.log('p.withData', tmplIndex, p.withData);
                        injectTmplWithList.push(node);
                    }
                }
            }

            //删除injectTmplWithDataIndex注释节点
            if (commentList.length > 0 || injectTmplWithList.length > 0) {
                _removeNode(commentList.concat(injectTmplWithList));
            }
        },
        commentTest: /^\s*#/,
        isComment: function (node) {
            return node.nodeType == 8 && this.commentTest.test(node.nodeValue)
        },
        //取得注入的withDataList的index
        getTmplWithdataIndex: function (node) {
            if (node.nodeType == 8) {
                var nodeValue = node.nodeValue;
                if (!bingo.isNullEmpty(nodeValue) && nodeValue.indexOf('bingo_cmpwith_') >= 0) {
                    var index = parseInt(nodeValue.replace('bingo_cmpwith_', ''), 10);
                    return (index < 0) ? -2 : index;//-2, 0及以上

                }
            }
            return -1;//-1没有找到
        },
        isTmplWithdataNode: function (node) {
            if (node.nodeType == 8) {
                var nodeValue = node.nodeValue;
                return (!bingo.isNullEmpty(nodeValue) && nodeValue.indexOf('bingo_cmpwith_') >= 0);
            }
            return false;
        },
        checkTmplWithdataNode: function (jo) {
            //return jo;
            var list = [], wList = [];
            jo.each(function () {
                if (_compiles.isTmplWithdataNode(this))
                    wList.push(this);
                else
                    list.push(this);
            });
            if (wList.length > 0) {
                _removeNode(wList);
            }
            return $(list);
        },
        analyzeNode: function (node, p) {
            /// <summary>
            /// 分析node
            /// </summary>
            /// <param name="node" value='document.body'></param>
            /// <param name="p" value='_compiles.newTraverseParams()'></param>
            var tagName = node.tagName, command = null;
            if (bingo.isNullEmpty(tagName)) return false;
            tagName = tagName.toLowerCase();

            var moduleI = p.view.$getModule();

            command = moduleI.command(tagName);
            var attrList = [], textTagList = [], compileChild = true;
            var tmpl = null, replace = false, include = false, isNewView = false;
            var isScriptNode = (tagName == 'script');
            if (isScriptNode) compileChild = false;

            var addAttr = function (attrList, command, attrName, attrVal, attrType) {
                replace = command.replace;
                include = command.include;
                tmpl = command.tmpl;
                isNewView || (isNewView = command.view);
                (!compileChild) || (compileChild = command.compileChild);
                attrList.push({ aName: attrName, aVal: attrVal, type: attrType, command: command });
            };

            var as = {}, attrTL = [], aVal = null, aName = null;

            if (command) {
                //node
                command = _compiles._makeCommand(command, p.view, node, as);
                addAttr(attrList, command, tagName, '', 'node');
            } else {
                //attr


                //在 IE 8 以及更早的版本中，attributes 属性会返回元素所有可能属性的集合。
                var attributes = node.attributes;
                if (attributes && attributes.length > 0) {

                    var aT = null, attrL;
                    do {
                        attrL = attributes.length;
                        for (var i = 0, len = attrL; i < len; i++) {
                            aT = attributes[i];
                            aName = aT && aT.nodeName;

                            if (bingo.inArray(aName, attrTL) < 0) {
                                attrTL.push(aName);

                                aVal = aT && aT.nodeValue;
                                //如果是script节点，将type内容识别模板指令
                                if (isScriptNode && aName == 'type') {
                                    aName = aVal;
                                }
                                command = moduleI.command(aName);
                                //if (aName.indexOf('frame')>=0) console.log(aName);
                                if (command) {
                                    command = _compiles._makeCommand(command, p.view, node, as);
                                    if (command.compilePre)
                                        aVal = aT && aT.nodeValue;//compilePre有可能重写attr

                                    addAttr(attrList, command, aName, aVal, 'attr');
                                    if (replace || include) break;
                                } else if (aVal) {
                                    //是否有text标签{{text}}
                                    if (bingo.view.textTagClass.hasTag(aVal)) {
                                        textTagList.push({ node: aT, aName: aName, aVal: aVal });
                                    }
                                }
                            }
                        }
                    } while (attrL != attributes.length);
                }

            }

            if (as.list) {
                bingo.each(as.list, function () {
                    var aName = this.name;
                    if (bingo.inArray(aName, attrTL) < 0) {
                        attrTL.push(aName);
                        command = moduleI.command(aName);
                        addAttr(attrList, command, aName, this.value, 'attr');
                        if (replace || include) return false;
                    }
                });
            }



            var viewnode = null,
                _viewST = bingo.view;
            if (attrList.length > 0) {

                //替换 或 include
                if (replace || include) {
                    var jNode = $(node);
                    //replace || include, 必须有tmpl
                    if (!bingo.isNullEmpty(tmpl)) {

                        //$.parseHTML解释所有类型html包括text node
                        var jNewNode = $($.parseHTML(tmpl));

                        //如果include 将本节插入到有bg-include属性(并属性值为空)的节点里
                        //如:<div bg-include></div>
                        if (include && tmpl.indexOf('bg-include') >= 0) {
                            //将现在的node include到每个bg-include节点处
                            jNewNode.find('[bg-include]').add(jNewNode.filter('[bg-include]')).each(function () {
                                var jo = $(this);
                                //bg-include, 如果空才执行, 如果不是空会解释bg-include command
                                if (bingo.isNullEmpty(jo.attr('bg-include'))) {
                                    //将node复制一份， 这里不复制事件和相关数据
                                    //认为是临时的, 还没有事件和其它数据
                                    var jT = jNode.clone(false);
                                    _compiles.setCompileNode(jT[0]);

                                    //删除bg-include, 防止死循环
                                    jo.removeAttr('bg-include');
                                    jo.append(jT);
                                }
                            });
                        }

                        var pView = p.view, pViewnode = p.parentViewnode,
                            //备份p数据
                            pBak = bingo.clone(p, false, true);

                        jNewNode.each(function () {
                            if (this.nodeType === 1) {
                                //_compiles.setCompileNode(this);
                                //新view
                                if (isNewView) {
                                    p.view = _viewST.viewClass.NewObject(this, pView);
                                    if (p.action) {
                                        p.view.$addAction(p.action);
                                        p.action = null;
                                    }
                                    //清空p.withData
                                    p.withData = null;
                                }
                                //本节点
                                viewnode = _viewST.viewnodeClass.NewObject(p.view, this, isNewView ? null : pViewnode, p.withData);
                                //设置父节点
                                p.parentViewnode = viewnode;
                                //连接node
                                //_compiles.setViewnode(this, viewnode);

                                //只要最后一个attr
                                var attr = attrList[attrList.length - 1];
                                _viewST.viewnodeAttrClass.NewObject(p.view, viewnode, attr.type, attr.aName, attr.aVal, attr.command);
                            }
                            if (compileChild) {
                                p.node = this;
                                _compiles.traverseNodes(p);
                            }
                            p = bingo.clone(pBak, false, true);
                        }).insertBefore(jNode);
                    }
                    //删除本节点
                    //jNode.remove();
                    _removeNode(jNode);

                    //不编译子级
                    compileChild = false;
                } else {

                    if (!bingo.isNullEmpty(tmpl))
                        $(node).html(tmpl);

                    //新view
                    if (isNewView) {
                        p.view = _viewST.viewClass.NewObject(node, p.view);
                        if (p.action) {
                            p.view.$addAction(p.action);
                            p.action = null;
                        }
                        //清空p.withData
                        p.withData = null;
                    }
                    //父节点
                    var parentViewnode = p.parentViewnode;
                    //本节点
                    viewnode = _viewST.viewnodeClass.NewObject(p.view, node, isNewView ? null : parentViewnode, p.withData);
                    //设置父节点
                    p.parentViewnode = viewnode;
                    //连接node
                    //this.setViewnode(node, viewnode);

                    //处理attrList
                    var attrItem = null;
                    bingo.each(attrList, function () {
                        attrItem = _viewST.viewnodeAttrClass.NewObject(p.view, viewnode, this.type, this.aName, this.aVal, this.command);
                    });
                }
            }

            if (!(replace || include) && textTagList.length > 0) {
                var textItem = null;
                bingo.each(textTagList, function () {
                    textItem = _viewST.textTagClass.NewObject(p.view, viewnode || p.parentViewnode, this.node, this.aName, this.aVal, null, node);
                });
            }
            

            return compileChild;
            //return attrList;
        }
    };

    var _tmplClass = bingo.compile.tmplClass = bingo.Class(bingo.ajax.ajaxClass, function () {


        var _base = bingo.ajax.ajaxClass.prototype;

        var _cache = {};

        this.Define({
            _initAjax: function () {
                if (this._init_tmpl_ === true) return;
                this._init_tmpl_ = true;
                var view = this.view();
                view && !view.isDisposed && view._addReadyDep();

                this.onDispose(function () {
                    view && !view.isDisposed && view._decReadyDep();
                })
                .dataType('text');

                if (bingo.compile.tmplCacheMetas.test(this.url())) {
                    this.cacheTo(this.cacheTo() || _cache)
                    .cacheMax(this.cacheMax() <= 0 ? 350 : this.cacheMax());
                }

                this._ajaxCache(bingo.supportWorkspace);
            },
            'get': function () {
                this._initAjax();
                _base['get'].call(this);
            },
            post: function () {
                this._initAjax();
                _base['post'].call(this);
            }
        });

        this.Initialization(function (url) {
            this.base(url);
        });
    });
    bingo.compile.tmplCacheMetas = /\.(htm|html|tmpl|txt)(\?.*)*$/i;

    //模板==负责编译======================
    var _compileClass = bingo.compile.templateClass = bingo.Class(function () {

        var _traverseChildrenNodes = function (nodes, parentViewnode, view, withDataList, action) {
            //编译一组nodes.
            _compiles.traverseChildrenNodes(nodes, { node: null, parentViewnode: parentViewnode, view: view, withData: null, action: action, withDataList: withDataList });
        };

        var _cache = {};
        this.Static({
            cacheMax:100
        });

        this.Prop({
            //给下一级新的View注入action
            action: null,
            async: true,
            fromUrl: '',
            //withData作用空间, 单个时用
            withData: null,
            //作用空间， 批量时用
            withDataList: null,
            //是否停止
            stop: false,
            view:null
        });

        this.Define({
            fromJquery: function (jqSelector) {
                this._jo = $(jqSelector); return this;
            },
            appendTo: function (jqSelector) { this._parentNode = $(jqSelector)[0]; return this; },
            fromNode: function (node) { return this.fromJquery(node); },
            fromHtml: function (html) { return this.fromJquery($.parseHTML(html, true)); },// this.fromJquery(html); },
            _isEnd: function () {
                return this.isDisposed
                    || this.stop()
                    || (this.view() && this.view().isDisposed);
            },
            //编译前执行， function
            onCompilePre: function (callback) {
                return this.on('compilePre', callback);
            },
            //编译前执行， function
            onCompiled: function (callback) {
                return this.on('compiled', callback);
            },
            _compile: function () {
                var jo = this._jo;
                var parentNode = this._parentNode || (jo && jo.parent()[0]);
                if (!parentNode) return;

                //如果没有传parentNode认为是已经在document树里
                var isInDoc = !this._parentNode;

                try {
                    this.trigger('compilePre', [jo]);

                    var view = this.view(),
                        parentViewnode = bingo.view.viewnodeClass.getViewnode(parentNode);

                    if (view) {
                        //检查parentViewnode, view不等于parentViewnode.view
                        //node上下关系并不与viewnode上下关系对应
                        if (parentViewnode.view() != view)
                            parentViewnode = view.$viewnode();

                    } else {
                        //检查view, 如果没有view, view取parentViewnode.view
                        view = bingo.view(parentNode) || parentViewnode.view();
                    }

                    //初始withData
                    var withData = this.withData();
                    var withDataList = this.withDataList();
                    var action = this.action();


                    //var timeId = bingo.makeAutoId();
                    //console.time(timeId);
                    _traverseChildrenNodes(jo, parentViewnode, view, withDataList, action);
                    //console.timeEnd(timeId);

                    ////删除TmplWithdataNode
                    //withDataList && withDataList.length > 0 && (jo = _compiles.checkTmplWithdataNode(jo));
                    //if (!isInDoc) {
                    //    jo.appendTo(parentNode);
                    //}

                    //删除TmplWithdataNode
                    withDataList && withDataList.length > 0 && (jo = _compiles.checkTmplWithdataNode(jo));
                    if (!isInDoc) {
                        jo.appendTo(parentNode);
                    }

                    //处理
                    view._handel();
                } catch (e) {
                    bingo.trace(e);
                }
                this.trigger('compiled', [jo]);
                this.dispose();
            },
            compile: function () {
                if (this._isEnd()) return this;

                if (this._jo) {

                    this._compile();

                } else if (this._parentNode && this.fromUrl()) {
                    //以url方式加载, 必须先指parentNode;
                    var $this = this;
                    var view = this.view();
                    //view && !view.isDisposed && view._addReadyDep();
                    bingo.tmpl(this.fromUrl(), view).success(function (html) {
                        if ($this._isEnd()) { return; }
                        $this.fromHtml(html).compile();
                    }).async(this.async()).onDispose(function () {
                        $this.dispose();
                        //view && !view.isDisposed && view._decReadyDep();
                    }).get();
                }
                return this;
            }
        });

    });

    //绑定内容解释器==========================
    var _bindClass = bingo.compile.bindClass = bingo.Class(function () {

        var _priS = {
            _cacheName: '__contextFun__',
            resetContextFun: function (attr) {
                attr[_priS._cacheName] = {};
            },
            evalScriptContextFun: function (attr, hasReturn, view, node, withData) {
                hasReturn = (hasReturn !== false);

                var cacheName = ['content', hasReturn].join('_');
                var contextCache = attr[_priS._cacheName];
                if (contextCache[cacheName]) return contextCache[cacheName];

                var attrValue = attr.$attrValue();
                try {
                    var retScript = [hasReturn ? 'return ' : '', attrValue, ';'].join('');
                    return contextCache[cacheName] = (new Function('$view', 'node', '$withData', 'bingo', [
                        'with ($view) {',
                            //如果有withData, 影响性能
                            withData ? 'with ($withData) {' : '',
                                //this为$node
                                'return bingo.proxy(node, function (event) {',
                                    //如果有返回值, 启动try..catch, 影响性能
                                    hasReturn ? [
                                    'try {',
                                        retScript,
                                    '} catch (e) {',
                                        'if (bingo.isDebug) bingo.trace(e);',
                                    '}'].join('') : retScript,
                                '});',
                            withData ? '}' : '',
                        '}'].join('')))(view, node, withData, bingo);//bingo(多版本共存)
                } catch (e) {
                    console.warn(['evalScriptContextFun: ', retScript].join(''));
                    bingo.trace(e);
                    return attr[cacheName] = function () { return attrValue; };
                }
            }
        };


        //viewnode, viewnodeAttr
        this.Prop({
            view: null,
            node: null,
            viewnode:null,
            //设置为字串： _filter('region.id | eq:1')
            //获取为$filter对象
            _filter: {
                $get: function () {
                    var value = this.value;
                    if (!bingo.isNullEmpty(value)) {
                        this.value = '';
                        var owner = this.owner;
                        this.filter = bingo.filter.createFilter(value,
                            owner.view(),
                            owner.node(),
                            owner.getWithData());
                    }
                    return this.filter;
                }
            },
            //属性原值
            $attrValue: {
                $get: function () {
                    var ft = this.owner._filter();
                    return ft ? ft.content : this.value;
                },
                $set: function (value) {
                    if (this.value != value) {
                        this.value = value;
                        var owner = this.owner;
                        owner._filter(value);
                        _priS.resetContextFun(owner);
                    }
                }
            }
        });

        this.Define({
            $eval: function (event) {
                /// <summary>
                /// 执行内容, 根据执行返回结果, 会报出错误
                /// </summary>
                /// <param name="event">可选, 事件</param>
                var withData = this.getWithData();
                var fn = _priS.evalScriptContextFun(this, false, this.view(), this.node(), withData);
                return fn(event);
            },
            $resultsNoFilter: function (event) {
                /// <summary>
                /// 执行内容, 一定会返回结果, 不会报出错误, 没有经过过滤器
                /// </summary>
                /// <param name="event">可选, 事件</param>
                var withData = this.getWithData();
                var fn = _priS.evalScriptContextFun(this, true, this.view(), this.node(), withData);
                return fn(event);
            },
            $results: function (event) {
                /// <summary>
                /// 执行内容, 一定会返回结果, 不会报出错误
                /// </summary>
                /// <param name="event">可选, 事件</param>
               
                var res = this.$resultsNoFilter(event);
                return this.$filter(res);
            },
            $getValNoFilter: function () {
                var name = this.$attrValue();
                var tname = name, tobj = this.getWithData();
                var val;
                if (tobj) {
                    val = bingo.datavalue(tobj, tname);
                }
                if (bingo.isUndefined(val)) {
                    tobj = this.view();
                    val = bingo.datavalue(tobj, tname);
                }
                if (bingo.isUndefined(val)) {
                    tobj = window;
                    val = bingo.datavalue(tobj, tname);
                }
                return val;
            },
            //返回withData/$view/window属性值
            $value: function (value) {
                var name = this.$attrValue();
                var tname = name, tobj = this.getWithData();
                var val;
                if (tobj) {
                    val = bingo.datavalue(tobj, tname);
                }
                if (bingo.isUndefined(val)) {
                    tobj = this.view();
                    val = bingo.datavalue(tobj, tname);
                }
                if (bingo.isUndefined(val)) {
                    tobj = window;
                    val = bingo.datavalue(tobj, tname);
                }

                if (arguments.length > 0) {
                    if (bingo.isVariable(val))
                        val(value);
                    else if (bingo.isUndefined(val))
                        bingo.datavalue(this.getWithData() || this.view(), tname, value);
                    else
                        bingo.datavalue(tobj, tname, value);
                    return this;
                } else {
                    return this.$filter(val);
                }

            },
            $filter: function (val) {
                var ft = this._filter();
                return ft ? ft.filter(val) : val;
            },
            getWithData: function () {
                /// <summary>
                /// withData只在编译时能设置, 之后不能变动<br />
                /// 只有一个withData, 如果要多层， 请用{item:{}, item2:{}}这种方式
                /// </summary>
                return this._withData;
            }
        });

        this.Initialization(function (view, node, content, withData) {
            /// <param name="view"></param>
            /// <param name="node"></param>
            /// <param name="content"></param>
            /// <param name="withData">可选</param>

            this._withData = withData;
            this.view(view).node(node);
            this.content = content;
            this.$attrValue(content);

        });
    });

    bingo.compile.bind = function (view, node, content, withData) {
        return _bindClass.NewObject(view, node, content, withData);
    };


    //node绑定内容解释器==========================
    var _nodeBindClass = bingo.compile.nodeBindClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Define({
            $getAttr: function (name) {
                if (!bingo.hasOwnProp(this._attrs, name)) {
                    var attrTemp = this.node().attributes[name];
                    attrTemp = attrTemp ? attrTemp.nodeValue : '';
                    this._attrs[name] = !bingo.isNullEmpty(attrTemp)
                        ? _bindClass.NewObject(this.view(), this.node(), attrTemp, this.withData())
                        : null;
                }
                return this._attrs[name];
            },
            $attrValue: function (name, p) {
                if (arguments.length == 1) {
                    var attr = this.node().attributes[name];
                    return attr ? this.$getAttr(name).$attrValue() : '';
                } else {
                    var attr = this.$getAttr(name);
                    attr && attr.$attrValue(p);
                    return this;
                }
            },
            //执行内容, 不会报出错误
            $eval: function (name, event) {
                var attr = this.$getAttr(name);
                return attr && attr.$eval(event);
            },
            //执行内容, 并返回结果, 不会报出错误
            $results: function (name, event) {
                var attr = this.$getAttr(name);
                return attr && attr.$results(event);
            },
            //返回withData/$view/window属性值
            $value: function (name, value) {
                var attr = this.$getAttr(name);
                if (!attr) return;
                if (arguments.length == 1)
                    return attr.$value();
                else {
                    attr.$value(value);
                    return this;
                }
            }
        });

        this.Prop({
            view: null,
            node: null,
            withData:null
        });

        this.Initialization(function (view, node, withData) {
            /// <param name="view"></param>
            /// <param name="node"></param>
            /// <param name="withData可选</param>
            this.base();
            this.withData(withData).view(view).node(node);
            this.linkToDom(node);

            this._attrs = {};
            this.onDispose(function () {
                var attrs = this._attrs;
                bingo.eachProp(attrs, function (item, n) {
                    item.dispose && item.dispose();
                });
            });
        });
    });

    bingo.compile.bindNode = function (view, node, withData) {
        return _nodeBindClass.NewObject(view, node, withData);
    };

    //启动
    $(function () {
        _removeJo = $('<div></div>');
        bingo._startMvc();
    });
})(bingo, window.jQuery);
