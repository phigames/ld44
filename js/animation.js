game.TransitioningSprite = me.Sprite.extend({
    init: function(x, y, image, tweenFrom, tweenTo, tweenAlpha) {
        this._super(me.Sprite, "init", [0, 0, { image: image, alpha: 0 }]);

        this.stillX = x;
        this.stillY = y;
        this.tweenFrom = tweenFrom;
        this.tweenTo = tweenTo;
        if (typeof tweenAlpha === "undefined") {
            tweenAlpha = true;
        }
        this.tweenAlpha = tweenAlpha;

        this.tweenInDistanceX  = tweenFrom === "left"  ? -100
                               : tweenFrom === "right" ? 100
                               : 0;
        this.tweenInDistanceY  = tweenFrom === "top"  ? -100
                               : tweenFrom === "bottom" ? 100
                               : 0;
        this.tweenOutDistanceX = tweenTo === "left"  ? -100
                               : tweenTo === "right" ? 100
                               : 0;
        this.tweenOutDistanceY = tweenTo === "top"  ? -100
                               : tweenTo === "bottom" ? 100
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

    startTween: function(direction) {
        new me.Tween(this.pos)
            .to({ x: this.pos.x + this.oscillateX * direction,
                  y: this.pos.y + this.oscillateY * direction },
                this.oscillatePeriod)
            .easing(me.Tween.Easing.Quadratic.InOut)
            .onComplete(() => this.startTween(-direction))
            .start();
    },
});
