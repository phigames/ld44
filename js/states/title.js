game.TitleStage = me.Stage.extend({

    onResetEvent: function() {
        me.game.world.reset();
        me.game.world.addChild(new me.Sprite(game.width / 2, game.height / 2, { image: "titlescreen" }));
        me.game.world.addChild(new game.GUI.Button(game.width / 2 - 24, game.height - 60, "start", () => me.state.change(me.state.PLAY)));
        me.audio.play("loop", true);
    },

    onDestroyEvent: function() {

    },
    
});
