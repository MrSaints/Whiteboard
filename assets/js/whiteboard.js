var $whiteboard = new DrawingBoard.Board('js-whiteboard', {
	controls: false
});

$whiteboard.ev.bind('board:drawing', function ($data) {
    //console.log($data);
});

TogetherJS.hub.on("togetherjs.hello", function () {
    TogetherJS.send({
        type: "init",
        image: $whiteboard.getImg()
    });
});

TogetherJS.hub.on("init", function (msg) {
    $whiteboard.setImg(msg.image);
});