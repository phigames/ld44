game.PlayStage = me.Stage.extend({

    onResetEvent: function() {
        this.player = new me.Sprite(0, 0, {image: "test"});
        // me.game.world.addChild(this.player);
        me.game.world.reset();
        me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0)
        me.game.world.addChild(this.player);
        
        //The Setting of the Island
        this.currentInd = 0;
        this.islandArray = generateIslandArray();

        //The Init of a single island
        if (this.islandArray[this.currentInd] == 0) {
            this.currentIsl = new game.GoodIsland(this.currentInd)
        } else {
            this.currentIsl = new game.BadIsland(this.currentInd)
        }

        this.currentIsl.start(nextIsland);
        me.game.world.addChild(this.currentIsl);

    },

    lastIsland = function() {
        //TODO: Transition to end
        console.log('you know what? FUCK you')

    },

    nextIsland = function(){

        this.currentInd++

        me.game.world.removeChild(this.currentIsl)
        
        if (this.islandArray[this.currentInd] == 0) {
            this.currentIsl = new game.GoodIsland(this.currentInd)
        } else {
            this.currentIsl = new game.BadIsland(this.currentInd)
        }

        if (this.currentInd == this.islandArray.length) {
            this.currentIsl.start(lastIsland);
        } else {
            this.currentIsl.start(nextIsland);
        }

        me.game.world.addChild(this.currentIsl);

    },

    generateIslandArray = function() {
        // TODO: Randomizer 
        return [0,1,0,1,0,1];
    },


    onDestroyEvent: function() {

    },
    
});