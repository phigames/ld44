game.GUI = {};

game.GUI.Button = me.Container.extend({
    init: function(x, y, label, onClick) {
        this._super(me.Container, "init", [x, y, 100, 50]);
        this.anchorPoint = {x: 0, y: 0};
        this.text = new me.Text(this.width / 2, 10, {font: "sans-serif", size: 30, fillStyle: "#00FF00", text: label, textAlign: "center"});
        this.addChild(this.text);
        this.backgroundColor = "#FF0000";
        
        me.input.registerPointerEvent("pointerdown", this, onClick);
    },

    draw: function(renderer) {
        renderer.setColor(this.backgroundColor);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        this._super(me.Container, "draw", [renderer]);
    }
});

game.GUI.Slider = me.Container.extend({
    init: function(x, y, width, minValue, maxValue) {
        this._super(me.Container, "init", [x, y, width, 20]);
        this.anchorPoint = {x: 0, y: 0.5};
        this.valueText = new me.Text(this.width, 0, {font: "sans-serif", size: 30, fillStyle: "#00FF00"});
        this.addChild(this.valueText);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = (maxValue - minValue) / 2 + minValue;
        this.updateText();

        me.input.registerPointerEvent("pointermove", this, this.onClick.bind(this));
    },

    updateText: function() {
        this.valueText.setText(this.value);
    },

    onClick: function(event) {
        this.value = ((event.gameX - this.pos.x) / this.width) * (this.maxValue - this.minValue);
        console.log(event);
        this.updateText();
    },

    draw: function(renderer) {
        this._super(me.Container, "draw", [renderer]);
        renderer.setColor("#888888");
        renderer.fillRect(0, 8, this.width, 4);
        let sliderX = this.value / (this.maxValue - this.minValue) * this.width;
        renderer.setColor("#CCCCCC");
        renderer.fillEllipse(sliderX, 10, 10, 10);
    }
});