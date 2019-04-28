game.GUI = {
    font: "sans-serif",
    fontSize: 30,
    fontColor: "#00FF00",
};


game.GUI.Button = me.Container.extend({
    init: function(x, y, label, onClick) {
        this._super(me.Container, "init", [x, y, 100, 50]);
        this.anchorPoint = {x: 0, y: 0};
        this.text = new me.Text(this.width / 2, 10, { font: game.GUI.font,
                                                      size: game.GUI.fontSize,
                                                      fillStyle: game.GUI.fontColor,
                                                      text: label,
                                                      textAlign: "center" });
        this.addChild(this.text);
        this.backgroundColor = "#FF0000";
        this.backgroundColorHover = "#880000";
        
        this.pointerOver = false;
        me.input.registerPointerEvent("pointerenter", this, () => { this.pointerOver = true;
                                                                    me.game.repaint() });
        me.input.registerPointerEvent("pointerleave", this, () => { this.pointerOver = false;
                                                                    me.game.repaint() });
        me.input.registerPointerEvent("pointerdown", this, onClick);
    },

    draw: function(renderer) {
        console.log(this.pointerOver);
        
        renderer.setColor(this.pointerOver ? this.backgroundColorHover
                                           : this.backgroundColor);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        this._super(me.Container, "draw", [renderer]);
    },
});


game.GUI.Slider = me.Container.extend({
    init: function(x, y, width, minValue, maxValue) {
        this._super(me.Container, "init", [x, y, width, 40]);
        this.anchorPoint = {x: 0, y: 0};
        this.valueText = new me.Text(this.width, 0, { font: game.GUI.font,
                                                      size: game.GUI.fontSize,
                                                      fillStyle: game.GUI.fontColor });
        this.addChild(this.valueText);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = (maxValue - minValue) / 2 + minValue;
        this.updateText();

        this.connectedSlider = this.connectedSliderRatio = null;

        this.pointerDown = this.pointerOver = false;
        me.input.registerPointerEvent("pointerdown", this, () => this.pointerDown = true);
        me.input.registerPointerEvent("pointerup", this, () => this.pointerDown = false);
        me.input.registerPointerEvent("pointerenter", this, () => this.pointerOver = true);
        me.input.registerPointerEvent("pointerleave", this, () => { this.pointerOver = false;
                                                                    this.pointerDown = false });
        me.input.registerPointerEvent("pointermove", this, this.onMove.bind(this));
    },

    getValue: function() {
        return Math.round(this.value);
    },

    connect: function(other, ratio) {
        this.connectedSlider = other;
        this.connectedSliderRatio = ratio;
        other.connectedSlider = this;
        other.connectedSliderRatio = 1 / ratio;
        other.updateValueFromConnection();
    },

    updateText: function() {
        this.valueText.setText(this.getValue());
    },

    updateValueFromConnection: function() {
        this.value = this.connectedSlider.value * this.connectedSliderRatio;
        if (this.value < this.minValue) {
            this.value = this.minValue;
            this.connectedSlider.updateValueFromConnection();
        } else if (this.value > this.maxValue) {
            this.value = this.maxValue;
            this.connectedSlider.updateValueFromConnection();
        }
        this.updateText();
    },

    onMove: function(event) {
        if (this.pointerDown) {
            this.value = ((event.gameX - this.pos.x) / this.width) * (this.maxValue - this.minValue);
            this.updateText();
            if (this.connectedSlider !== null) {
                this.connectedSlider.updateValueFromConnection();
            }
        }
    },

    draw: function(renderer) {
        this._super(me.Container, "draw", [renderer]);
        renderer.setColor("#888888");
        renderer.fillRect(0, 18, this.width, 4);
        let sliderX = this.value / (this.maxValue - this.minValue) * this.width;
        renderer.setColor("#CCCCCC");
        renderer.fillEllipse(sliderX, 20, 10, 10);
    },
});


game.GUI.Bar = me.Entity.extend({
    init: function(x, y, width, maxValue, color) {
        this._super(me.Entity, "init", [x, y, {width: width, height: 30}]);
        this.maxValue = maxValue;
        this.value = 0;
        this.color = color;
    },

    setValue: function(value) {
        this.value = value;
        me.game.repaint();
    },

    draw: function(renderer) {
        this._super(me.Entity, "draw", [renderer]);
        renderer.setColor(this.color);
        renderer.fillRect(0, 0, this.value / this.maxValue * this.width, this.height)
        renderer.setColor("#888888");
        renderer.setLineWidth(2);
        renderer.strokeRect(0, 0, this.width, this.height);
    },
});
