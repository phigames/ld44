game.TransitioningSprite = me.Sprite.extend({
    init: function(x, y, image, tweenFrom, tweenTo) {
        this._super(me.Sprite, "init", [0, 0, { image: image,
                                                alpha: 0 }]);

        this.stillX = x;
        this.stillY = y;
        this.tweenFrom = tweenFrom;
        this.tweenTo = tweenTo;

        this.tweenInDistanceX  = tweenFrom === "left"  ? -100
                               : tweenFrom === "right" ? 100
                               : 0;
        this.tweenInDistanceY  = tweenFrom === "top"  ? -100
                               : tweenFrom === "bottom" ? 100
                               : 0;
        this.tweenOutDistanceX = tweenFrom === "left"  ? -100
                               : tweenFrom === "right" ? 100
                               : 0;
        this.tweenOutDistanceY = tweenFrom === "top"  ? -100
                               : tweenFrom === "bottom" ? 100
                               : 0;
    },

    appear: function() {
        this.pos.set(this.stillX + this.tweenInDistanceX,
                     this.stillY + this.tweenInDistanceY);
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
                     this.stillY);
        this.alpha = 0;

        new me.Tween(this.pos)
            .to({ x: this.stillX + this.tweenOutDistanceX,
                  y: this.stillY + this.tweenOutDistanceY },
                this.tweenDuration)
            .easing(me.Tween.Easing.Quadratic.Out)
            .start();

        new me.Tween(this)
            .to({alpha: 1}, this.tweenDuration)
            .easing(me.Tween.Easing.Quadratic.Out)
            .start();
    },
});
