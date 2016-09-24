/*!
 * Simple bt checks 2.0.1
 * http://joelthorner.com/plugin/simple-bt-checks
 *
 * Copyright 2016 Joel Thorner - @joelthorner
 */
!function ($) {

	"use strict";

	var plugin;

	var SimpleBtChecks = function (el, options) {

		plugin = this;

		this.$element = $(el);

		var defaults = {
			size : "default",
			btnClass: "btn btn-default",
			checkedIcon : "glyphicon glyphicon-ok",

			bootstrapUse : true,

			// 'none' or 'input' or 'all'
			wrapContainer : 'none', 
			
			// add click listener if label has rel with label for -> input id
			// <label for="country"></label> <input id="country" type="checkbox">
			strictLabel : true,

			btnAttributes : {
				'type' : 'button'
			},

			onInit : null,
			onChange : null,
			changeCallback : null,
			onDestroy: null
		};

		this.options = $.extend(defaults, options);

		init();
	};

	// public methods
	SimpleBtChecks.prototype = {

		destroy: function () {
			var thisData = $(this).data('simpleBtChecks');

			// remove HTML
			thisData.$btn.remove();
			
			// remove classes
			thisData.$element.removeClass('sbtc-initialized');
			
			// remove events
			thisData.$element.off('change.bs.sbtc');
			
			if(thisData.labelToInput){
				
				thisData.$element
					.siblings(thisData.labelToInput)
					.off('click.bs.sbtc');
				
				thisData.$element
					.parent().find(thisData.labelToInput)
					.off('click.bs.sbtc');

				thisData.$element
					.parent(thisData.labelToInput)
					.off('click.bs.sbtc');
			}

			$.each(thisData.aditionalListeners, function(index, val) {
				val.off('click.bs.sbtc');				
			});
			
			// callback
			if($.type(plugin.options.onDestroy) === 'function'){
				plugin.options.onDestroy.call(thisData.$element, thisData);
			}

			// remove data
			thisData.$element.removeData('simpleBtChecks');
		},

		addListener : function (newNode) {
			var thisData = $(this).data('simpleBtChecks'),
				 _self = $(this);

 			if ($.type(newNode) === 'object' && thisData) {

 				thisData.aditionalListeners.push(newNode);

 				newNode.on('click.bs.sbtc', function(event) {
					_self.click();
				});
 			}
		}
	};


	// private
	function init() {
		// init additional listeners
		plugin.aditionalListeners = [];
		
		// label strict/nostrict mode
		labelRelOption();

		// bootstrap if not used changes
		bootstrapUseOption();

		// real init new html system
		initHTML();

		// wrap option with <button> added
		wrapContainer();

		// add input eventListeners with set all new html
		initEvents();

		// on init callback
		if($.type(plugin.options.onInit) === 'function'){
			plugin.options.onInit.call(plugin.$element, plugin);
		}
	}

	function wrapContainer () {
		
		if ($.type(plugin.options.wrapContainer) === 'string') {
			switch (plugin.options.wrapContainer) {
				case 'none':
					break;
				
				case 'input':
					plugin.$element
						.add(plugin.$btn)
						.wrapAll('<div class="sbtc-container"></div>')
					break;
				
				case 'all':
					var toWrap;
					if(plugin.labelToInput){
						toWrap = plugin.$element
								.add(plugin.$btn)
								.add(plugin.$element.parent(plugin.labelToInput))
								.add(plugin.$element.siblings(plugin.labelToInput))
								.add(plugin.$element.parent().find(plugin.labelToInput));

					}else{
						toWrap = plugin.$element.add(plugin.$btn);
					}
					
					toWrap.wrapAll('<div class="sbtc-container"></div>');
					break;
			}
		}

	}

	function initHTML() {
		// add initialized original input class
		plugin.$element.addClass('sbtc-initialized');

		// checked check
		var isAlreadyChecked = false;

		if (plugin.$element.prop('checked')) {
			isAlreadyChecked = true;            
		}

		// save checked into el
		plugin.isChecked = isAlreadyChecked;

		// create btn
		plugin.uuid = guid();

		var btnClasses = 'sbtc-btn ' + plugin.options.btnClass + 
			' sbtc-' + plugin.options.size + ((isAlreadyChecked) ? ' sbtc-checked': ' sbtc-no-checked');

		var btnHtml = '<span class="sbtc-icon ' + ((isAlreadyChecked) ? plugin.options.checkedIcon : '') + '"></span>';

		var btn = $('<button/>', {
			'id' : plugin.uuid,
			'html' : btnHtml,
			'class' : btnClasses
		});

		// option attributes button html
		$.each(plugin.options.btnAttributes, function(index, val) {
			btn.attr(index, val);
		});

		// save btn into node and append
		plugin.$btn = btn;
		plugin.$element.after(plugin.$btn);

	}

	function initEvents(){

		plugin.$btn.on('click.bs.sbtc', function(event) {
			// event.preventDefault();
			// event.stopPropagation();
			$(this).prev('.sbtc-initialized').click();
		});
		
		plugin.$element.parent().find(plugin.labelToInput).on('click.bs.sbtc', function(event) {
			if(plugin.labelToInput == null){
				event.preventDefault();
				event.stopPropagation();
			}else{
				$(this).find('.sbtc-initialized').click();
			}
		});

		plugin.$element.siblings(plugin.labelToInput).on('click.bs.sbtc', function(event) {
			if(plugin.labelToInput == null){
				event.preventDefault();
				event.stopPropagation();
			}else{
				$(this).siblings('.sbtc-initialized').click();
			}
		});

		plugin.$element.parent(plugin.labelToInput).on('click.bs.sbtc', function(event) {
			if(plugin.labelToInput != null){
				$(this).find('.sbtc-initialized').click();
			}
		});

		plugin.$element.on('change.bs.sbtc', function(event) {

			var thisData = $(this).data('simpleBtChecks'),
				 self = $(this);

			if($.type(thisData.options.onChange) === 'function'){
				thisData.options.onChange.call(self, thisData);
			}
			
			if (thisData.isChecked) {
				thisData.$btn
					.removeClass('sbtc-checked')
					.addClass('sbtc-no-checked')
					.find('.sbtc-icon')
					.removeClass(thisData.options.checkedIcon);

			}else{
				thisData.$btn
					.removeClass('sbtc-no-checked')
					.addClass('sbtc-checked')
					.find('.sbtc-icon')
					.addClass(thisData.options.checkedIcon);
			}

			thisData.isChecked = $(this).prop('checked');

			if($.type(thisData.options.changeCallback) === 'function'){
				thisData.options.changeCallback.call(self, thisData);
			}

		});

		// focus tabs
		plugin.$element.on('focus.bs.sbtc', function(event) {
			var thisData = $(this).data('simpleBtChecks'),
				 self = $(this);

			thisData.$btn.focus();
		});

	}

	function labelRelOption () {
		if (plugin.options.strictLabel != null) {

			// save input label reference
			var inputId = plugin.$element.attr('id');

			// if not find input label reference and option is true -> set strictLabel to false
		 	if ($('label[for="'+inputId+'"]').length == 0){
		 		plugin.options.strictLabel = false;
		 	}

		 	if (plugin.options.strictLabel) {
		 		plugin.labelToInput = 'label[for="'+plugin.labelToInput+'"]';
		 	}else{	
		 		plugin.labelToInput = 'label';
		 	}

		}
		else if(plugin.options.strictLabel == null){
			plugin.labelToInput = null;
		}
	}

	function bootstrapUseOption () {
		// if not use bootstrap change default class btn btn-default
		// 	and glyphicon icon
	 	if (plugin.options.bootstrapUse === false) {
		
			// if(plugin.options.btnClass === plugin.defaults.btnClass)
			plugin.options.btnClass = plugin.options.btnClass + ' sbtc-no-bt';

			// if(plugin.options.checkedIcon === plugin.defaults.checkedIcon)
			plugin.options.checkedIcon = plugin.options.checkedIcon + ' sbtc-checked-icon';
		
		}else{
			
			plugin.options.btnClass = plugin.options.btnClass + ' sbtc-bootstrap';
		}
	}

	// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	function guid() {
		
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		
		return 'sbtc-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4();
	}


	$.fn.simpleBtChecks = function (options) {

		var args = Array.prototype.slice.call(arguments);
		args.shift();

		return this.each(function () {

			var $element = $(this);
			var data = $element.data("simpleBtChecks");


			if (!data && $element.is('input[type="checkbox"]')){
				$element.data("simpleBtChecks", (data = new SimpleBtChecks(this, options)));
			}

			if (typeof options == 'string') data[options].apply(this, args);

		})
	};

	$.fn.simpleBtChecks.Constructor = SimpleBtChecks;

}(window.jQuery);
