game.StoryStage = me.Stage.extend({

    onResetEvent: function() {
        me.game.world.reset();
        me.game.world.addChild(new me.ColorLayer("background", "#DDDDDD"));
        let text = new me.Text(game.width / 2, 12, {
            font: game.GUI.font,
            size: 15,
            fillStyle: game.GUI.fontColor,
            textAlign: "center",
            text:
// 'You’re Leif, Leader of a Viking Tribe.\n\
// Food shortage makes your life tedious.\n\
// Together with other Leifs, you embark\n\
// on a journey to discover fertile lands.\n\
// You’re going encounter different islands,\n\
// and have to fight or trade with them.\n\
// Try to reach the fertile lands without\n\
// running out of Leifs or Food!'
"You are Leif (     ), Leader of a Viking Tribe.\n\
Food shortage makes your life tedious.\n\
Together with other Leifs (         ), you embark\n\
on a journey to discover fertile lands.\n\
You are going to encounter islands:\n\
Some Islanders have overcome their hunger\n\
by adopting cannibalism. There you can trade\n\
some of your Leifs for Food. Other islanders\n\
will try to end your Leifs. Sacrifice your Leifs\n\
in battle and conquer their food supplies.\n\
If you lose, they will do the same to you.\n\
Try to reach the fertile lands without\n\
running out of Leifs or Food!"
       });
       me.game.world.addChild(text);
       me.game.world.addChild(new me.Sprite(195, 18, { image: "leiv" }));
       me.game.world.addChild(new me.Sprite(288, 50, { image: "leiv" }));
       me.game.world.addChild(new me.Sprite(291, 50, { image: "leiv" }));
       me.game.world.addChild(new me.Sprite(294, 50, { image: "leiv" }));
       me.game.world.addChild(new me.Sprite(297, 50, { image: "leiv" }));
       me.game.world.addChild(new me.Sprite(300, 50, { image: "leiv" }));
       me.game.world.addChild(new game.GUI.Button(game.width / 2 - 24, game.height - 60, "start", () => me.state.change(me.state.PLAY)));
       me.audio.playTrack("loop");
   },

   onDestroyEvent: function() {

   },
   
});
