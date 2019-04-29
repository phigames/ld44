game.Island = me.Container.extend({
    init: function(difficulty) {
        this._super(me.Container, "init", [290, 80 + game.GUI.waterLevel]);
        this.anchorPoint = { x: 0, y: 0 };
        this.foodLossOrGain = 0;
        this.leivLoss = 0;
        this.claimedFood = 0;
        this.onDone = null;
    },

    start: function(onDone) {
        this.onDone = onDone;
        // animation
        let targetX = this.pos.x;
        this.pos.x = this.pos.x + 300;
        new me.Tween(this.pos)
            .to({ x: targetX },
                700)
            .easing(me.Tween.Easing.Quadratic.Out)
            .start();
    },

    end: function() {
        new me.Tween(this.pos)
            .to({ x: -200 },
                1200)
            .easing(me.Tween.Easing.Quadratic.In)
            .onComplete(this.onDone)
            .start();
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
        this.leivSlider = new game.GUI.Slider(200, 215, 0, game.playerData.leivNumber-1);
        this.button = new game.GUI.Button(420, /*100*/212, 'trade', this.onclickButt.bind(this));

        // this stuff belongs to the island:
        this.addChild(new me.Sprite(0, 0, { image: "good_island", anchorPoint: { x: 0, y: 0 } }), 1)
        this.addChild(new me.Sprite(-50, -15, { image: "flag_left", anchorPoint: { x: 0, y: 0 } }), 2)
        this.addChild(new me.Sprite(-8, 22, { image: "food", anchorPoint: { x: 0, y: 0 } }), 3)
        this.addChild(new me.Sprite(20, 22, { image: "leiv", anchorPoint: { x: 0, y: 0 } }), 3)


        
        this.addChild(new game.GUI.TextOverlay(-35, 10, this.exchangeRate + "      /"))

        // this stuff belongs to the game world:
        this.leivSlider.connectBar(game.leivBar, null);
        this.leivTextBar = new game.GUI.TextBar(50, 110, game.playerData.leivNumber);
        this.leivSlider.connectBar(this.leivTextBar, 1);

        me.game.world.addChild(this.button, 100);
        me.game.world.addChild(this.leivSlider, 101);
        me.game.world.addChild(this.leivTextBar, 101);
    },

    onclickButt: function(){
        this.leivLoss = -(this.leivSlider.getValue());
        this.foodLossOrGain = this.leivSlider.getValue() * this.exchangeRate;
        //leivs for food
        game.playerData.leivNumber += this.leivLoss;
        //receive food
        game.playerData.foodNumber += this.foodLossOrGain;
        game.foodBar.setValue(game.playerData.foodNumber, true);
        console.log('LeivLoss:')
        console.log(this.leivLoss)
        console.log('foodLossOrGain:')
        console.log(this.foodLossOrGain)
        me.game.world.removeChild(this.button);
        me.game.world.removeChild(this.leivSlider);
        me.game.world.removeChild(this.leivTextBar);
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
        this.leivSlider = new game.GUI.Slider(240, 210, 0, game.playerData.leivNumber - 1);
        this.button = new game.GUI.Button(155, /*100*/80, 'fight', this.onclickButt.bind(this));

        this.leivSlider.connectBar(game.leivBar, null);

        // this stuff belongs to the island:
        this.addChild(new me.Sprite(0, 0, { image: "bad_island", anchorPoint: { x: 0, y: 0 } }), 1)
        this.addChild(new me.Sprite(-50, -15, { image: "flag_left", anchorPoint: { x: 0, y: 0 } }), 2)
        this.addChild(new me.Sprite(70, -18, { image: "flag_right", anchorPoint: { x: 0, y: 0 } }), 2)
        this.addChild(new me.Sprite(-25, 25, { image: "evil_man", anchorPoint: { x: 0, y: 0 } }), 3)
        this.addChild(new me.Sprite(95, 14, { image: "food", anchorPoint: { x: 0, y: 0 } }), 3)

        this.addChild(new game.GUI.TextOverlay(-5,15,"x " + this.numberPeople))
        this.addChild(new game.GUI.TextOverlay(110,10,"x " + this.numberFood))
        
        // this stuff belongs to the game world:
        this.leivTextBar = new game.GUI.TextBar(50, 110, game.playerData.leivNumber);
        this.leivSlider.connectBar(this.leivTextBar, 1);

        me.game.world.addChild(this.button, 100);
        me.game.world.addChild(this.leivSlider, 100);
        me.game.world.addChild(this.leivTextBar, 101);
    },
    
    onclickButt: function(){
        console.log('LeivLoss:')
        console.log(this.leivLoss)
        console.log('foodLossOrGain:')
        console.log(this.foodLossOrGain)
        me.game.world.removeChild(this.button);
        me.game.world.removeChild(this.leivSlider);
        me.game.world.removeChild(this.leivTextBar);
        this.fight()
    },

    fight: function(){
        console.log("fight");
        this.leivLoss = -(this.leivSlider.getValue());
        let pWinIsland = this.numberPeople / (this.numberPeople + this.leivLoss);
        let randNumber = Math.random();
        let winningParty = 0;
        // if (randNumber > pWinIsland){
        //     winningParty = 1;
        //     console.log("you have won the fight");
        // };
        game.playerData.leivNumber = game.playerData.leivNumber + this.leivLoss;
        me.audio.play("fight");
        game.delay(1000, () => {
            game.leivBar.setValue(0, true);
            this.onFightOver(randNumber > pWinIsland ? 1 : 0);
        });
    },

    onFightOver(winningParty) {
        console.log("fight over");
        
        console.log(game.playerData.foodNumber);
        // player won the fight -> player steals food
        if (winningParty == 1){
            this.foodLossOrGain = this.numberFood;
            game.playerData.foodNumber += this.numberFood;
            me.audio.play("win");
        }
        // player lost the fight -> enemies steal food
        else {
            this.foodLossOrGain = -(this.numberPeople * game.playerData.stealRate)
            // Make sure that not more food than usr has can be stolen
            game.playerData.foodNumber += this.foodLossOrGain;
            if (game.playerData.foodNumber < 0) {
                this.foodLossOrGain -= game.playerData.foodNumber;
                game.playerData.foodNumber = 0;
            }
            me.audio.play("die");
        }

        console.log(game.playerData.foodNumber);
        game.foodBar.setValue(game.playerData.foodNumber, true);

        game.delay(500, () => {
            this.end();
        });
    }
});
