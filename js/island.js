game.Island = me.Container.extend({
    init: function(difficulty) { },

    start: function(onDone) { }
});

game.GoodIsland = Island.extend({
    init: function(difficulty) {
        // generate attributes
    },

    start: function(onDone) {
        // blabla
        // update game.playerData
        onDone()
    }
});