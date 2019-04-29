game.GUI = {
    font: 'ZCOOL KuaiLe',
    fontSize: 20,
    fontColor: "#000000",
    waterLevel: 0,
};


game.GUI.Button = me.Container.extend({
    init: function(x, y, image, onClick) {
        this._super(me.Container, "init", [x, y, 100, 50]);
        this.anchorPoint = { x: 0, y: 0 };
        this.sprite = new me.Sprite(0, 0, { image: image + "_unpressed" });
        this.sprite.anchorPoint = { x: 0, y: 0 };
        // this.text = new me.Text(this.width / 2, 10, { font: game.GUI.font,
        //                                               size: game.GUI.fontSize,
        //                                               fillStyle: game.GUI.fontColor,
        //                                               textAlign: "center" });
        this.addChild(this.sprite, 99);
        // this.addChild(this.text, 100);
        
        this.pointerOver = false;
        // me.input.registerPointerEvent("pointerenter", this, () => { this.pointerOver = true;
        //                                                             me.game.repaint(); });
        // me.input.registerPointerEvent("pointerleave", this, () => { this.pointerOver = false;
        //                                                             me.game.repaint(); });
        me.input.registerPointerEvent("pointerdown", this, onClick);
    },
});


game.GUI.Slider = me.Container.extend({
    init: function(x, y, minValue, maxValue) {
        this._super(me.Container, "init", [x, y, 219, 42]);
        this.anchorPoint = { x: 0, y: 0 };

        this.background = new me.Sprite(0, 0, { image: "slider_panel" });
        this.background.anchorPoint = { x: 0, y: 0 };
        this.addChild(this.background, 99);

        this.buttonOffsetX = 20;
        this.buttonOffsetY = 23;
        this.button = new me.Sprite(this.buttonOffsetX, this.buttonOffsetY, { image: "slider_knobbin_unpressed" });
        this.addChild(this.button, 100);

        // this.valueText = new me.Text(0, -25, { font: game.GUI.font,
        //                                               size: game.GUI.fontSize,
        //                                               fillStyle: game.GUI.fontColor });
        // this.addChild(this.valueText, 100);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = minValue;

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
        if (this.value < this.minValue) {
            this.value = this.minValue;
        } else if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }
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
            // stupid hack ahead!
            if (this.connectedBarRatios[i] == null) {
                // this is a leivBar!
                this.connectedBars[i].setValue(-this.getValue(), false);
            } else {
                // not a leivBar
                let barValue = this.connectedBars[i].setValue(this.getValue() * this.connectedBarRatios[i]);
                this.value = barValue / this.connectedBarRatios[i];
            }
            // this.updateText();
        }
    },

    updateGraphics: function() {
        let buttonX = this.buttonOffsetX + this.value / (this.maxValue - this.minValue || 1) * (this.width - 2 * this.buttonOffsetX);
        this.button.pos.x = buttonX;
        // this.valueText.setText(this.getValue());
    },

    onMove: function(event) {
        if (this.pointerDown) {
            this.setValue((event.gameX - this.pos.x - this.buttonOffsetX) / (this.width - 2 * this.buttonOffsetX) * (this.maxValue - this.minValue));
        }
    },
});


game.GUI.IconBar = me.Container.extend({
    init: function(x, y, icon, maxValue) {
        this._super(me.Container, "init", [x, y]);
        this.anchorPoint = { x: 0, y: 0 };
        this.icon = icon;
        this.maxValue = maxValue;
        this.value = maxValue;
        this.icons = [];
        this.initValue();
    },

    initValue: function() {
        this.setValue(this.value);
    },

    setValue: function(value, animate) {
        if (typeof animate === "undefined") {
            animate = false;
        }
        this.value = value;
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }
        
        this.updateGraphics(animate);

        return this.getValue();
    },

    getValue: function() {
        return Math.round(this.value);
    },

    updateGraphics: function(animate) {
        if (this.value > this.icons.length) {
            // add icons
            for (let i = this.icons.length; i < this.value; i++) {
                let newIcon = new game.TransitioningSprite(i * 3, 0, this.icon, "top", 20, "bottom", 20, 300, true);
                // let newIcon = new me.Sprite(i * 3, -20, { image: this.icon });
                this.icons.push(newIcon);
                this.addChild(newIcon, i);
                if (animate) {
                    newIcon.appear();
                } else {
                    newIcon.jumpToPosition();
                }
            }
        } else {
            // remove icons
            let lastI = this.icons.length - 1;
            for (let i = lastI; i >= this.getValue(); i--) {
                let oldIcon = this.icons.pop();
                //TODO cancel running tweens
                if (animate) {
                    oldIcon.disappear(() => this.removeChild(oldIcon), (-i + lastI) * 200);
                } else {
                    this.removeChild(oldIcon);
                }
            }
        }
    },
});


game.GUI.LeivIconBar = game.GUI.IconBar.extend({
    init: function(x, y, maxValue) {
        this._super(game.GUI.IconBar, "init", [x, y, "leiv", maxValue]);
    },

    initValue: function() {
        this.setValue(0);
    },

    setValue: function(value, animate) {
        if (typeof animate === "undefined") {
            animate = false;
        }
        this.value = game.playerData.leivNumber + value;

        this.updateGraphics(animate);

        return this.getValue();
    }
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
        this.addChild(this.text, 100);
        this.setValue(this.value);
    },

    setValue: function(value) {
        this.value = value;
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }
        this.text.setText("x " + this.getValue());
        return this.getValue();
    },

    getValue: function() {
        return Math.round(this.value);
    },
});


game.GUI.TextOverlay = me.Container.extend({
    init: function(x, y, text, color, small) {
        this._super(me.Container, "init", [x, y]);
        if (typeof color === "undefined") {
            color = null;
        }
        this.color = color;
        this.margin = 10;
        this.text = new me.Text(this.margin, this.margin, { font: game.GUI.font,
                                                            size: small ? 10 : game.GUI.fontSize,
                                                            fillStyle: game.GUI.fontColor,
                                                            text: text });
        this.addChild(this.text, 100);
        this.anchorPoint = { x: 0, y: 0 };
    },

    draw: function(renderer) {
        this.width = this.text.width + 2 * this.margin;
        this.height = this.text.height + 2 * this.margin;
        if (this.color !== null) {
            renderer.setColor(this.color);
            renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
            renderer.setColor("#000000");
            renderer.lineWidth = 1;
            renderer.strokeRect(this.pos.x + 0.5, this.pos.y + 0.5, this.width, this.height);
        }
        this._super(me.Container, "draw", [renderer]);
    },
});
