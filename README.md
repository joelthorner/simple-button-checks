
Simple-bt-checks
==========

Transform checkbox inputs to [Bootstrap](http://getbootstrap.com/css/#buttons) HTML buttons

## Demos / Documentation
Demo & doc : [joelthorner.com](http://joelthorner.com/plugin/simple-bt-checks)

## Getting Started

### Includes
```html
<!DOCTYPE html>
<html lang="en">
<head>
   ...
   <link rel="stylesheet" href="path/to/bootstrap3.x.x.min.css"><!-- optional framework -->
   <link rel="stylesheet" href="path/to/simple-bt-checks.min.css">
</head>
<body>
   ...
   <script src="path/to/jquery2/3.x.x.min.js"></script>
   <script src="path/to/bootstrap3.x.x.min.js"></script><!-- optional framework -->
   <script src="path/to/simple-bt-checks.min.js"></script>
</body>
</html>
```

### Js initialization
```javascript
//default options
$('input[type="checkbox"]').simpleBtChecks({
	size : "default",
	btnClass: "btn btn-default",
	checkedIcon : "glyphicon glyphicon-ok",
	bootstrapUse : true,
	wrapContainer : 'none', 
	strictLabel : true,
	btnAttributes : {},
	onInit : null,
	onChange : null,
	changeCallback : null,
	onDestroy: null
});
//equivalent of
$('input[type="checkbox"]').simpleBtChecks();
```

## Options and Methods
Options and Methods : [joelthorner.com](http://joelthorner.com/plugin/simple-bt-checks)
