/*!
 * simpleBtChecks v1.1.0
 * http://joelthorner.com
 *
 * Copyright 2015 Joel Thorner - @joelthorner
 */
 
(function ( $ ) {
 
	$.fn.simpleBtChecks = function( options ) {

		var settings = $.extend({

			size : "default",
			class: "btn btn-default",
			icon : "glyphicon glyphicon-ok",

			onLoadSbtc : null,
			beforeChange : null,
			afterChange : null

		}, options );

		var size = settings.size;
		var node = $(this);

		$(this).addClass('sr-only');

		this.each(function(index, el) {

			var checked = "";
			
			if ( $(this).is(':checked') || $(this).attr('checked') || $(this).prop('checked') ){
				checked = settings.icon;
				$(this).prop('checked', true);

			}else{
				$(this).prop('checked', false);
			}
			var template = "<button type=\"button\" class=\"sbtc-btn " + settings.class + " sbtc-" + size + " \">" +
									"<span class=\"sbtc-icon " + checked + " \"></span>" +
								"</button>";

			$(this).before(template);

		   if(settings.onLoadSbtc) _onLoadSbtc(settings.onLoadSbtc, $(this).prev('.sbtc-btn'), index);
			
		});

		this.prev('.sbtc-btn').on('click', function(event) {
		   
		   event.stopPropagation();
		   var ck = $(this).next('input');

		   if(settings.beforeChange) _beforeChange(settings.beforeChange, ck.prop("checked"), $(this));

		   if(ck.prop("checked")){ 
		   	$(this).find('.sbtc-icon').removeClass(settings.icon); 
		   	ck.prop("checked", false); 
		   }
		   else{ 
		   	$(this).find('.sbtc-icon').addClass(settings.icon); 
		   	ck.prop("checked", true); 
		   }

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