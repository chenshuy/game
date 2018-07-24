// 主页面

class Page extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public pageData; // page数据
    public pageI = 0;// 当前场景下标
    private pageLen; // 场景长度

    private choiceData; // 选项场景
    private choiceI = undefined;// 选项场景下标
    private choiceLen; // 选项场景长度

    private isChoice = false; // 是否选项场景

    private texts = []; // 文本组
    private sounds = []; // 存储音效
    public skipIn = false; // 判断是否从目录或存档跳转而来
    private music;

    private onAddToStage() {
        this.stage.frameRate = 60;
        this.pageData = BS.data.page;
        this.pageLen = this.pageData.length;
        this.menu();
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        !this.skipIn && this.setPage(this.pageData, this.pageI);
    }

    // 跳转场景
    public skip(data) {
        this.pageI = data.page - 1;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.onTouchTap();
    }

    // 菜单
    private menu() {
        BS.menuModule.visible = false;
        this.stage.addChildAt(BS.menuModule, 9);
        BS.loadImg('static/common/img/menu.png', (texture:egret.Texture) => {
            BS.btnMenu = new egret.Bitmap();
            BS.btnMenu.texture = texture;
            BS.btnMenu.width = 50;
            BS.btnMenu.height = 50;
            BS.btnMenu.x = this.stage.stageWidth - 70;
            BS.btnMenu.y = 20;
            this.stage.addChild(BS.btnMenu);
            BS.btnMenu.touchEnabled = true;
            BS.btnMenu.addEventListener(egret.TouchEvent.TOUCH_TAP, (Event) => {
                BS.menuModule.visible = true;
                BS.btnMenu.visible = false;
                Event.stopImmediatePropagation()
            }, this);
        }, this);
    }

    // 切换事件
    private onTouchTap() {
        // 判断文本是否读取完毕
        if(this.texts.length){
            for(var i = 0,len = this.texts.length;i<len;i++) {
                var item = this.texts[i];
                if(item.timer && item.timer.running) {
                    this.texts.forEach((data) => {
                        data.timer.stop();
                        data.text = data.textContent;
                    });
                    return false;
                }
            }
        }
        console.log()
        // 判断是否选项场景
        if(this.isChoice) {
            this.choiceI++;
            if(this.choiceI < this.choiceLen) {
                this.setPage(this.choiceData, this.choiceI);
            } else {
                this.isChoice = false;
                this.choiceI = undefined;
                this.choiceData = null;
                this.pageI++;
                this.setPage(this.pageData, this.pageI);
            }
        } else {
            this.pageI++;
            if(this.pageI < this.pageLen) {
                this.setPage(this.pageData, this.pageI)
            } else {
                this.pageI--;
                console.log('结束');
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            }
        }
    }

    // 渲染模块
    private async setPage(page, i) {
        this.clearChild();
        let pi = page[i];
        // 背景
        await this.creatBg(pi.img);
        // 图片
        if(pi.picture && pi.picture.length) {
            for (const key in pi.picture) {
                await this.creatImg(pi.picture[key]);
            }
        }
        // 文本
        if(pi.texts && pi.texts.length) {
            for (const key in pi.texts) {
                await this.creatText(pi.texts[key]);
            }
        }
        // 音频
        if(pi.sound && pi.sound.length) {
            pi.sound.forEach(data => {
                this.creatSound(data);
            });
        }
        // 选项
        if(pi.choice) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            this.choice(pi.choice);
        }
        this.loadNext();
    }

    // 加载背景
    private creatBg(item) {
        if(item) {
            return new Promise((resolve) => {
                BS.loadImg(item.url, (texture:egret.Texture) => {
                    var bgImg: egret.Bitmap = new egret.Bitmap();
                    bgImg.texture = texture;
                    var imgWidth = texture.textureWidth;
                    var imgHeight = texture.textureHeight;
                    var maxWidth = this.stage.stageWidth;
                    var maxHeight = this.stage.stageHeight;
                    if (maxWidth / maxHeight <= imgWidth / imgHeight) {
                        bgImg.width = maxWidth;
                        bgImg.height = maxWidth * (imgHeight / imgWidth);
                    } else {
                        bgImg.width = maxHeight * (imgWidth / imgHeight);
                        bgImg.height = maxHeight;
                    }
                    bgImg.x = this.stage.stageWidth/2;
                    bgImg.y = this.stage.stageHeight/2;
                    bgImg.anchorOffsetX = bgImg.width/2;
                    bgImg.anchorOffsetY = bgImg.height/2;
                    this.addChildAt(bgImg, 0);
                    item.effect && this.tweenBg(item.duration, item.delay, item.effect, bgImg);
                    resolve();
                }, this);
            })
        }
    }

    // 加载图片
    private creatImg(item) {
        if(item) {
            return new Promise((resolve) => {
                BS.loadImg(item.img.url, (texture:egret.Texture) => {
                    var result:egret.Bitmap = new egret.Bitmap();
                    result.texture = texture;
                    result.x = item.x;
                    result.y = item.y;
                    result.width = item.width;
                    result.height = item.height;
                    if(item.type) {
                        result.touchEnabled = true;
                        result.addEventListener(egret.TouchEvent.TOUCH_END, () => {
                            BS.pageView.skip({page: 0});
                        }, this);
                    }
                    this.addChildAt(result, 1);
                    if(item.effect && item.effect.duration !== 0) {
                        this.tweenBg(item.duration, item.delay, item.effect, result)
                    }
                    resolve();
                }, this);
            })
        }
    }

    // 文本
    private creatText(item) {
        let content = item.text.content;
        let promise = new Promise((resolve) => {
            // 文本背景
            if(item.img) {
                BS.loadImg(item.img.url, (texture) => {
                    var result:egret.Bitmap = new egret.Bitmap();
                    result.texture = texture;
                    result.x = item.x;
                    result.y = item.y;
                    result.width = item.width;
                    result.height = item.height;
                    this.addChildAt(result, 3);
                    resolve();
                }, this);
            } else {
                resolve();
            }
        });
        promise.then(() => {
            // 文本内容
            let text = new egret.TextField();
            text.fontFamily = item.style.font;
            text.textColor = this.setColor(item.style.color);
            text.lineSpacing = item.style.lineSpacing * 2;
            text.textAlign = item.style.alignH;
            text.verticalAlign = item.style.alignV;
            text.size = item.style.fontSize;
            text.x = item.x + item.text.offsetX;
            text.y = item.y + item.text.offsetX;
            text.width = item.width - item.text.offsetX * 2;
            text.height = item.height - item.text.offsetY * 2;
            if(item.read) {
                text.textContent = content;
                text.text = '';
                var timer = new egret.Timer(item.speed, content.length);
                timer.addEventListener(egret.TimerEvent.TIMER, timeFunc, this);
                timer.start();
                text.timer = timer;
                this.texts.push(text);
            } else {
                text.text = content;
            }
            let i = 1;
            function timeFunc() {
                if (i <= content.length) {
                    let txt = content.substring(0, i);
                    text.text = txt;
                    i++;
                }
            }
            this.addChildAt(text, 4);
        })
    }

    // 音频
    private creatSound(item) {
        var loop = item.loop ? 0 : 1;
        let delay = item.delay * 1000;
        var sound: egret.Sound = new egret.Sound();
        sound.addEventListener(egret.Event.COMPLETE, function loadOver(event: egret.Event) {
            setTimeout(() => {
                var channel:egret.SoundChannel = sound.play(0,loop);
                channel.volume = item.volume;
                if(item.type === 'sound') {
                    this.sounds.push(channel);
                } else {
                    this.music && this.music.stop();
                    this.music = channel;
                }
            }, delay);
        }, this);
        sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event: egret.IOErrorEvent) {
            console.log("loaded error!");
        }, this);
        sound.load(item.url + '?d=1');
    }

    // 预加载
    private loadNext() {
        var imgLoader:egret.ImageLoader = new egret.ImageLoader;
        let nextPage;
        if(this.choiceData) {
            nextPage = this.choiceData[this.choiceI + 1];
        } else {
            nextPage = this.pageData[this.pageI + 1];
        }
        if(nextPage) {
            imgLoader.load(nextPage.img.url + BS.size);
            if(nextPage.picture && nextPage.picture.length) {
                for (const key in nextPage.picture) {
                    imgLoader.load(nextPage.picture[key].img.url + BS.size);
                }
            }
        }
    }

    // 清除模块
    private clearChild() {
        this.texts = [];
        this.$children = [];
        this.sounds.forEach((data) => {
            data.stop();
        });
    }

    // 颜色转换
    private setColor(data) {
        var num = data.split('#')[1];
        var color = num.length === 3 ? (num + num) : num;
        return '0x' + color;
    }

    // 动画
    private tweenBg(duration, delay, effect, item) {
        var locW = this.stage.stageWidth;
        var locH = this.stage.stageHeight;
        var ease = egret.Ease.sineInOut;
        var duration2 = duration*1000;
        var delay2 = delay*1000;
        switch (effect) {
            case 'fadeIn':
                item.alpha = 0;
                delayFun.call(this, {alpha: 1});
                break;
            case 'slideInLeft':
                item.x -= locW;
                delayFun.call(this, {x: item.x + locW});
                break;
            case 'slideInRight':
                item.x += locW;
                delayFun.call(this, {x: item.x - locW});
                break;
            case 'slideInDown':
                item.y += locH;
                delayFun.call(this, {y: item.y - locH});
                break;
            case 'slideInUp':
                item.y -= locH;
                delayFun.call(this, {y: item.y + locH});
                break;
            case 'zoomOut':
                item.alpha = 0;
                item.scaleX = 1.5;
                item.scaleY = 1.5;
                delayFun.call({
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1
                });
                break;
            case 'zoomIn':
                item.alpha = 0;
                item.scaleX = 0.5;
                item.scaleY = 0.5;
                delayFun.call(this, {
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1
                });
                break;
            case 'rollIn':
                item.rotation = -100;
                item.x -= locW;
                delayFun.call(this, {
                    rotation: 0,
                    x: item.x + locW,
                });
                break;
            case 'shock':
                // item.x += 20;
                // egret.Tween.get( item, {loop: true} )
                //     .to( {
                //         x: locW/2 - 20,
                //     }, duration2, egret.Ease.bounceInOut)
                //     .call(()=> {
                //         console.log('over')
                //         item.x = locW/2;
                //     }, this);
                break;
        }

        function delayFun(data) {
            setTimeout (()=> {
                egret.Tween.get( item )
                    .to( data, duration2, ease)
                    .call(()=>{
                    }, this);
            }, delay2)
        }
    }

    // 选项
    private choice(data) {
        data.datas.forEach((item) => {
            BS.loadImg(data.img.url, (texture:egret.Texture) => {
                // 背景
                var bgImg = new egret.Bitmap();
                bgImg.texture = texture;
                bgImg.x = item.x;
                bgImg.y = item.y;
                bgImg.width = item.width;
                bgImg.height = item.height;
                this.addChildAt(bgImg, 4);
                bgImg.touchEnabled = true;
                bgImg.addEventListener(egret.TouchEvent.TOUCH_TAP, (Event) => {
                    this.isChoice = true;
                    this.choiceData = item.datas;
                    this.choiceI = 0;
                    this.choiceLen = item.datas.length;
                    this.setPage(this.choiceData, this.choiceI);
                    Event.stopImmediatePropagation();
                    this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
                }, this);
                // 文本
                let text = new egret.TextField();
                text.fontFamily = data.style.font;
                text.textColor = this.setColor(data.style.color);
                text.lineSpacing = data.style.lineSpacing * 2;
                text.textAlign = data.style.alignH;
                text.verticalAlign = data.style.alignV;
                text.size = data.style.fontSize;
                text.x = item.x + item.text.offsetX;
                text.y = item.y + item.text.offsetY;
                text.width = item.width - (item.text.offsetX*2);
                text.height = item.height - (item.text.offsetY*2);
                text.text = item.text.content;
                this.addChildAt(text, 5);
            }, this);

        });
    }
}
