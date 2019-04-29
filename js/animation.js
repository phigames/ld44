game.TransitioningSprite = me.Sprite.extend({
    init: function(x, y, image,
                   tweenFrom, tweenFromDistance,
                   tweenTo, tweenToDistance,
                   tweenDuration, tweenAlpha) {
        this._super(me.Sprite, "init", [0, 0, { image: image, alpha: 0 }]);
        this.anchorPoint = { x: 0, y: 0 };

        this.stillX = x;
        this.stillY = y;
        this.tweenFrom = tweenFrom;
        this.tweenTo = tweenTo;
        if (typeof tweenAlpha === "undefined") {
            tweenAlpha = true;
        }
        this.tweenAlpha = tweenAlpha;

        this.tweenInDistanceX  = tweenFrom === "left"  ? -tweenFromDistance
                               : tweenFrom === "right" ? tweenFromDistance
                               : 0;
        this.tweenInDistanceY  = tweenFrom === "top"  ? -tweenFromDistance
                               : tweenFrom === "bottom" ? tweenFromDistance
                               : 0;
        this.tweenOutDistanceX = tweenTo === "left"  ? -tweenToDistance
                               : tweenTo === "right" ? tweenToDistance
                               : 0;
        this.tweenOutDistanceY = tweenTo === "top"  ? -tweenToDistance
                               : tweenTo === "bottom" ? tweenToDistance
                               : 0;

        this.tweenDuration = tweenDuration;
    },

    jumpToPosition: function() {
        this.pos.x = this.stillX;
        this.pos.y = this.stillY;
        this.alpha = 1;
    },

    appear: function() {
        this.pos.x = this.stillX + this.tweenInDistanceX;
        this.pos.y = this.stillY + this.tweenInDistanceY;
        this.alpha = 0;

        new me.Tween(this.pos)
            .to({ x: this.stillX,
                  y: this.stillY },
                this.tweenDuration)
            .easing(me.Tween.Easing.Quadratic.Out)
            .start();

        if (this.tweenAlpha) {
            new me.Tween(this)
                .to({alpha: 1}, this.tweenDuration)
                .easing(me.Tween.Easing.Quadratic.Out)
                .start();
        }
    },

    disappear: function(remove) {
        if (typeof remove === "undefined") {
            remove = false;
        }
        this.pos.x = this.stillX;
        this.pos.y = this.stillY;
        this.alpha = 1;

        let tween = new me.Tween(this.pos)
            .to({ x: this.stillX + this.tweenOutDistanceX,
                  y: this.stillY + this.tweenOutDistanceY },
                this.tweenDuration)
            .easing(me.Tween.Easing.Quadratic.Out)
        if (remove) {
            tween.onComplete(() => this.ancestor.removeChild(this));
        }
        tween.start();

        if (this.tweenAlpha) {
            new me.Tween(this)
                .to({ alpha: 0 }, this.tweenDuration)
                .easing(me.Tween.Easing.Quadratic.Out)
                .start();
        }
    },
});


game.OscillatingSprite = me.Sprite.extend({
    init: function(x, y, image, oscillateX, oscillateY, oscillatePeriod) {
        this._super(me.Sprite, "init", [x, y, { image: image }]);
        this.anchorPoint = { x: 0, y: 0 };
        this.oscillateX = oscillateX;
        this.oscillateY = oscillateY;
        this.oscillatePeriod = oscillatePeriod;
        let phase = Math.random() * oscillatePeriod * 2;
        new me.Tween(this.pos)
            .to({ x: this.pos.x + this.oscillateX },
                this.oscillatePeriod)
            .easing(me.Tween.Easing.Sinusoidal.InOut)
            .repeat(Infinity)
            .yoyo(true)
            .start();
        new me.Tween(this.pos)
            .to({ y: this.pos.y + this.oscillateY },
                this.oscillatePeriod)
            .easing(me.Tween.Easing.Sinusoidal.InOut)
            .repeat(Infinity)
            .yoyo(true)
            .start();
    },
});
