game.GUI = {
    font: "sans-serif",
    fontSize: 30,
    fontColor: "#000000",
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
        this.addChild(this.text, 100);
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

        this.background = new me.Sprite(0, 0, { image: "slider_panel" });
        this.addChild(this.background, 99);

        this.buttonOffsetX = 0;
        this.buttonOffsetY = 0;
        this.button = new me.Sprite(this.buttonOffsetX, this.buttonOffsetY, { image: "slider_knobbin" });
        this.addChild(this.button, 100);

        this.valueText = new me.Text(this.width, 0, { font: game.GUI.font,
                                                      size: game.GUI.fontSize,
                                                      fillStyle: game.GUI.fontColor });
        this.addChild(this.valueText, 100);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = (maxValue - minValue) / 2 + minValue;

        // this.connectedIconBar = this.connectedIconBarRatio = null;
        this.connectedBars = [];
        this.connectedBarRatios = [];

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
        this.updateConnections();
        this.updateGraphics();
    },

    getValue: function() {
        return Math.round(this.value);
    },

    connectBar: function(bar, ratio) {
        this.connectedBars.push(bar);
        this.connectedBarRatios.push(ratio);
        this.setValue(this.value);
    },

    updateConnections: function() {
        for (let i = 0; i < this.connectedBars.length; i++) {
            let barValue = this.connectedBars[i].setValue(this.value * this.connectedBarRatios[i]);
            this.value = barValue / this.connectedBarRatios[i];
            // this.updateText();
        }
    },

    updateGraphics: function() {
        let buttonX = this.buttonOffsetX + this.value / (this.maxValue - this.minValue) * this.width;
        this.button.pos.x = buttonX;
        this.valueText.setText(this.getValue());
    },

    onMove: function(event) {
        if (this.pointerDown) {
            this.setValue((event.gameX - this.pos.x) / this.width * (this.maxValue - this.minValue));
        }
    },

    // draw: function(renderer) {
    //     this._super(me.Container, "draw", [renderer]);
    //     renderer.setColor("#888888");
    //     renderer.fillRect(0, 18, this.width, 4);
    //     let sliderX = this.value / (this.maxValue - this.minValue) * this.width;
    //     renderer.setColor("#CCCCCC");
    //     renderer.fillEllipse(sliderX, 20, 10, 10);
    // },
});


game.GUI.IconBar = me.Container.extend({
    init: function(x, y, icon, maxValue) {
        this._super(me.Container, "init", [x, y]);
        this.anchorPoint = { x: 0, y: 0 };
        this.icon = icon;
        this.maxValue = maxValue;
        this.value = maxValue;
        this.icons = [];
        this.setValue(this.value);
    },

    setValue: function(value) {
        this.value = value;
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }
        if (this.value > this.icons.length) {
            // add icons
            for (let i = this.icons.length; i < value; i++) {
                this.icons.push(new me.Sprite(i * 3, 0, { image: this.icon }));
                this.addChild(this.icons[i]);
            }
        } else {
            // remove icons
            for (let i = this.icons.length - 1; i >= value; i--) {
                this.removeChild(this.icons.pop());
            }
        }
        return this.value;
    },

    getValue: function() {
        return Math.round(this.value);
    },
});


game.GUI.TextBar = me.Container.extend({
    init: function(x, y, maxValue) {
        this._super(me.Container, "init", [x, y]);
        this.anchorPoint = { x: 0, y: 0 };
        this.maxValue = maxValue;
        this.value = maxValue;
        this.color = "#FF0000";
        this.text = new me.Text(0, 0, { font: game.GUI.font,
                                        size: game.GUI.fontSize,
                                        fillStyle: game.GUI.fontColor });
        this.addChild(this.text);
        this.setValue(this.value);
    },

    setValue: function(value) {
        this.value = value;
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }
        this.text.setText(this.getValue());
        return this.value;
    },

    getValue: function() {
        return Math.round(this.value);
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
        this.addChild(this.text, 100);
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
