/*
 * Treeview 1.5pre - jQuery plugin to hide and show branches of a tree
 * 
 * http://bassistance.de/jquery-plugins/jquery-plugin-treeview/
 * http://docs.jquery.com/Plugins/Treeview
 *
 * Copyright (c) 2007 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.treeview.js 5759 2008-07-01 07:50:28Z joern.zaefferer $
 *
 */

;(function($) {

	// TODO rewrite as a widget, removing all the extra plugins
	$.extend($.fn, {
		swapClass: function(c1, c2) {
			var c1Elements = this.filter('.' + c1);
			this.filter('.' + c2).removeClass(c2).addClass(c1);
			c1Elements.removeClass(c1).addClass(c2);
			return this;
		},
		replaceClass: function(c1, c2) {
			return this.filter('.' + c1).removeClass(c1).addClass(c2).end();
		},
		hoverClass: function(className) {
			className = className || "hover";
			return this.hover(function() {
				$(this).addClass(className);
			}, function() {
				$(this).removeClass(className);
			});
		},
		heightToggle: function(animated, callback) {
			animated ?
				this.animate({ height: "toggle" }, animated, callback) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
					if(callback)
						callback.apply(this, arguments);
				});
		},
		heightHide: function(animated, callback) {
			if (animated) {
				this.animate({ height: "hide" }, animated, callback);
			} else {
				this.hide();
				if (callback)
					this.each(callback);				
			}
		},
		prepareBranches: function(settings) {
			if (!settings.prerendered) {
				// mark last tree items
				this.filter(":last-child:not(ul)").addClass(CLASSES.last);
				// collapse whole tree, or only those marked as closed, anyway except those marked as open
				this.filter((settings.collapsed ? "" : "." + CLASSES.closed) + ":not(." + CLASSES.open + ")").find(">ul").hide();
			}
			// return all items with sublists
			return this.filter(":has(>ul)");
		},
		applyClasses: function(settings, toggler) {
			// TODO use event delegation
			this.filter(":has(>ul):not(:has(>a))").find(">span").unbind("click.treeview").bind("click.treeview", function(event) {
				// don't handle click events on children, eg. checkboxes
				if ( this == event.target )
					toggler.apply($(this).next());
			}).add( $("a", this) ).hoverClass();
			
			if (!settings.prerendered) {
				// handle closed ones first
				this.filter(":has(>ul:hidden)")
						.addClass(CLASSES.expandable)
						.replaceClass(CLASSES.last, CLASSES.lastExpandable);
						
				// handle open ones
				this.not(":has(>ul:hidden)")
						.addClass(CLASSES.collapsable)
						.replaceClass(CLASSES.last, CLASSES.lastCollapsable);
						
	            // create hitarea if not present
				var hitarea = this.find("div." + CLASSES.hitarea);
				if (!hitarea.length)
					hitarea = this.prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea);
				hitarea.removeClass().addClass(CLASSES.hitarea).each(function() {
					var classes = "";
					$.each($(this).parent().attr("class").split(" "), function() {
						classes += this + "-hitarea ";
					});
					$(this).addClass( classes );
				})
			}
			
			// apply event to hitarea
			this.find("div." + CLASSES.hitarea).click( toggler );
		},
		treeview: function(settings) {
			
			settings = $.extend({
				cookieId: "treeview"
			}, settings);
			
			if ( settings.toggle ) {
				var callback = settings.toggle;
				settings.toggle = function() {
					return callback.apply($(this).parent()[0], arguments);
				};
			}
		
			// factory for treecontroller
			function treeController(tree, control) {
				// factory for click handlers
				function handler(filter) {
					return function() {
						// reuse toggle event handler, applying the elements to toggle
						// start searching for all hitareas
						toggler.apply( $("div." + CLASSES.hitarea, tree).filter(function() {
							// for plain toggle, no filter is provided, otherwise we need to check the parent element
							return filter ? $(this).parent("." + filter).length : true;
						}) );
						return false;
					};
				}
				// click on first element to collapse tree
				$("a:eq(0)", control).click( handler(CLASSES.collapsable) );
				// click on second to expand tree
				$("a:eq(1)", control).click( handler(CLASSES.expandable) );
				// click on third to toggle tree
				$("a:eq(2)", control).click( handler() ); 
			}
		
			// handle toggle event
			function toggler() {
				$(this)
					.parent()
					// swap classes for hitarea
					.find(">.hitarea")
						.swapClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
						.swapClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea )
					.end()
					// swap classes for parent li
					.swapClass( CLASSES.collapsable, CLASSES.expandable )
					.swapClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
					// find child lists
					.find( ">ul" )
					// toggle them
					.heightToggle( settings.animated, settings.toggle );
				if ( settings.unique ) {
					$(this).parent()
						.siblings()
						// swap classes for hitarea
						.find(">.hitarea")
							.replaceClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
							.replaceClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea )
						.end()
						.replaceClass( CLASSES.collapsable, CLASSES.expandable )
						.replaceClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
						.find( ">ul" )
						.heightHide( settings.animated, settings.toggle );
				}
			}
			this.data("toggler", toggler);
			
			function serialize() {
				function binary(arg) {
					return arg ? 1 : 0;
				}
				var data = [];
				branches.each(function(i, e) {
					data[i] = $(e).is(":has(>ul:visible)") ? 1 : 0;
				});
				$.cookie(settings.cookieId, data.join(""), settings.cookieOptions );
			}
			
			function deserialize() {
				var stored = $.cookie(settings.cookieId);
				if ( stored ) {
					var data = stored.split("");
					branches.each(function(i, e) {
						$(e).find(">ul")[ parseInt(data[i]) ? "show" : "hide" ]();
					});
				}
			}
			
			// add treeview class to activate styles
			this.addClass("treeview");
			
			// prepare branches and find all tree items with child lists
			var branches = this.find("li").prepareBranches(settings);
			
			switch(settings.persist) {
			case "cookie":
				var toggleCallback = settings.toggle;
				settings.toggle = function() {
					serialize();
					if (toggleCallback) {
						toggleCallback.apply(this, arguments);
					}
				};
				deserialize();
				break;
			case "location":
				var current = this.find("a").filter(function() {
					return this.href.toLowerCase() == location.href.toLowerCase();
				});
				if ( current.length ) {
					// TODO update the open/closed classes
					var items = current.addClass("selected").parents("ul, li").add( current.next() ).show();
					if (settings.prerendered) {
						// if prerendered is on, replicate the basic class swapping
						items.filter("li")
							.swapClass( CLASSES.collapsable, CLASSES.expandable )
							.swapClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
							.find(">.hitarea")
								.swapClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
								.swapClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea );
					}
				}
				break;
			}
			
			branches.applyClasses(settings, toggler);
				
			// if control option is set, create the treecontroller and show it
			if ( settings.control ) {
				treeController(this, settings.control);
				$(settings.control).show();
			}
			
			return this;
		}
	});
	
	// classes used by the plugin
	// need to be styled via external stylesheet, see first example
	$.treeview = {};
	var CLASSES = ($.treeview.classes = {
		open: "open",
		closed: "closed",
		expandable: "expandable",
		expandableHitarea: "expandable-hitarea",
		lastExpandableHitarea: "lastExpandable-hitarea",
		collapsable: "collapsable",
		collapsableHitarea: "collapsable-hitarea",
		lastCollapsableHitarea: "lastCollapsable-hitarea",
		lastCollapsable: "lastCollapsable",
		lastExpandable: "lastExpandable",
		last: "last",
		hitarea: "hitarea"
	});
	
})(jQuery);
/*
 * 
 * Tabelizer 1.0.3 - multi level grouping indicators for tables
 * Version 1.0.3
 * @requires jQuery v1.6+ and jQuery.ui core
 * 
 * Copyright (c) 2014 Rafael Huisman
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

/**
 * 
 * @description Create a table with multi level grouping indicators.
 * @demo http://powerconsulting.co/Samples/Tabelizer
 * @example $('#table1').tabelize();
 * @desc Create a simple tabelized interface.
 */

(function($){
	var self = {};
	
	self.isFunction = function(func) {
		return func && {}.toString.call(func) === '[object Function]';
	}
	
	self.rowClicker = function(evt){
	
		if (typeof self.conf.onBeforeRowClick != 'undefined' && self.isFunction(self.conf.onBeforeRowClick))
			self.conf.onBeforeRowClick.apply(self.getPublicObj(), [evt]);
		
		var $elm = $(evt.currentTarget);
		
		if (!$elm.is('tr'))
			$elm = $elm.parentsUntil('tr').parent()
		
		$row = $elm;
		
		var id = $row.attr('id');
		
		//Simple toggle for contract/expand logic
		if ($row.hasClass('contracted')){
			$row.removeClass('contracted').addClass('expanded');
			self.toggleChildren(id, true);
		}else{
			$row.removeClass('expanded').addClass('contracted');
			self.toggleChildren(id, false);
		}
		
		//After any contraction or expansion we need to resetup the lines since they will likely change.
		self.updateLines();
		
		if (typeof self.conf.onAfterRowClick != 'undefined' && self.isFunction(self.conf.onAfterRowClick))
			self.conf.onAfterRowClick.apply(self.getPublicObj(), [evt]);
			
		return self.getPublicObj();
	}
	
	self.updateLines = function(){
		//console.log('update lines' + self.maxLevel)
		var currentLevel = '';
		var prevLevel = '';
		$prevRow = null;
		//We only want to apply the lines to the non hidden children.
		self.caller.find('tr:not(.hidden):not(.hiding)').each(function(){
			$row = $(this);
			//header rows do not get included in the grouping
			if (!$row.hasClass('header')){
				currentLevel = $row.data('level');
				
				//Remove all existing first and last classes for all available levels to ensure we have a clean slate
				for(var x = self.maxLevel;x > 0;x--)
					$row.removeClass('l' + x + '-first').removeClass('l' + x + '-last')
				
				var rowClass = '';
				//We only add the grouping lines if the level has changed, this is true for the first and last lines. 
				if (currentLevel != prevLevel){
					//if the previous level is bigger than the current level then we know that we went back in the tree and the previous item is a last one, we want to mark is as the last for any level up to the current
					if (prevLevel != '' && prevLevel > currentLevel){
						for (var x = (prevLevel); x >= currentLevel; x--){
							$prevRow.addClass(' l' + (parseInt(x)) + '-last')
						}
					//If the previous level had a sibling right before it, the previous row is also a first for the previous level
					}else if (prevLevel != '' && prevLevel < currentLevel){
						$prevRow.addClass(' l' + (prevLevel) + '-first')
					}
				}
				
				$row.addClass(rowClass)
				
				prevLevel = currentLevel;
				$prevRow= $row;
			}
		});
		
		//We need to check if the last item in the grid needs a X-last class.
		if ($prevRow != null && prevLevel != '' && prevLevel > 1){
			for (var x = (prevLevel-1); x > 0; x--){
				$prevRow.addClass(' l' + (parseInt(x)) + '-last')
			}
		}
		
		return self.getPublicObj();
	}
	
	//this method toggles the children on or off, including a sliding motion
	self.toggleChildren = function(id, display, onSlideComplete){
		var startAction = false;
		var stopAction = false;
		var prevRowLevel = null;
		var startLevel = 0;
		self.caller.find('tr').each( function(){
			var $row = $(this);
			var rowId = $row.attr('id');
			var rowLevel = $row.data('level');
			var skipAction = false;
			
			if (!startAction && rowId == id){
				startAction = true;
				startLevel = rowLevel;
			}
			else if (startAction && !stopAction && prevRowLevel != null && rowLevel == (startLevel)){
				//console.log('1')
				stopAction = true;
			}else if (display && (startAction && !stopAction && prevRowLevel != null && rowLevel != (startLevel + 1))){
				skipAction = true;
			}else if (!display && (startAction && !stopAction && prevRowLevel != null && rowLevel < (startLevel))){
				//console.log('cold turkey')
				stopAction = true;
				skipAction = true;
			}
			
			
			//console.log('rowId: ' + rowId + ' perform: ' + ((!skipAction && startAction && !stopAction &&  rowId != id)) + ' skip: ' + skipAction + ' level: ' + rowLevel + ' -> ' + (startLevel))
			
			if (!skipAction && startAction && !stopAction &&  rowId != id){
				if (display){
					$row.removeClass('hidden');
					
					$row.find('td').wrapInner('<div style="display: none;" />').parent().find('td > div').slideDown(100, function(){
						var $set = $(this);
						$set.replaceWith($set.contents());
					 });
					
				}
				else{
					$row.addClass('hiding');
					$row.find('td').wrapInner('<div style="" />').parent().find('td > div').slideUp(100, function(){
						var $set = $(this);
						$set.replaceWith($set.contents());
						$row.addClass('hidden');
						$row.removeClass('hiding');
					 });
					 
					$row.removeClass('expanded')
					$row.addClass('contracted');
				}
			}
			
			prevRowLevel = rowLevel;
		});
		
		return self.getPublicObj();
	}
	
	self.updateData = function(){
		self.caller.data('tabelizer', self);
	}
	
	self.maxLevel = 0;
	self.init = function(){
	
		var currentLevel = '';
		var prevLevel = '';
		$prevRow = null;
		//we want to find all rows of the caller table to apply the base classes to them and make them expandable
		self.caller.find('tr').each( function(){
			$row = $(this);
			//don't apply any logic tot the header row
			if (!$row.hasClass('header')){
				currentLevel = $row.data('level');
			
				//initially all rows other than the first level are hidden
				var rowClass = 'l' + currentLevel + ' contracted ' + (currentLevel > 1 ? ' hidden' : '');
				
				//keep track of the highest level, this is used for the grouping lines
				if (currentLevel > self.maxLevel)
					self.maxLevel=parseInt(currentLevel);
				
				$row.addClass(rowClass)
				
				//apply labels around the first column text, so that we can add in the controls and expander image
				$firstCol = $($row.children('td')[0])
				var firstColVal = '<div class="label">' + $firstCol.html() + '</div>';
				var parentLevels = 0;
				
				//add in the line control div, add it in for every level up until your current level, this is to ensure we can show all the needed lines.
				var levelLines = '<div class="control"> ';
				for(var x = 0; x <= (currentLevel-1); x++){
					levelLines += ' <div class="line level' + (x + 1) + '"><div class="vert"></div><div class="horz"></div></div> ';
				}
				levelLines += '</div>'
				//Add the expanded class, which through css adds in the arrow image
				$firstCol.html(levelLines + ' <div class="expander"></div> ' + firstColVal);
				 
				//apply the method to be called on each row click, if fullRowClickable is set to false, then only the expander is clickable
				if (self.conf.fullRowClickable)
					$row.on('click', self.conf.onRowClick);
				else
					$row.find('.expander').on('click', self.conf.onRowClick);
				prevLevel = currentLevel;
				$prevRow= $row;
			}
		});
		
		self.updateLines();
		
		if (typeof self.conf.onReady != 'undefined' && self.isFunction(self.conf.onReady))
			self.conf.onReady.apply(self.getPublicObj(), []);
			
		return self.getPublicObj();
	}
	
	self.getPublicObj = function(){ return {
		options : self.conf,
		toggleChildren : self.toggleChildren,
		updateLines : self.updateLines,
		rowClicker : self.rowClicker,
		maxLevel : self.maxLevel,
		updateData : self.updateData
	}};
	
	self.conf = {
		onRowClick : self.rowClicker,
		fullRowClickable : true,//must be set before init
		onBeforeRowClick : null,
		onAfterRowClick : null,
		onReady : null
	};
	
	$.fn.tabelize = function(confProp){
		
		var existingSelf = this.data('tabelizer');
		if (typeof existingSelf == 'undefined'){
			$.extend(self.conf, confProp);
			self.caller = this;
			self.init();
			
		}else{
			self = existingSelf;
			$.extend(self.conf, confProp);
		}
		//Store copy of self in data for repeat calls, update it after any repeating call
		self.updateData();
		
		return self.getPublicObj()
	};
})(jQuery);
/*
 * jQuery treetable Plugin 3.1.0
 * http://ludo.cubicphuse.nl/jquery-treetable
 *
 * Copyright 2013, Ludo van den Boom
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function() {
  var $, Node, Tree, methods;

  $ = jQuery;

  Node = (function() {
    function Node(row, tree, settings) {
      var parentId;

      this.row = row;
      this.tree = tree;
      this.settings = settings;

      // TODO Ensure id/parentId is always a string (not int)
      this.id = this.row.data(this.settings.nodeIdAttr);

      // TODO Move this to a setParentId function?
      parentId = this.row.data(this.settings.parentIdAttr);
      if (parentId != null && parentId !== "") {
        this.parentId = parentId;
      }

      this.treeCell = $(this.row.children(this.settings.columnElType)[this.settings.column]);
      this.expander = $(this.settings.expanderTemplate);
      this.indenter = $(this.settings.indenterTemplate);
      this.children = [];
      this.initialized = false;
      this.treeCell.prepend(this.indenter);
    }

    Node.prototype.addChild = function(child) {
      return this.children.push(child);
    };

    Node.prototype.ancestors = function() {
      var ancestors, node;
      node = this;
      ancestors = [];
      while (node = node.parentNode()) {
        ancestors.push(node);
      }
      return ancestors;
    };

    Node.prototype.collapse = function() {
      if (this.collapsed()) {
        return this;
      }

      this.row.removeClass("expanded").addClass("collapsed");

      this._hideChildren();
      this.expander.attr("title", this.settings.stringExpand);

      if (this.initialized && this.settings.onNodeCollapse != null) {
        this.settings.onNodeCollapse.apply(this);
      }

      return this;
    };

    Node.prototype.collapsed = function() {
      return this.row.hasClass("collapsed");
    };

    // TODO destroy: remove event handlers, expander, indenter, etc.

    Node.prototype.expand = function() {
      if (this.expanded()) {
        return this;
      }

      this.row.removeClass("collapsed").addClass("expanded");

      if (this.initialized && this.settings.onNodeExpand != null) {
        this.settings.onNodeExpand.apply(this);
      }

      if ($(this.row).is(":visible")) {
        this._showChildren();
      }

      this.expander.attr("title", this.settings.stringCollapse);

      return this;
    };

    Node.prototype.expanded = function() {
      return this.row.hasClass("expanded");
    };

    Node.prototype.hide = function() {
      this._hideChildren();
      this.row.hide();
      return this;
    };

    Node.prototype.isBranchNode = function() {
      if(this.children.length > 0 || this.row.data(this.settings.branchAttr) === true) {
        return true;
      } else {
        return false;
      }
    };

    Node.prototype.updateBranchLeafClass = function(){
      this.row.removeClass('branch');
      this.row.removeClass('leaf');
      this.row.addClass(this.isBranchNode() ? 'branch' : 'leaf');
    };

    Node.prototype.level = function() {
      return this.ancestors().length;
    };

    Node.prototype.parentNode = function() {
      if (this.parentId != null) {
        return this.tree[this.parentId];
      } else {
        return null;
      }
    };

    Node.prototype.removeChild = function(child) {
      var i = $.inArray(child, this.children);
      return this.children.splice(i, 1)
    };

    Node.prototype.render = function() {
      var handler,
          settings = this.settings,
          target;

      if (settings.expandable === true && this.isBranchNode()) {
        handler = function(e) {
          $(this).parents("table").treetable("node", $(this).parents("tr").data(settings.nodeIdAttr)).toggle();
          return e.preventDefault();
        };

        this.indenter.html(this.expander);
        target = settings.clickableNodeNames === true ? this.treeCell : this.expander;

        target.off("click.treetable").on("click.treetable", handler);
        target.off("keydown.treetable").on("keydown.treetable", function(e) {
          if (e.keyCode == 13) {
            handler.apply(this, [e]);
          }
        });
      }

      this.indenter[0].style.paddingLeft = "" + (this.level() * settings.indent) + "px";

      return this;
    };

    Node.prototype.reveal = function() {
      if (this.parentId != null) {
        this.parentNode().reveal();
      }
      return this.expand();
    };

    Node.prototype.setParent = function(node) {
      if (this.parentId != null) {
        this.tree[this.parentId].removeChild(this);
      }
      this.parentId = node.id;
      this.row.data(this.settings.parentIdAttr, node.id);
      return node.addChild(this);
    };

    Node.prototype.show = function() {
      if (!this.initialized) {
        this._initialize();
      }
      this.row.show();
      if (this.expanded()) {
        this._showChildren();
      }
      return this;
    };

    Node.prototype.toggle = function() {
      if (this.expanded()) {
        this.collapse();
      } else {
        this.expand();
      }
      return this;
    };

    Node.prototype._hideChildren = function() {
      var child, _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.hide());
      }
      return _results;
    };

    Node.prototype._initialize = function() {
      var settings = this.settings;

      this.render();

      if (settings.expandable === true && settings.initialState === "collapsed") {
        this.collapse();
      } else {
        this.expand();
      }

      if (settings.onNodeInitialized != null) {
        settings.onNodeInitialized.apply(this);
      }

      return this.initialized = true;
    };

    Node.prototype._showChildren = function() {
      var child, _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.show());
      }
      return _results;
    };

    return Node;
  })();

  Tree = (function() {
    function Tree(table, settings) {
      this.table = table;
      this.settings = settings;
      this.tree = {};

      // Cache the nodes and roots in simple arrays for quick access/iteration
      this.nodes = [];
      this.roots = [];
    }

    Tree.prototype.collapseAll = function() {
      var node, _i, _len, _ref, _results;
      _ref = this.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.collapse());
      }
      return _results;
    };

    Tree.prototype.expandAll = function() {
      var node, _i, _len, _ref, _results;
      _ref = this.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.expand());
      }
      return _results;
    };

    Tree.prototype.findLastNode = function (node) {
      if (node.children.length > 0) {
        return this.findLastNode(node.children[node.children.length - 1]);
      } else {
        return node;
      }
    };

    Tree.prototype.loadRows = function(rows) {
      var node, row, i;

      if (rows != null) {
        for (i = 0; i < rows.length; i++) {
          row = $(rows[i]);

          if (row.data(this.settings.nodeIdAttr) != null) {
            node = new Node(row, this.tree, this.settings);
            this.nodes.push(node);
            this.tree[node.id] = node;

            if (node.parentId != null) {
              this.tree[node.parentId].addChild(node);
            } else {
              this.roots.push(node);
            }
          }
        }
      }

      for (i = 0; i < this.nodes.length; i++) {
        node = this.nodes[i].updateBranchLeafClass();
      }

      return this;
    };

    Tree.prototype.move = function(node, destination) {
      // Conditions:
      // 1: +node+ should not be inserted as a child of +node+ itself.
      // 2: +destination+ should not be the same as +node+'s current parent (this
      //    prevents +node+ from being moved to the same location where it already
      //    is).
      // 3: +node+ should not be inserted in a location in a branch if this would
      //    result in +node+ being an ancestor of itself.
      var nodeParent = node.parentNode();
      if (node !== destination && destination.id !== node.parentId && $.inArray(node, destination.ancestors()) === -1) {
        node.setParent(destination);
        this._moveRows(node, destination);

        // Re-render parentNode if this is its first child node, and therefore
        // doesn't have the expander yet.
        if (node.parentNode().children.length === 1) {
          node.parentNode().render();
        }
      }

      if(nodeParent){
        nodeParent.updateBranchLeafClass();
      }
      if(node.parentNode()){
        node.parentNode().updateBranchLeafClass();
      }
      node.updateBranchLeafClass();
      return this;
    };

    Tree.prototype.removeNode = function(node) {
      // Recursively remove all descendants of +node+
      this.unloadBranch(node);

      // Remove node from DOM (<tr>)
      node.row.remove();

      // Clean up Tree object (so Node objects are GC-ed)
      delete this.tree[node.id];
      this.nodes.splice($.inArray(node, this.nodes), 1);
    }

    Tree.prototype.render = function() {
      var root, _i, _len, _ref;
      _ref = this.roots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        root = _ref[_i];

        // Naming is confusing (show/render). I do not call render on node from
        // here.
        root.show();
      }
      return this;
    };

    Tree.prototype.sortBranch = function(node, sortFun) {
      // First sort internal array of children
      node.children.sort(sortFun);

      // Next render rows in correct order on page
      this._sortChildRows(node);

      return this;
    };

    Tree.prototype.unloadBranch = function(node) {
      var children, i;

      for (i = 0; i < node.children.length; i++) {
        this.removeNode(node.children[i]);
      }

      // Reset node's collection of children
      node.children = [];

      node.updateBranchLeafClass();

      return this;
    };

    Tree.prototype._moveRows = function(node, destination) {
      var children = node.children, i;

      node.row.insertAfter(destination.row);
      node.render();

      // Loop backwards through children to have them end up on UI in correct
      // order (see #112)
      for (i = children.length - 1; i >= 0; i--) {
        this._moveRows(children[i], node);
      }
    };

    // Special _moveRows case, move children to itself to force sorting
    Tree.prototype._sortChildRows = function(parentNode) {
      return this._moveRows(parentNode, parentNode);
    };

    return Tree;
  })();

  // jQuery Plugin
  methods = {
    init: function(options, force) {
      var settings;

      settings = $.extend({
        branchAttr: "ttBranch",
        clickableNodeNames: false,
        column: 0,
        columnElType: "td", // i.e. 'td', 'th' or 'td,th'
        expandable: false,
        expanderTemplate: "<a href='#'>&nbsp;</a>",
        indent: 19,
        indenterTemplate: "<span class='indenter'></span>",
        initialState: "collapsed",
        nodeIdAttr: "ttId", // maps to data-tt-id
        parentIdAttr: "ttParentId", // maps to data-tt-parent-id
        stringExpand: "Expand",
        stringCollapse: "Collapse",

        // Events
        onInitialized: null,
        onNodeCollapse: null,
        onNodeExpand: null,
        onNodeInitialized: null
      }, options);

      return this.each(function() {
        var el = $(this), tree;

        if (force || el.data("treetable") === undefined) {
          tree = new Tree(this, settings);
          tree.loadRows(this.rows).render();

          el.addClass("treetable").data("treetable", tree);

          if (settings.onInitialized != null) {
            settings.onInitialized.apply(tree);
          }
        }

        return el;
      });
    },

    destroy: function() {
      return this.each(function() {
        return $(this).removeData("treetable").removeClass("treetable");
      });
    },

    collapseAll: function() {
      this.data("treetable").collapseAll();
      return this;
    },

    collapseNode: function(id) {
      var node = this.data("treetable").tree[id];

      if (node) {
        node.collapse();
      } else {
        throw new Error("Unknown node '" + id + "'");
      }

      return this;
    },

    expandAll: function() {
      this.data("treetable").expandAll();
      return this;
    },

    expandNode: function(id) {
      var node = this.data("treetable").tree[id];

      if (node) {
        if (!node.initialized) {
          node._initialize();
        }

        node.expand();
      } else {
        throw new Error("Unknown node '" + id + "'");
      }

      return this;
    },

    loadBranch: function(node, rows) {
      var settings = this.data("treetable").settings,
          tree = this.data("treetable").tree;

      // TODO Switch to $.parseHTML
      rows = $(rows);

      if (node == null) { // Inserting new root nodes
        this.append(rows);
      } else {
        var lastNode = this.data("treetable").findLastNode(node);
        rows.insertAfter(lastNode.row);
      }

      this.data("treetable").loadRows(rows);

      // Make sure nodes are properly initialized
      rows.filter("tr").each(function() {
        tree[$(this).data(settings.nodeIdAttr)].show();
      });

      if (node != null) {
        // Re-render parent to ensure expander icon is shown (#79)
        node.render().expand();
      }

      return this;
    },

    move: function(nodeId, destinationId) {
      var destination, node;

      node = this.data("treetable").tree[nodeId];
      destination = this.data("treetable").tree[destinationId];
      this.data("treetable").move(node, destination);

      return this;
    },

    node: function(id) {
      return this.data("treetable").tree[id];
    },

    removeNode: function(id) {
      var node = this.data("treetable").tree[id];

      if (node) {
        this.data("treetable").removeNode(node);
      } else {
        throw new Error("Unknown node '" + id + "'");
      }

      return this;
    },

    reveal: function(id) {
      var node = this.data("treetable").tree[id];

      if (node) {
        node.reveal();
      } else {
        throw new Error("Unknown node '" + id + "'");
      }

      return this;
    },

    sortBranch: function(node, columnOrFunction) {
      var settings = this.data("treetable").settings,
          prepValue,
          sortFun;

      columnOrFunction = columnOrFunction || settings.column;
      sortFun = columnOrFunction;

      if ($.isNumeric(columnOrFunction)) {
        sortFun = function(a, b) {
          var extractValue, valA, valB;

          extractValue = function(node) {
            var val = node.row.find("td:eq(" + columnOrFunction + ")").text();
            // Ignore trailing/leading whitespace and use uppercase values for
            // case insensitive ordering
            return $.trim(val).toUpperCase();
          }

          valA = extractValue(a);
          valB = extractValue(b);

          if (valA < valB) return -1;
          if (valA > valB) return 1;
          return 0;
        };
      }

      this.data("treetable").sortBranch(node, sortFun);
      return this;
    },

    unloadBranch: function(node) {
      this.data("treetable").unloadBranch(node);
      return this;
    }
  };

  $.fn.treetable = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      return $.error("Method " + method + " does not exist on jQuery.treetable");
    }
  };

  // Expose classes to world
  this.TreeTable || (this.TreeTable = {});
  this.TreeTable.Node = Node;
  this.TreeTable.Tree = Tree;
}).call(this);

$("#example-advanced").treetable({
    expandAll: true
});