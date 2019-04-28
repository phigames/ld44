game.TransitioningSprite = me.Sprite.extend({
    init: function(x, y, image,
                   tweenFrom, tweenFromDistance,
                   tweenTo, tweenToDistance,
                   tweenAlpha) {
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
    },

    appear: function() {
        this.pos.set(this.stillX + this.tweenInDistanceX,
                     this.stillY + this.tweenInDistanceY,
                     0);
        this.alpha = 0;

        new me.Tween(this.pos)
            .to({ x: this.stillX,
                  y: this.stillY },
                this.tweenDuration)
            .easing(me.Tween.Easing.Quadratic.Out)
            .start();

        new me.Tween(this)
            .to({alpha: 1}, this.tweenDuration)
            .easing(me.Tween.Easing.Quadratic.Out)
            .start();
    },

    disappear: function() {
        this.pos.set(this.stillX,
                     this.stillY,
                     0);
        this.alpha = 1;

        new me.Tween(this.pos)
            .to({ x: this.stillX + this.tweenOutDistanceX,
                  y: this.stillY + this.tweenOutDistanceY },
                this.tweenDuration)
            .easing(me.Tween.Easing.Quadratic.Out)
            .start();

        new me.Tween(this)
            .to({ alpha: 0 }, this.tweenDuration)
            .easing(me.Tween.Easing.Quadratic.Out)
            .start();
    },
});


game.OscillatingSprite = me.Sprite.extend({
    init: function(x, y, image, oscillateX, oscillateY, oscillatePeriod) {
        this._super(me.Sprite, "init", [x, y, { image: image }]);
        this.anchorPoint = { x: 0, y: 0 };
        this.oscillateX = oscillateX;
        this.oscillateY = oscillateY;
        this.oscillatePeriod = oscillatePeriod;
        new me.Tween(this.pos)
            .to({ x: this.pos.x + this.oscillateX,
                  y: this.pos.y + this.oscillateY },
                this.oscillatePeriod)
            .easing(me.Tween.Easing.Quadratic.InOut)
            .repeat(Infinity)
            .yoyo(true)
            .start();
    },
});
