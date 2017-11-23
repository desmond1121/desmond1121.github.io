/**
 * spriteGroup
 *
 * @example
 * new SpriteGroup(rect, effect, imgArr, [0,1,2,3,0,1,2,0,1,0], 2, 2500, 1, function(effect) {}).create();
 *
 */
function SpriteGroup(element, effect, img, imgOrderArr, frameNum, duration, times, func) {
    this.element = element;
    this.effect = effect;
    this.img = img;
    this.imgOrderArr = imgOrderArr;
    this.frameNum = frameNum;
    this.duration = duration;
    this.times = times;
    this.func = func;
}
SpriteGroup.prototype.create = function() {
    var element = this.element;
    var effect = this.effect
    var img = this.img;
    var imgOrderArr = this.imgOrderArr;
    var frameNum = this.frameNum;
    var duration = this.duration;
    // eslint-disable-next-line
    var times = this.times;
    var func = this.func;
    element.style.set('background-size', `${frameNum * 100}% 100%`);
    // eslint-disable-next-line
    element.style.set('background-image', 'url(' + img + ')');
    for (let i = 0; i < imgOrderArr.length; i++) {
        console.log('position: ' + (imgOrderArr[i] - 1) * 100 + '%');
        effect.css({
                // eslint-disable-next-line
                'background-position': '-' + (imgOrderArr[i] - 1) * 100 + '% 0'
                // 'background-position': '-' + (imgOrderArr[i] - 1) * 100 + '% 0'
            })
            .delay(duration / imgOrderArr.length)
            .loopAll(times);
        if (func) {
            func(i);
        }
        if (i !== imgOrderArr.length - 1) {
            effect.then();
        } else {
            effect.then()
                  .delay(duration / imgOrderArr.length)
                  .loopAll(times);
        }
    }
    return effect;
}
