game.PlayStage = me.Stage.extend({

    init: function(tutorial) {
        this._super(me.Stage, "init");
        if (typeof tutorial === "undefined") {
            tutorial = false;
        }
        this.tutorial = tutorial;
    },

    onResetEvent: function() {
        me.game.world.reset();
        me.game.world.addChild(new me.ColorLayer("background", "#8888FF"), 0);
        
        //The Setting of the Island
        this.currentInd = 0;
        this.islandArray = this.generateIslandArray();
        console.log(this.islandArray);
        

        //The Init of a single island
        if (this.islandArray[this.currentInd] == 0) {
            this.currentIsl = new game.GoodIsland(this.currentInd);
        }  
        else {
            this.currentIsl = new game.BadIsland(this.currentInd);
        }
        this.currentIsl.start(this.nextIsland.bind(this));
        me.game.world.addChild(this.currentIsl);

        this.ship = new game.OscillatingSprite(0, 100, "ship", 0, 10, 1000);
        me.game.world.addChild(this.ship);
        
        //this.leivBar = new game.GUI.iconBar(300, 300, 300, 100, "#FF8888");
        //me.game.world.addChild(this.leivBar);
    },

    lastIsland: function() {
        //TODO: Transition to end
        console.log('Congrats, you have arrived at the potato');

    },

    nextIsland: function(){
        let [leivLoss, foodLoss] = this.letLeivsEat()
        console.log('People Died on the way:')
        console.log(leivLoss)
        console.log('Food eaten on the way:')
        console.log(foodLoss)
        console.log('nextIsland');
        if (game.playerData.leivNumber==0) {
            console.log('you have lost the game');
            //me.state.set(me.state.PLAY, new game.PlayStage());
        } else {
            this.currentInd++

            me.game.world.removeChild(this.currentIsl);

            if (this.islandArray[this.currentInd] == 0) {
                this.currentIsl = new game.GoodIsland(this.currentInd);
            } else {
                this.currentIsl = new game.BadIsland(this.currentInd);
            }

            if (this.currentInd == this.islandArray.length) {
                this.currentIsl.start(this.lastIsland.bind(this));
            } else {
                this.currentIsl.start(this.nextIsland.bind(this));
            }
            me.game.world.addChild(this.currentIsl);
        }
    },

    letLeivsEat: function(){
        let deadLeivs = 0;        
        let x = 0;
        let fedLeivs = 0;
        //x number of leiv
        while (x < game.playerData.leivNumber){
            // if theres food for at least one Leiv
            if (game.playerData.foodNumber>=game.playerData.eatRate){
                // Subtract food one leiv eats
                game.playerData.foodNumber = game.playerData.foodNumber - game.playerData.eatRate;
                fedLeivs++;
            } else {
                deadLeivs ++; 
            };
            x++;
        };
        game.playerData.leivNumber = game.playerData.leivNumber-deadLeivs;
        return [-(deadLeivs), -(fedLeivs*game.playerData.eatRate)]
    },

    generateIslandArray: function() {
        let sequences = [
            [1,0,1]
        ]
        /*let sequences = [
            [1,0,0,1,0,1],
            [1,1,0,0,1,0],
            [0,1,1,0,0,1],
        ]*/
        return sequences[Math.floor(Math.random() * sequences.length)];
    },


    onDestroyEvent: function() {

    },
    
    
});