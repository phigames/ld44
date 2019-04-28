game.Island = me.Container.extend({
    init: function(difficulty) {
        this._super(me.Container, "init");
        this.foodLossOrGain = 0;
        this.leivLoss = 0;
        this.claimedFood = 0;
    },
    start: function(onDone) { }
});


game.GoodIsland = game.Island.extend({
    init: function(difficulty) {
        this._super(game.Island, "init");        
        this.exchangeRate = 1; //one Food per Leiv
        this.numberFood = 20;
        console.log("that is a good island");
        this.onDone = null;
        // Slider
        this.leivSlider = new game.GUI.Slider(300,200, 200, 0, game.playerData.leivNumber-1);
        this.foodSlider = new game.GUI.Slider(300,300, 200, 0, this.numberFood);
        this.foodSlider.connect(this.leivSlider, this.exchangeRate)

    },

    start: function(onDone) {
        this.onDone = onDone
        this.addChild(new game.GUI.Button(10, 10, 'böttn', this.onclickButt.bind(this)));
        this.addChild(this.leivSlider);
        this.addChild(this.foodSlider);        
    },

    onclickButt: function(){
        this.leivLoss = -(this.leivSlider.getValue());
        this.foodLossOrGain = this.foodSlider.getValue();
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
        this.numberFood = 20;
        this.numberPeople = 20;
        console.log('this is a bad island');
        this.onDone = null;
        //Slider
        this.leivSlider = new game.GUI.Slider(300,200,200,0, game.playerData.leivNumber-1);
        this.probSlider = new game.GUI.Slider(300,300, 200, 0, 1);
        let ratio = 1/(this.numberPeople + game.playerData.leivNumber);
        this.probSlider.connect(this.leivSlider, ratio);
    },
    
    start: function(onDone) { 
        // 'enter button' added 
        this.onDone = onDone;
        this.addChild(new game.GUI.Button(10, 10, 'böttn', this.onclickButt.bind(this)));
        this.addChild(this.leivSlider);
        this.addChild(this.probSlider);
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

        //var image = me.loader.getImage("island_placeholder");   
        //this.graphics = me.Sprite(200, 200,[
            //me.game.viewport.width / 2 - image.width / 2,
            //me.game.viewport.height - image.height - 20,
            //{ image : image }
        //] );