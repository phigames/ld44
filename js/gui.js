game.GUI = {};

game.GUI.Button = me.Entity.extend({
    init: function(x, y, text, onClick) {
        this._super(me.Entity, "init", [x, y, {width: 50, height: 50}]);
        this.color = "#FF0000";
        
        me.input.registerPointerEvent("pointerdown", this, onClick);
        console.log("asdf");
        
    },

    draw: function(renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(0, 0, this.width, this.height);
    }
});