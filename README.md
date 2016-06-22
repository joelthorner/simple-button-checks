
Simple-bt-checks
==========

Transform checkbox inputs to [Bootstrap](http://getbootstrap.com/css/#buttons) HTML buttons

## Demo / Documentation
Demo & doc : [joelthorner.com](http://joelthorner.com/plugin/simple-bt-checks)

## Getting Started

### Includes
```html
<!-- css -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<link rel="stylesheet" href="css/simple-bt-checks.css">
<!-- js-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="js/simple-bt-checks.js"></script>
```

### Js initialization
```javascript
//default options
$('input[type="checkbox"]').simpleBtChecks({
	size: "default",
	class: "btn btn-default",
	icon : "glyphicon glyphicon-ok",
	callOriginalEvents : false,
	onLoadSbtc : null,
	beforeChange : null,
	afterChange : null
});
//equivalent of
$('input[type="checkbox"]').simpleBtChecks();
```

## Options
Parameter | Type | Default | Description
------------ | ------------ | ------------ | ------------
size | string | "default" | Size of new html button. Optional sizes: "x-2", "x-3"
class | string | "btn btn-default" | You can pass any class, but we recommend at least 'btn' bootstrap class.
icon | string | "glyphicon glyphicon-ok" | 
callOriginalEvents | boolean | false | Enable this option and plugin will simulate input original events: onClick and onChange.
onLoadSbtc | function | null | For each input a node is created. After this node is placed run this event, and return newNodeElement (node) and input loop index (int) Value if not null: ```function(newNodeElement, index){}```
beforeChange | function | null | Before check change run beforeChange event, and return (bool) and nodeElement (node) ```function (isChecked, nodeElement){}```
afterChange | function | null | After check change run beforeChange event, and return (bool) and nodeElement (node) ```function (isChecked, nodeElement){}```
