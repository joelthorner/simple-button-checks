/*!
 * Simple button checks 3.0.0
 * http://joelthorner.github.io/simple-button-checks/
 *
 * Copyright 2018 Joel Thorner - @joelthorner
 */
!function ($) {

	"use strict";

	var plugin;

	var SimpleButtonChecks = function (el, options) {

		plugin = this;

		this.$element = $(el);

		var defaults = {
			buttonClass: "sbc-default",
			checkedIcon : "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/></svg>",
			nonCheckedIcon : '',

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
	SimpleButtonChecks.prototype = {

		destroy: function () {
			var thisData = $(this).data('simpleButtonChecks');

			// remove HTML
			thisData.$btn.remove();
			
			// remove classes
			thisData.$element.removeClass('sbc-init');
			
			// remove events
			thisData.$element.off('change.sbc');
			
			if(thisData.labelToInput){
				
				thisData.$element
					.siblings(thisData.labelToInput)
					.off('click.sbc');
				
				thisData.$element
					.parent().find(thisData.labelToInput)
					.off('click.sbc');

				thisData.$element
					.parent(thisData.labelToInput)
					.off('click.sbc');
			}

			$.each(thisData.aditionalListeners, function(index, val) {
				val.off('click.sbc');				
			});
			
			// callback
			if($.type(plugin.options.onDestroy) === 'function'){
				plugin.options.onDestroy.call(thisData.$element, thisData);
			}

			// remove data
			thisData.$element.removeData('simpleButtonChecks');
		},

		addListener : function (newNode) {
			var thisData = $(this).data('simpleButtonChecks'),
				 _self = $(this);

 			if ($.type(newNode) === 'object' && thisData) {

 				thisData.aditionalListeners.push(newNode);

 				newNode.on('click.sbc', function(event) {
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
						.wrapAll('<div class="sbc-container"></div>')
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
					
					toWrap.wrapAll('<div class="sbc-container"></div>');
					break;
			}
		}

	}

	function initHTML() {
		// add init original input class
		plugin.$element.addClass('sbc-init');

		// checked check
		var isAlreadyChecked = false;

		if (plugin.$element.prop('checked')) {
			isAlreadyChecked = true;            
		}

		// save checked into el
		plugin.isChecked = isAlreadyChecked;

		// create btn
		if (plugin.$element.attr('id').length) {
			plugin.uuid = plugin.$element.attr('id') + '_sbc';
		}else{
			plugin.uuid = guid();
		}

		var btnClasses = 'sbc-btn ' + plugin.options.buttonClass + ((isAlreadyChecked) ? ' sbc-checked': ' sbc-no-checked');

		var btnHtml = isAlreadyChecked ? plugin.options.checkedIcon : plugin.options.nonCheckedIcon;

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

		plugin.$btn.on('click.sbc', function(event) {
			$(this).prev('.sbc-init').click();
		});
		
		plugin.$element.parent().find(plugin.labelToInput).on('click.sbc', function(event) {
			if(plugin.labelToInput == null){
				event.preventDefault();
				event.stopPropagation();
			}else{
				$(this).find('.sbc-init').click();
			}
		});

		plugin.$element.siblings(plugin.labelToInput).on('click.sbc', function(event) {
			if(plugin.labelToInput == null){
				event.preventDefault();
				event.stopPropagation();
			}else{
				$(this).siblings('.sbc-init').click();
			}
		});

		plugin.$element.parent(plugin.labelToInput).on('click.sbc', function(event) {
			if(plugin.labelToInput != null){
				// this call 3 times for click and is an error
				// $(this).find('.sbc-init').click();
			}
		});

		plugin.$element.on('change.sbc', function(event) {

			var thisData = $(this).data('simpleButtonChecks'),
				 self = $(this);

			if($.type(thisData.options.onChange) === 'function'){
				thisData.options.onChange.call(self, thisData);
			}
			
			if (thisData.isChecked) {
				thisData.$btn
					.removeClass('sbc-checked')
					.addClass('sbc-no-checked')
					.html(thisData.options.nonCheckedIcon);

			}else{
				thisData.$btn
					.removeClass('sbc-no-checked')
					.addClass('sbc-checked')
					.html(thisData.options.checkedIcon);
			}

			thisData.isChecked = $(this).prop('checked');

			if($.type(thisData.options.changeCallback) === 'function'){
				thisData.options.changeCallback.call(self, thisData);
			}

		});

		// focus tabs
		plugin.$element.on('focus.sbc', function(event) {
			var thisData = $(this).data('simpleButtonChecks'),
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

	// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	function guid() {
		
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		
		return 'sbc-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4();
	}


	$.fn.simpleButtonChecks = function (options) {

		var args = Array.prototype.slice.call(arguments);
		args.shift();

		return this.each(function () {

			var $element = $(this);
			var data = $element.data("simpleButtonChecks");


			if (!data && $element.is('input[type="checkbox"]')){
				$element.data("simpleButtonChecks", (data = new SimpleButtonChecks(this, options)));
			}

			if (typeof options == 'string') data[options].apply(this, args);

		})
	};

	$.fn.simpleButtonChecks.Constructor = SimpleButtonChecks;

}(window.jQuery);
