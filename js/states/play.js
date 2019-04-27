game.PlayStage = me.Stage.extend({

    onResetEvent: function() {
        this.player = new me.Sprite(0, 0, {image: "test"});
        // me.game.world.addChild(this.player);
        me.game.world.reset();
        me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0)
        me.game.world.addChild(this.player);
        //TODO: AddChilde(Island),
        this.currentInd = 0

    },

    onDestroyEvent: function() {

    },
    
});