(function(win, doc, AFT) {
    window.onload = function() {
        var img = 'http://gw.alicdn.com/mt/TB1jm5wOXXXXXbvXpXXXXXXXXXX-23200-600.png';
        var imgOrderArr = [];
        var frameNum = 29;
        for (var j = 0; j < 10; j++) {
            for (var i = 1; i < 30; i++) {
                if (i > 23) {
                    if (Math.random() > 0.5) {
                        break;
                    }
                } 
                if (i === 1) {
                    if (Math.random() > 0.5) {
                        imgOrderArr.push(i);
                    }
                } else {
                    imgOrderArr.push(i);
                }
            }
        }
            

        var canvasElement = doc.getElementById('canvas');
        var aft = new AFT(canvasElement, '2d');
        aft.engine.setSize(1500);

        var scene = aft.createScene();

        var group = aft.createElement('group');
        scene.add(group);

        var element = aft.createElement('rectangle', 800, 600);
        group.add(element);

        var timelines = [];

        var effect = aft.createEffect();
        new SpriteGroup(element, effect, img, imgOrderArr, frameNum, 100 * imgOrderArr.length, Infinity).create(); 
        var animation = aft.createAnimation(element, effect);
        timelines.push(aft.createTimeline().add(animation, {
            playAt: 0
        }));

        var stats = new Stats();
        doc.body.appendChild(stats.dom);
        aft.play(scene, timelines)
            .on('play', function(delta, elapsed) {
                stats.update();
            });
    }
    
})(window, window.document, window.AFT);
