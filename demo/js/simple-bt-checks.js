/*!
 * simpleBtChecks v1.1.2
 * http://joelthorner.com
 *
 * Copyright 2016 Joel Thorner - @joelthorner
 */
 
;(function ( $ ) {
	$.fn.simpleBtChecks = function( options ) {
		if(options === 'v') return '1.1.2';

		var settings = $.extend({

			size : "default",
			class: "btn btn-default",
			icon : "glyphicon glyphicon-ok",
			callOriginalEvents : false,

			onLoadSbtc : null,
			beforeChange : null,
			afterChange : null

		}, options );

		var size = settings.size;
		var node = $(this);

		$(this).addClass('sr-only');

		this.each(function(index, el) {

			var checked = "";
			var checked_btn = "sbtc-no-checked";
			
			if ( $(this).is(':checked') || $(this).attr('checked') || $(this).prop('checked') ){
				checked = settings.icon;
				checked_btn = "sbtc-checked";
				$(this).prop('checked', true);

			}else{
				$(this).prop('checked', false);
			}
			var template = "<button type=\"button\" class=\"sbtc-btn " + settings.class + " sbtc-" + size + " " + checked_btn + "\">" +
									"<span class=\"sbtc-icon " + checked + " \"></span>" +
								"</button>";

			$(this).before(template);

		   if(settings.onLoadSbtc) _onLoadSbtc(settings.onLoadSbtc, $(this).prev('.sbtc-btn'), index);
			
		});

		this.prev('.sbtc-btn').on('click.simpleBtChecks', function(event) {
		   
		   event.stopPropagation();
		   var ck = $(this).next('input');

		   if(settings.beforeChange) _beforeChange(settings.beforeChange, ck.prop("checked"), $(this));

		   if(ck.prop("checked")){ 
		   	$(this)
		   		.removeClass('sbtc-checked')
		   		.addClass('sbtc-no-checked')
		   		.find('.sbtc-icon')
		   		.removeClass(settings.icon); 

		   		if (!settings.callOriginalEvents) {
				   	ck
				   		.prop("checked", false)
				   		.removeAttr('checked');
		   		}
		   }
		   else{ 
		   	$(this)
		   		.removeClass('sbtc-no-checked')
		   		.addClass('sbtc-checked')
		   		.find('.sbtc-icon')
		   		.addClass(settings.icon); 

		   	if (!settings.callOriginalEvents) {
			   	ck
			   		.prop("checked", true)
			   		.attr('checked', '');
			   }
		   }

		   if(settings.callOriginalEvents) ck.click();

		   if(settings.afterChange) _afterChange(settings.afterChange, ck.prop("checked"), $(this));

		});

		function _afterChange(_func, isChecked, _el){
			_func( isChecked , _el);
		}

		function _beforeChange(_func, isChecked, _el){
			_func( isChecked , _el);
		}

		function _onLoadSbtc(_func, _el, _index){
			_func( _el, _index );
		}

		return this;
	};


}( jQuery ));