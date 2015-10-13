<html>
<head>
</head>
<body>
	<?php
		if (!headers_sent()) {
			header('Location: #LOCATION');
	    	die();
	    } else {
	    	die('<script type="text/javascript">window.location.href="#LOCATION";</script>');
	    }
	?>
</body>
</html>