/// <reference path="../lib/jasmine-1.3.1/jasmine.js" />
/// <reference path="../lib/jasmine-1.3.1/jasmine-html.js" />

var helper = {
    versionString: 'version: ' + bingo.version + ' prdtVersion: ' + bingo.prdtVersion,
    reportView: function (view) {

        var reportViewIn = function (views, list) {
            bingo.each(views, function () {
                var item = {
                    module: this._module,
                    actions: this._actions,
                    children: [],
                    viewnodes: []
                };
                list.push(item);
                reportViewnode([this.$viewnode()], item.viewnodes);
                item.viewnodes = item.viewnodes[0];
                reportViewIn(this.$children, item.children);
            });
        };
        var reportViewnode = function (viewnodes, list) {
            bingo.each(viewnodes, function () {
                var item = {
                    attrList: this.attrList,
                    textList: this.textList,
                    children: this.children,
                    withData: this.getWithData ? this.getWithData() : null,
                    isCompiled: this._isCompiled,
                    isLinked: this._isLinked,
                    isAction: this._isAction,
                    textNodes: this._textNodes
                };
                list.push(item);

                reportViewnode(this.children, item.children);
            });
        };

        var list = [];
        reportViewIn([view || bingo.rootView()], list);
        //console.log(list);
        return list;
    },
    reportViewJson: function (view) {

        var reportViewIn = function (views, list) {
            bingo.each(views, function () {
                var item = {
                    attrs: '',
                    module: bingo.isNull(this._module),
                    action: this._actions.length,
                    children: [],
                    viewnodes: []
                };
                list.push(item);
                reportViewnode([this.$viewnode()], item.viewnodes);
                item.viewnodes = item.viewnodes[0];
                item.attrs = item.viewnodes.attrs;
                reportViewIn(this.$children, item.children);
            });
        };
        var reportViewnode = function (viewnodes, list) {
            bingo.each(viewnodes, function () {
                var item = {
                    attrs: [],
                    texts: [],
                    attrList: [],
                    textList: [],
                    children: [],
                    withData: this.getWithData ? this.getWithData() : null,
                    isCompiled: this._isCompiled,
                    isLinked: this._isLinked,
                    isAction: this._isAction,
                    textNodes: this._textNodes ? this._textNodes.length : 0
                };
                list.push(item);

                item.attrList = bingo.linq(this.attrList)
                    .select(function () {
                        item.attrs.push(['[', this._priority, ']', this.attrName, '="', this.content, '"'].join(''));
                        return {
                            priority: this._priority,
                            type: this.type,
                            attrName: this.attrName,
                            content: this._content,
                            withData: this._withData,
                            prop: this.$prop()
                        };
                    }).toArray();
                item.attrs = item.attrs.join(', ');

                item.textList = bingo.linq(this.textList)
                    .select(function () {
                        item.texts.push(['[', this.node().nodeType, ']', this.attrName, '="', this.attrValue, '"'].join(''));
                        return {
                            attrName: this.attrName,
                            attrValue: this.attrValue,
                            withData: this._withData,
                            nodeType: this.node().nodeType
                        };
                    }).toArray();
                item.texts = item.texts.join(', ');

                reportViewnode(this.children, item.children);
            });
        };

        var list = [];
        reportViewIn([view || bingo.rootView()], list);
        return list;
        //console.log(JSON.stringify(list));
    }
};
