game.Island = me.Container.extend({
    init: function(difficulty) {
        this._super(me.Container, "init", [290, 80]);
        this.anchorPoint = { x: 0, y: 0 };
        this.foodLossOrGain = 0;
        this.leivLoss = 0;
        this.claimedFood = 0;
        this.onDone = null;
        this.leivBar = new game.GUI.LeivIconBar(110,30, game.playerData.leivNumber);
        this.foodBar = new game.GUI.IconBar(110, 55, "food", game.playerData.foodNumber);
        me.game.world.addChild(this.leivBar, 100);
        me.game.world.addChild(this.foodBar, 100);
    },

    start: function(onDone) {
        this.onDone = onDone;
        // animation
        let targetX = this.pos.x;
        this.pos.x = this.pos.x + 300;
        new me.Tween(this.pos)
            .to({ x: targetX },
                500)
            .easing(me.Tween.Easing.Quadratic.Out)
            .start();
    },

    end: function() {
        me.game.world.removeChild(this.leivBar);
        me.game.world.removeChild(this.foodBar);
        this.onDone();
    },

    generateExchangeRate: function (level){
        if (level < 2){
            return 1
        } else if(level < 4){
            return 2
        } else{
            return 1
        }
    },

    generateFood: function (level){
        if (level < 2){
            return this.randomise(20,25)
        } else if (level < 4){
            return this.randomise(10,20)
        } else {
            return this.randomise(5,15)
        }
    },

    generateEnemies: function (level){
        if (level < 2){
            return this.randomise(5,10)
        } else if (level < 4){
            return this.randomise(1,10)
        } else {
            return this.randomise(5,10)
        }
    },

    randomise: function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
          
    },
});

game.GoodIsland = game.Island.extend({
    init: function(difficulty) {
        this._super(game.Island, "init");        
        this.exchangeRate = this.generateExchangeRate(difficulty); //one Food per Leiv
        //this.numberFood = this.generateFood(difficulty);
        console.log('generated Exchange Rate', this.exchangeRate )
        //console.log('generate Food', this.numberFood)
        console.log("that is a good island");
        // Slider
        this.leivSlider = new game.GUI.Slider(240, 210, 200, 0, game.playerData.leivNumber-1);
        this.button = new game.GUI.Button(10, 10, 'böttn', this.onclickButt.bind(this));

        // this stuff belongs to the island:
        this.addChild(new me.Sprite(0, 0, { image: "island", anchorPoint: { x: 0, y: 0 } }), 1)
        this.addChild(new me.Sprite(-50, -15, { image: "flag_left", anchorPoint: { x: 0, y: 0 } }), 2)
        this.addChild(new me.Sprite(-8, 15, { image: "food", anchorPoint: { x: 0, y: 0 } }), 3)
        this.addChild(new me.Sprite(20, 26, { image: "leiv", anchorPoint: { x: 0, y: 0 } }), 3)

        this.leivSlider.connectBar(this.leivBar, null);
        
        this.addChild(new game.GUI.TextOverlay(30,60,this.exchangeRate))

        // this stuff belongs to the game world:
        me.game.world.addChild(this.button, 100);
        me.game.world.addChild(this.leivSlider, 100);
    },

    start: function(onDone) {
        this._super(game.Island, "start", [onDone]);
    },

    onclickButt: function(){
        this.leivLoss = -(this.leivSlider.getValue());
        this.foodLossOrGain = this.leivSlider.getValue()*this.exchangeRate;
        //leivs for food
        game.playerData.leivNumber += this.leivLoss;
        //receive food
        game.playerData.foodNumber += this.foodLossOrGain;
        this.foodBar.setValue(game.playerData.foodNumber, true);
        console.log('LeivLoss:')
        console.log(this.leivLoss)
        console.log('foodLossOrGain:')
        console.log(this.foodLossOrGain)
        me.game.world.removeChild(this.button);
        me.game.world.removeChild(this.leivSlider);
        this.end();
    }
});


game.BadIsland = game.Island.extend({
    init: function(difficulty){
        this._super(game.Island, "init");
        this.numberFood = this.generateFood(difficulty);
        console.log('Food number generated', this.numberFood);
        this.numberPeople = this.generateEnemies(difficulty);
        console.log('Enemy number generated', this.numberPeople);
        console.log('this is a bad island');
        //Slider
        this.leivSlider = new game.GUI.Slider(240, 210, 200, 0, game.playerData.leivNumber - 1);
        this.button = new game.GUI.Button(10, 10, 'böttn', this.onclickButt.bind(this));

        this.leivSlider.connectBar(this.leivBar, null);

        // this stuff belongs to the island:
        this.addChild(new me.Sprite(0, 0, { image: "island", anchorPoint: { x: 0, y: 0 } }), 1)
        this.addChild(new me.Sprite(-50, -15, { image: "flag_left", anchorPoint: { x: 0, y: 0 } }), 2)
        this.addChild(new me.Sprite(70, -18, { image: "flag_right", anchorPoint: { x: 0, y: 0 } }), 2)
        this.addChild(new me.Sprite(-25, 25, { image: "evil_man", anchorPoint: { x: 0, y: 0 } }), 3)
        this.addChild(new me.Sprite(100, 14, { image: "food", anchorPoint: { x: 0, y: 0 } }), 3)

        this.addChild(new game.GUI.TextOverlay(30,60,this.numberPeople))
        this.addChild(new game.GUI.TextOverlay(80,60,this.numberFood))
        
        // this stuff belongs to the game world:
        me.game.world.addChild(this.button, 100);
        me.game.world.addChild(this.leivSlider, 100);
    },
    
    start: function(onDone) { 
        this._super(game.Island, "start", [onDone]);
        // 'enter button' added 
    },

    onclickButt: function(){
        this.fight()
        console.log('LeivLoss:')
        console.log(this.leivLoss)
        console.log('foodLossOrGain:')
        console.log(this.foodLossOrGain)
        me.game.world.removeChild(this.button);
        me.game.world.removeChild(this.leivSlider);
        this.end();
    },

    fight: function(){
        this.leivLoss = -(this.leivSlider.getValue());
        let pWinIsland = this.numberPeople/(this.numberPeople + this.leivLoss);
        let randNumber = Math.random();
        let winningParty = 0;
        if (randNumber > pWinIsland){
            winningParty = 1;
            console.log("you have won the fight");
        };
        game.playerData.leivNumber = game.playerData.leivNumber + this.leivLoss;
        // if fight is lost enemies get all food from island
        if (winningParty == 1){
            this.foodLossOrGain = this.numberFood;
            game.playerData.foodNumber = game.playerData.foodNumber + this.numberFood;
        }
        // make sure that enemies steel food if fight is lost
        else {
            this.foodLossOrGain = -(this.numberPeople * game.playerData.stealRate)
            // Make sure that not more food than usr has can be stolen
            game.playerData.foodNumber = game.playerData.foodNumber + this.foodLossOrGain;
            if (game.playerData.foodNumber < 0) {
                this.foodLossOrGain -= game.playerData.foodNumber;
                game.playerData.foodNumber = 0;
            }
            this.foodBar.setValue(game.playerData.foodNumber, true);
        };

    },








});
