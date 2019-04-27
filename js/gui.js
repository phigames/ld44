game.GUI = {};

game.GUI.Button = me.Renderable.extend({
    init: function(x, y, text, onClick) {
        this._super(me.Renderable, "init", [x, y, 50, 50]);
        this.color = '#FF0000';
    },

    draw: function(renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(0, 0, this.width, this.height);
    }
});