game.GUI = {
    font: "sans-serif",
    fontSize: 30,
    fontColor: "#00FF00",
};


game.GUI.Button = me.Container.extend({
    init: function(x, y, label, onClick) {
        this._super(me.Container, "init", [x, y, 100, 50]);
        this.anchorPoint = { x: 0, y: 0 };
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
                                                                    me.game.repaint(); });
        me.input.registerPointerEvent("pointerleave", this, () => { this.pointerOver = false;
                                                                    me.game.repaint(); });
        me.input.registerPointerEvent("pointerdown", this, onClick);
    },

    draw: function(renderer) {
        renderer.setColor(this.pointerOver ? this.backgroundColorHover
                                           : this.backgroundColor);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        this._super(me.Container, "draw", [renderer]);
    },
});


game.GUI.Slider = me.Container.extend({
    init: function(x, y, width, minValue, maxValue) {
        this._super(me.Container, "init", [x, y, width, 40]);
        this.anchorPoint = { x: 0, y: 0 };
        this.valueText = new me.Text(this.width, 0, { font: game.GUI.font,
                                                      size: game.GUI.fontSize,
                                                      fillStyle: game.GUI.fontColor });
        this.addChild(this.valueText);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = (maxValue - minValue) / 2 + minValue;

        this.connectedIconBar = this.connectedIconBarRatio = null;

        this.setValue(this.value);

        this.pointerDown = this.pointerOver = false;
        me.input.registerPointerEvent("pointerdown", this, () => this.pointerDown = true);
        me.input.registerPointerEvent("pointerup", this, () => this.pointerDown = false);
        me.input.registerPointerEvent("pointerenter", this, () => this.pointerOver = true);
        me.input.registerPointerEvent("pointerleave", this, () => { this.pointerOver = false;
                                                                    this.pointerDown = false; });
        me.input.registerPointerEvent("pointermove", this, this.onMove.bind(this));
    },

    setValue: function(value) {
        this.value = value;
        this.updateText();
        this.updateConnection();
    },

    getValue: function() {
        return Math.round(this.value);
    },

    connectIconBar: function(iconBar, ratio) {
        this.connectedIconBar = iconBar;
        this.connectedIconBarRatio = ratio;
        this.setValue(this.value);
    },

    updateConnection: function() {
        if (this.connectedIconBar !== null) {
            let barValue = this.connectedIconBar.setValue(this.value * this.connectedIconBarRatio);
            this.value = barValue / this.connectedIconBarRatio;
            this.updateText();
        }
    },

    updateText: function() {
        this.valueText.setText(this.getValue());
    },

    onMove: function(event) {
        if (this.pointerDown) {
            this.setValue((event.gameX - this.pos.x) / this.width * (this.maxValue - this.minValue));
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


game.GUI.IconBar = me.Entity.extend({
    init: function(x, y, maxValue, value) {
        this._super(me.Entity, "init", [x, y, { width: 300, height: 30 }]);
        this.anchorPoint = { x: 0, y: 0 };
        this.maxValue = maxValue;
        if (typeof value === "undefined") {
            value = maxValue;
        }
        this.value = value;
        this.color = "#FF0000";
    },

    setValue: function(value) {
        this.value = value;
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }
        me.game.repaint();
        return this.value;
    },

    getValue: function() {
        return Math.round(this.value);
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


game.GUI.TextOverlay = me.Container.extend({
    init: function(x, y, text) {
        this._super(me.Container, "init", [x, y]);
        this.margin = 10;
        this.text = new me.Text(this.margin, this.margin, { font: game.GUI.font,
                                                            size: game.GUI.fontSize,
                                                            fillStyle: game.GUI.fontColor,
                                                            text: text });
        this.addChild(this.text);
        this.anchorPoint = { x: 0, y: 0 };
    },

    draw: function(renderer) {
        this.width = this.text.width + 2 * this.margin;
        this.height = this.text.height + 2 * this.margin;
        renderer.setColor("#00FFFF");
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        this._super(me.Container, "draw", [renderer]);
    },
});
