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
        this.anchorPoint = {x: 0, y: 0};
        this.valueText = new me.Text(this.width, 0, {font: "sans-serif", size: 30, fillStyle: "#00FF00"});
        this.addChild(this.valueText);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = (maxValue - minValue) / 2 + minValue;
        this.updateText();

        this.connectedSlider = this.connectedSliderRatio = null;

        this.pointerDown = false;
        me.input.registerPointerEvent("pointerdown", this, () => this.pointerDown = true);
        me.input.registerPointerEvent("pointerup", this, () => this.pointerDown = false);
        me.input.registerPointerEvent("pointerleave", this, () => this.pointerDown = false);
        me.input.registerPointerEvent("pointermove", this, this.onMove.bind(this));
    },

    connect: function(other, ratio) {
        this.connectedSlider = other;
        this.connectedSliderRatio = ratio;
        other.connectedSlider = this;
        other.connectedSliderRatio = 1 / ratio;
        other.updateValueFromConnection();
    },

    updateText: function() {
        this.valueText.setText(this.value);
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
        renderer.fillRect(0, 8, this.width, 4);
        let sliderX = this.value / (this.maxValue - this.minValue) * this.width;
        renderer.setColor("#CCCCCC");
        renderer.fillEllipse(sliderX, 10, 10, 10);
    }
});