var $whiteboard = new DrawingBoard.Board('js-whiteboard', {
	controls: false
});

$whiteboard.ev.bind('board:startDrawing', function ($data) {
	console.log('Click!');
});

if (TogetherJS.running) {
	var $coords = {};

	$whiteboard.ev.bind('board:startDrawing', function ($data) {
		$coords.current = $coords.last = $data.coords;
		$coords.last_mid = $whiteboard._getMidInputCoords($data.coords);
	});

	$whiteboard.ev.bind('board:drawing', function ($data) {
		if ($whiteboard.isDrawing) {
			$coords.current = $data.coords;
			$coords.current_mid = $whiteboard._getMidInputCoords($coords.current);

			/*
			 * Remote Draw
			 */
	        TogetherJS.send({
	            type: "draw",
	            coords: $coords
	        });

	        $coords.last = $coords.current;
	        $coords.last_mid = $coords.current_mid;
		}
	});

	$whiteboard.ev.bind('board:mouseOver', function ($data) {
		$coords.last = $whiteboard._getInputCoords($data.e);
		$coords.last_mid = $whiteboard._getMidInputCoords($coords.last);
	});
}

TogetherJS.hub.on("draw", function ($data) {
    $whiteboard.remoteDraw($data.coords);
});

TogetherJS.hub.on("togetherjs.hello", function () {
    TogetherJS.send({
        type: "init",
        image: $whiteboard.getImg()
    });
});

TogetherJS.hub.on("init", function ($data) {
    $whiteboard.setImg($data.image);
});