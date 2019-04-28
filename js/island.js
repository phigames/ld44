game.Island = me.Container.extend({
    init: function(difficulty) {
        this._super(me.Container, "init");
        this.foodLossOrGain = 0;
        this.leivLoss = 0;
        this.claimedFood = 0;
    },
    start: function(onDone) { },
    generateExchangeRate: function (level){
        if (level < 2){
            return 2
        } else{
            return 1
        }
    },
    generateFood: function (level){
        if (level < 2){
            return this.randomise(15,30)
        } else if (level < 4){
            return this.randomise(5,15)
        } else {
            return this.randomise(0,5)
        }
    },

    generateEnemies: function (){
        if (level < 2){
            return this.randomise(20,30)
        } else if (level < 4){
            return this.randomise(20,40)
        } else {
            return this.randomise(20,50)
        }
    },

    }
    randomise: function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
          
    },
});


game.GoodIsland = game.Island.extend({
    init: function(difficulty) {
        this._super(game.Island, "init");        
        this.exchangeRate = this.generateExchangeRate(difficulty); //one Food per Leiv
        this.numberFood = this.generateFood(difficulty);
        console.log('generated Exchange Rate', this.exchangeRate )
        console.log('generate Food', this.numberFood)
        console.log("that is a good island");
        this.onDone = null;
        // Slider
        this.leivSlider = new game.GUI.Slider(200, 220, 200, 0, game.playerData.leivNumber-1);
        this.foodBar = new game.GUI.IconBar(300,300, this.numberFood);
        //this.foodBar.connectIconBar(this.leivSlider, this.exchangeRate);
        this.leivSlider.connectIconBar(this.foodBar, this.exchangeRate);
        this.islandImage = new game.TransitioningSprite(290, 80, 'island', 'right', 300, 'left', 500, true)
        this.addChild(this.islandImage)
        this.islandImage.appear()
        this.flagLeft = new game.TransitioningSprite(298, 112, 'flag_left', 'right', 300, 'left', 500, true)
        this.addChild(this.flagLeft,2)
        this.flagLeft.appear()
    },

    start: function(onDone) {
        this.onDone = onDone
        this.addChild(new game.GUI.Button(10, 10, 'böttn', this.onclickButt.bind(this)));
        this.addChild(this.leivSlider);
        this.addChild(this.foodBar);        
    },

    onclickButt: function(){
        this.leivLoss = -(this.leivSlider.getValue());
        this.foodLossOrGain = this.foodBar.getValue();
        //leivs for food
        game.playerData.leivNumber = game.playerData.leivNumber + this.leivLoss;
        //receive food
        game.playerData.foodNumber = game.playerData.foodNumber + this.foodLossOrGain;
        console.log('LeivLoss:')
        console.log(this.leivLoss)
        console.log('foodLossOrGain:')
        console.log(this.foodLossOrGain)
        this.onDone()
    }
});


game.BadIsland = game.Island.extend({
    init: function(difficulty){
        this._super(game.Island, "init");
        this.numberFood = this.generateFood(difficulty);
        console.log('Food number generated', this.numberFood)
        this.numberPeople = 20;
        console.log('this is a bad island');
        this.onDone = null;
        //Slider
        this.leivSlider = new game.GUI.Slider(200, 220, 200, 0, game.playerData.leivNumber - 1);
        this.probBar = new game.GUI.IconBar(300,300, 1);
        let ratio = 1 / (this.numberPeople + game.playerData.leivNumber);
        //this.probBar.connectIconBar(this.leivSlider, ratio);
        this.leivSlider.connectIconBar(this.probBar,ratio);
        this.islandImage = new game.TransitioningSprite(290, 80, 'island', 'right', 300, 'left', 500, true);
        this.addChild(this.islandImage);
        this.islandImage.appear();
        this.flagLeft = new game.TransitioningSprite(298, 112, 'flag_left', 'right', 300, 'left', 500, true)
        this.addChild(this.flagLeft,2)
        this.flagLeft.appear()
        this.flagLeft = new game.TransitioningSprite(298, 112, 'flag_right', 'right', 300, 'left', 500, true)
        this.addChild(this.flagLeft,2)
        this.flagLeft.appear()
        
    },
    
    start: function(onDone) { 
        // 'enter button' added 
        this.onDone = onDone;
        this.addChild(new game.GUI.Button(10, 10, 'böttn', this.onclickButt.bind(this)));
        this.addChild(this.leivSlider);
        this.addChild(this.probBar);
    },

    onclickButt: function(){
        this.fight()
        console.log('LeivLoss:')
        console.log(this.leivLoss)
        console.log('foodLossOrGain:')
        console.log(this.foodLossOrGain)
        this.onDone()
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
            game.playerData.foodNumber = game.playerData.foodNumber + this.foodLossOrGain;
        };

    },







});
