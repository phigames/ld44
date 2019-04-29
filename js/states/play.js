
game.PlayStage = me.Stage.extend({

    init: function() {
        this._super(me.Stage, "init");
        this.tutorials = [
            /* Level 1 */
            [
                new game.GUI.TextOverlay(265, 7, "These island dwellers look like\nthey are not good cherries eating...\nHow many of your Leifs do you want\nto send to battle?", "#f4c047", true),
                new game.GUI.TextOverlay(7, 50, "↑ Number of Leifs and\n   amount of food on board.", "#f4c047", true),
                new game.GUI.TextOverlay(270, 170, "↑ This island has dwellers to fight\n   and food for you to win.", "#f4c047", true),
            ],
        ];
    },

    onResetEvent: function() {
        me.game.world.reset();
        //me.game.world.addChild(new me.ColorLayer("background", "#8888FF"), -1);
        me.game.world.addChild(new me.Sprite(240, 135, {image:'sky'}),0)

        // bars
        game.leivBar = new game.GUI.LeivIconBar(7, 7, game.playerData.leivNumber);
        game.foodBar = new game.GUI.IconBar(7, 30, "food", game.playerData.foodNumber);
        me.game.world.addChild(game.leivBar, 100);
        me.game.world.addChild(game.foodBar, 100);

        // tutorial
        this.tutorialTexts = [];

        //The Setting of the Island
        this.currentInd = 0;
        this.islandArray = this.generateIslandArray();

        //The Init of a single island
        if (this.islandArray[this.currentInd] == 0) {
            this.currentIsl = new game.GoodIsland(this.currentInd);
        }  
        else {
            this.currentIsl = new game.BadIsland(this.currentInd);
        }
        this.currentIsl.start(this.nextIsland.bind(this));
        me.game.world.addChild(this.currentIsl, 1.5);
        this.addTutorial(this.currentInd);

        let waves = [
            new game.OscillatingSprite(0, 130 + game.GUI.waterLevel, "water", -20, 0, 1500),
            new game.OscillatingSprite(-20, 150 + game.GUI.waterLevel, "water", 20, 0, 1500),
            new game.OscillatingSprite(-30, 170 + game.GUI.waterLevel, "water", -20, 0, 1500),
            new game.OscillatingSprite(-50, 190 + game.GUI.waterLevel, "water", 20, 0, 1500),
        ];
        for (let i = 0; i < waves.length; i++) {
            me.game.world.addChild(waves[i], i + 1);
        }

        let ship = new game.OscillatingSprite(0, 100 + game.GUI.waterLevel, "ship", 0, 10, 2000);
        me.game.world.addChild(ship);
        
        let scrollCoord = {'x':60, 'y':120};
        let scroll = new me.Sprite(scrollCoord['x'], scrollCoord['y'],{image:'scroll'});
        me.game.world.addChild(scroll);
      
        me.game.world.addChild(new me.Sprite(scrollCoord['x']-25, scrollCoord['y'],{image:'leiv'}));

        // island preview
        this.previewX = 300;
        this.previewY = 30;
        for (let i = 0; i < this.islandArray.length; i++) {
            let img;
            if (this.islandArray[i] === 0) {
                img = "good_island_icon";
            } else {
                img = "bad_island_icon";
            }
            me.game.world.addChild(new me.Sprite(this.previewX + i * 25, this.previewY, { image: img, anchorPoint: { x: 0, y: 0 } }), 200);
        }
        this.previewShip = new me.Sprite(0, this.previewY - 23, { image: "ship_icon", anchorPoint: { x: 0, y: 0 } });
        this.updatePreview();
        me.game.world.addChild(this.previewShip, 200);
    },

    updatePreview: function() {
        this.previewShip.pos.x = this.previewX + this.currentInd * 25;
    },

    removeTutorials: function() {
        for (let i = 0; i < this.tutorialTexts.length; i++) {
            me.game.world.removeChild(this.tutorialTexts[i]);
        }
        this.tutorialTexts = [];
    },

    addTutorial: function(index) {
        if (index < this.tutorials.length) {
            for (let i = 0; i < this.tutorials[index].length; i++) {
                let tut = this.tutorials[index][i];
                tut.text.fontSize = 10;
                this.tutorialTexts.push(tut);
                me.game.world.addChild(tut, 300);
            }
        }
    },

    lastIsland: function() {
        //TODO: Transition to end
        console.log('Congrats, you have arrived at the potato');

    },

    nextIsland: function(){
        let [leivLoss, foodLoss] = this.letLeivsEat();

        // update bars, play sounds
        if (foodLoss < 0) {
            game.foodBar.setValue(game.playerData.foodNumber, true);
            me.audio.play("eat");
        }
        if (leivLoss < 0) {
            game.delay(800, () => {
                game.leivBar.setValue(0, true);
                me.audio.play("starve");
            });
        }
        game.delay(1000, () => {
            this.startIsland();
        });

        console.log('People Died on the way:')
        console.log(leivLoss)
        console.log('Food eaten on the way:')
        console.log(foodLoss)
        console.log('nextIsland');
        if (game.playerData.leivNumber == 0) {
            console.log('you have lost the game');
            //me.state.set(me.state.PLAY, new game.PlayStage());
        } else {
            this.currentInd++

            me.game.world.removeChild(this.currentIsl);
            this.removeTutorials();
        }
        this.updatePreview();
    },

    startIsland: function() {
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
        me.game.world.addChild(this.currentIsl, 1.5);
        this.addTutorial(this.currentInd);
    },

    letLeivsEat: function(){
        let deadLeivs = 0;
        let x = 0;
        let fedLeivs = 0;
        //x number of leiv
        while (x < game.playerData.leivNumber){
            // if theres food for at least one Leiv
            if (game.playerData.foodNumber >= game.playerData.eatRate){
                // Subtract food one leiv eats
                game.playerData.foodNumber -= game.playerData.eatRate;
                fedLeivs++;
            } else {
                deadLeivs ++;
            };
            x++;
        };

        game.playerData.leivNumber -= deadLeivs;

        return [-(deadLeivs), -(fedLeivs*game.playerData.eatRate)]
    },

    generateIslandArray: function() {
        let sequences = [
            [1,0,1,0,0,1,0],
            [1,0,0,0,1,1,0],
            [1,0,0,1,1,0,0],
            [1,0,1,0,1,0,0]
        ]
        return sequences[Math.floor(Math.random() * sequences.length)];
    },


    onDestroyEvent: function() {

    },
    
    
});