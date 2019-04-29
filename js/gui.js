game.GUI = {
    font: 'ZCOOL KuaiLe',
    fontSize: 20,
    fontColor: "#000000",
    waterLevel: 0,
};


game.GUI.Button = me.Container.extend({
    init: function(x, y, image, onClick) {
        this._super(me.Container, "init", [x, y, 47, 47]);
        this.anchorPoint = { x: 0, y: 0 };
        this.sprite = new me.Sprite(0, 0, { image: image + "_unpressed" });
        this.sprite.anchorPoint = { x: 0, y: 0 };
        this.spritePressed = new me.Sprite(0, 0, { image: image + "_pressed" });
        this.spritePressed.alpha = 0;
        this.spritePressed.anchorPoint = { x: 0, y: 0 };
        this.addChild(this.sprite, 100);
        this.addChild(this.spritePressed, 101);
        
        this.pointerOver = false;
        me.input.registerPointerEvent("pointerdown", this, onClick);
        me.input.registerPointerEvent("pointerenter", this, () => this.spritePressed.alpha = 1);
        me.input.registerPointerEvent("pointerleave", this, () => this.spritePressed.alpha = 0);
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
        this.buttonPressed = new me.Sprite(this.buttonOffsetX, this.buttonOffsetY, { image: "slider_knobbin_pressed" });
        this.buttonPressed.alpha = 0;
        this.addChild(this.button, 100);
        this.addChild(this.buttonPressed, 101);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = minValue;

        this.connectedBars = [];
        this.connectedBarRatios = [];

        this.setValue(this.value);

        this.pointerDown = this.pointerOver = false;
        me.input.registerPointerEvent("pointerdown", this, () => this.pointerDown = true);
        me.input.registerPointerEvent("pointerup", this, () => this.pointerDown = false);
        me.input.registerPointerEvent("pointerenter", this, () => this.buttonPressed.alpha = 1);
        me.input.registerPointerEvent("pointerleave", this, () => { this.buttonPressed.alpha = 0;
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
        }
    },

    updateGraphics: function() {
        let buttonX = this.buttonOffsetX + this.value / (this.maxValue - this.minValue || 1) * (this.width - 2 * this.buttonOffsetX);
        this.button.pos.x = this.buttonPressed.pos.x = buttonX;
    },

    onMove: function(event) {
        if (this.pointerDown) {
            this.setValue((event.gameX - this.pos.x - this.buttonOffsetX) / (this.width - 2 * this.buttonOffsetX) * (this.maxValue - this.minValue));
        }
    },
});


game.GUI.IconBar = me.Container.extend({
    init: function(x, y, icon, value) {
        this._super(me.Container, "init", [x, y]);
        this.anchorPoint = { x: 0, y: 0 };
        this.icon = icon;
        this.value = value;
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
    init: function(x, y, value) {
        this._super(game.GUI.IconBar, "init", [x, y, "leiv", value]);
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
    init: function(x, y, value) {
        this._super(me.Container, "init", [x, y]);
        this.anchorPoint = { x: 0, y: 0 };
        this.value = value;
        this.color = "#FF0000";
        this.text = new me.Text(0, 0, { font: game.GUI.font,
                                        size: game.GUI.fontSize,
                                        fillStyle: game.GUI.fontColor });
        this.addChild(this.text, 100);
        this.setValue(this.value);
    },

    setValue: function(value) {
        this.value = value;
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
                                                            size: small ? 12 : game.GUI.fontSize,
                                                            fillStyle: game.GUI.fontColor,
                                                            text: text });
        // if (small) {
        //     this.text.bold();
        // }
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
