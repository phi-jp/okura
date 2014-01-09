tm.main(function() {
    var app = tm.display.CanvasApp("#app");
    app.resize(400, 400).fitWindow();
    app.replaceScene(Main());
    app.run();
});

tm.define("Main", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        var c = tm.display.CircleShape(30, 30);
        c.update = function(app) {
            var kb = app.keyboard;
            this.position.add(kb.getKeyDirection().mul(10));
        };
        c.setPosition(200, 200).addChildTo(this);
    }
});
