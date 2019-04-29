game.StoryStage = me.Stage.extend({

    onResetEvent: function() {
        me.game.world.reset();
        me.game.world.addChild(new me.ColorLayer("background", "#DDDDDD"));
        me.game.world.addChild(new game.GUI.Button(game.width / 2 - 24, game.height - 60, "start", () => me.state.change(me.state.LOADING)));
        me.audio.play("loop", true);
    },

    onDestroyEvent: function() {

    },
    
});
