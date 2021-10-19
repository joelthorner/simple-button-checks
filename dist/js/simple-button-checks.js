/*!
 * Simple button checks 3.0.7
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
			checkedIcon: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>',
			nonCheckedIcon: '',

			// 'none' or 'input' or 'all'
			wrapContainer: 'none',

			btnAttributes: {
				'type': 'button'
			},

			onInit: null,
			onChange: null,
			changeCallback: null,
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

			if (thisData.labelToInput) {

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

			$.each(thisData.aditionalListeners, function (index, val) {
				val.off('click.sbc');
			});

			// callback
			if ($.type(plugin.options.onDestroy) === 'function') {
				plugin.options.onDestroy.call(thisData.$element, thisData);
			}

			// remove data
			thisData.$element.removeData('simpleButtonChecks');
		},

		disable: function (bool) {
			var thisData = $(this).data('simpleButtonChecks'),
				_self = $(this);

			if (bool === true) {

				thisData.$element.prop('disabled', true);
				thisData.$btn.addClass('sbc-disabled');

			} else if (bool === false) {

				thisData.$element.prop('disabled', false);
				thisData.$btn.removeClass('sbc-disabled');
			}
		},

		addListener: function (newNode) {
			var thisData = $(this).data('simpleButtonChecks'),
				_self = $(this);

			if ($.type(newNode) === 'object' && thisData) {

				thisData.aditionalListeners.push(newNode);

				newNode.on('click.sbc', function (event) {
					_self.click();
				});
			}
		}
	};


	// private
	function init() {
		// init additional listeners
		plugin.aditionalListeners = [];

		labelRelOption();

		// real init new html system
		initHTML();

		// wrap option with <button> added
		wrapContainer();

		// add input eventListeners with set all new html
		initEvents();

		// on init callback
		if ($.type(plugin.options.onInit) === 'function') {
			plugin.options.onInit.call(plugin.$element, plugin);
		}
	}

	function wrapContainer() {

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
					if (plugin.labelToInput) {
						toWrap = plugin.$element
							.add(plugin.$btn)
							.add(plugin.$element.parent(plugin.labelToInput))
							.add(plugin.$element.siblings(plugin.labelToInput))
							.add(plugin.$element.parent().find(plugin.labelToInput));

					} else {
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
		var thisId = plugin.$element.attr('id');
		if ($.type(thisId) != 'undefined' && thisId.length) {
			plugin.uuid = plugin.$element.attr('id') + '-sbc';
		} else {
			plugin.uuid = guid();
		}

		var btnClasses = 'sbc-btn ' + plugin.options.buttonClass + ((isAlreadyChecked) ? ' sbc-checked' : ' sbc-no-checked');

		// support disabled
		if (plugin.$element.prop('disabled')) {
			btnClasses += ' sbc-disabled'
		}

		var btnHtml = isAlreadyChecked ? plugin.options.checkedIcon : plugin.options.nonCheckedIcon;

		var btn = $('<button/>', {
			'id': plugin.uuid,
			'html': btnHtml,
			'class': btnClasses
		});

		// option attributes button html
		$.each(plugin.options.btnAttributes, function (index, val) {
			btn.attr(index, val);
		});

		// save btn into node and append
		plugin.$btn = btn;
		plugin.$element.after(plugin.$btn);

	}

	function initEvents() {

		plugin.$btn.on('click.sbc', function (event) {
			$(this).prev('.sbc-init').click();
		});

		plugin.$element.on('change.sbc', function (event) {

			var thisData = $(this).data('simpleButtonChecks'),
				self = $(this);

			if ($.type(thisData.options.onChange) === 'function') {
				thisData.options.onChange.call(self, thisData);
			}

			if (thisData.isChecked) {
				thisData.$btn
					.removeClass('sbc-checked')
					.addClass('sbc-no-checked')
					.html(thisData.options.nonCheckedIcon);

			} else {
				thisData.$btn
					.removeClass('sbc-no-checked')
					.addClass('sbc-checked')
					.html(thisData.options.checkedIcon);
			}

			thisData.isChecked = $(this).prop('checked');

			if ($.type(thisData.options.changeCallback) === 'function') {
				thisData.options.changeCallback.call(self, thisData);
			}

		});

		// focus tabs
		plugin.$element.on('focus.sbc', function (event) {
			var thisData = $(this).data('simpleButtonChecks'),
				self = $(this);

			thisData.$btn.focus();
		});

	}

	function labelRelOption() {

		// save input label reference
		var inputId = plugin.$element.attr('id');

		if ($.type(inputId) != 'undefined' && inputId.length) {
			plugin.labelToInput = 'label[for="' + inputId + '"]';
		} else {
			plugin.labelToInput = 'label';
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


			if (!data && $element.is('input[type="checkbox"]')) {
				$element.data("simpleButtonChecks", (data = new SimpleButtonChecks(this, options)));
			}

			if (typeof options == 'string') data[options].apply(this, args);

		})
	};

	$.fn.simpleButtonChecks.Constructor = SimpleButtonChecks;

}(window.jQuery);
