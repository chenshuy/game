/**
 * 轮播场景页面
 * @class Page
 * @extends {egret.DisplayObjectContainer}
 */
class Page extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public pageData: Array<any>; // page数据
    public pageI: number = 0;// 当前场景下标
    private pageLen: number; // 场景长度

    private choiceData: Array<any>; // 选项场景
    private choiceI: number = undefined;// 选项场景下标
    private choiceLen: number; // 选项场景长度

    private isChoice: boolean = false; // 是否选项场景
    public skipIn: boolean = false; // 判断是否从目录或存档跳转而来

    private texts: Array<any> = []; // 文本组
    private values: Array<any> = []; // 存储数值
    private sounds: Array<any> = []; // 存储音效
    private tweens: number = 0; // 存储动画

    private music; // 音乐

    private loadComplate: number = 0;

    private onAddToStage() {
        this.pageData = BS.data.page;
        if (BS.data.value && BS.data.value.length) {
            BS.data.value.forEach(data => {
                this.values.push(data);
            });
        }
        this.values = BS.data.value;
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
        BS.loadImg('static/common/img/menu.png', (texture: egret.Texture) => {
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
        if(this.loadComplate !== 0) {
            return false;
        }
        // 判断动画是否完成
        if(this.tweens !== 0) {
            return false;
        }
        // 判断文本是否读取完毕
        if (this.texts.length) {
            let textsLen = this.texts.length;
            for (let i = 0; i < textsLen; i++) {
                const item = this.texts[i];
                if (item.timer && item.timer.running) {
                    this.texts.forEach((data) => {
                        data.timer.stop();
                        data.text = data.textContent;
                    });
                    return false;
                }
            }
        }
        // 判断是否选项场景
        if (this.isChoice) {
            this.choiceI++;
            if (this.choiceI < this.choiceLen) {
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
            if (this.pageI < this.pageLen) {
                this.setPage(this.pageData, this.pageI)
            } else {
                this.pageI--;
                console.log('结束');
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            }
        }
    }

    // 渲染模块
    private async setPage(page: any, i: number) {
        this.clearChild();
        let { img, picture, texts, sound, choice, value } = page[i];
        // 背景
        await this.creatBg(img);
        // 图片
        if (picture && picture.length) {
            for (const key in picture) {
                await this.creatImg(picture[key]);
            }
        }
        // 数值
        value && this.valueSet(value);
        // 文本
        if (texts && texts.length) {
            for (const key in texts) {
                await this.creatText(texts[key]);
            }
        }
        // 音频
        if (sound && sound.length) {
            sound.forEach(data => {
                this.creatSound(data);
            });
        }
        // 选项
        if (choice) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            this.choice(choice);
        }
        this.loadNext();
    }

    // 创建背景
    private creatBg(item) {
        if (item) {
            this.loadComplate++;
            return new Promise((resolve) => {
                BS.loadImg(item.url, (texture: egret.Texture) => {
                    const bgImg: egret.Bitmap = new egret.Bitmap();
                    bgImg.texture = texture;
                    const imgWidth = texture.textureWidth;
                    const imgHeight = texture.textureHeight;
                    const maxWidth = this.stage.stageWidth;
                    const maxHeight = this.stage.stageHeight;
                    if (maxWidth / maxHeight <= imgWidth / imgHeight) {
                        bgImg.width = maxWidth;
                        bgImg.height = maxWidth * (imgHeight / imgWidth);
                    } else {
                        bgImg.width = maxHeight * (imgWidth / imgHeight);
                        bgImg.height = maxHeight;
                    }
                    bgImg.x = this.stage.stageWidth / 2;
                    bgImg.y = this.stage.stageHeight / 2;
                    bgImg.anchorOffsetX = bgImg.width / 2;
                    bgImg.anchorOffsetY = bgImg.height / 2;
                    this.addChildAt(bgImg, 0);
                    this.loadComplate--;
                    item.effect && this.tweenImg(item.duration, item.delay, item.effect, bgImg);
                    resolve();
                }, this);
            })
        }
    }

    // 创建图片
    private creatImg(item) {
        if (item) {
            this.loadComplate++;
            return new Promise((resolve) => {
                BS.loadImg(item.img.url, (texture: egret.Texture) => {
                    const result: egret.Bitmap = new egret.Bitmap();
                    result.texture = texture;
                    result.x = item.x;
                    result.y = item.y;
                    result.width = item.width;
                    result.height = item.height;
                    if (item.type) {
                        result.touchEnabled = true;
                        result.addEventListener(egret.TouchEvent.TOUCH_END, () => {
                            BS.pageView.skip({ page: 0 });
                        }, this);
                    }
                    this.addChildAt(result, 1);
                    this.loadComplate--;
                    if (item.effect && item.effect.duration !== 0) {
                        this.tweenImg(item.duration, item.delay, item.effect, result)
                    }
                    resolve();
                }, this);
            })
        }
    }

    // 创建文本
    private creatText(item) {
        this.loadComplate++;
        let content = this.valueFilter(item.text.content);
        let promise = new Promise((resolve) => {
            // 文本背景
            if (item.img) {
                BS.loadImg(item.img.url, (texture) => {
                    const result: egret.Bitmap = new egret.Bitmap();
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
            text.textColor = BS.setColor(item.style.color);
            text.lineSpacing = item.style.lineSpacing * 2;
            text.textAlign = item.style.alignH;
            text.verticalAlign = item.style.alignV;
            text.size = item.style.fontSize;
            text.x = item.x + item.text.offsetX;
            text.y = item.y + item.text.offsetX;
            text.width = item.width - item.text.offsetX * 2;
            text.height = item.height - item.text.offsetY * 2;
            if (item.read) {
                text.textContent = content;
                text.text = '';
                const timer = new egret.Timer(item.speed, content.length);
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
            this.loadComplate--;
        })
    }

    // 创建音频
    private creatSound(item) {
        let loop = item.loop ? 0 : 1;
        const delay = item.delay * 1000;
        const sound: egret.Sound = new egret.Sound();
        sound.addEventListener(egret.Event.COMPLETE, function loadOver(event: egret.Event) {
            setTimeout(() => {
                const channel: egret.SoundChannel = sound.play(0, loop);
                channel.volume = item.volume;
                if (item.type === 'sound') {
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

    // 数值计算
    private valueSet(item) {
        this.values.forEach(function (that) {
            if (item.name === that.id) {
                switch (item.type) {
                    case ('equals'):
                        that.num = item.num;
                        break;
                    case ('add'):
                        that.num += item.num;
                        break;
                    case ('reduce'):
                        that.num -= item.num;
                        break;
                    case ('multiply'):
                        that.num *= item.num;
                        break;
                    case ('divide'):
                        that.num = item.num === 0 ? 0 : (that.num / item.num);
                        break;
                }
            }
        });
    }

    // 选项
    private choice(data) {
        data.datas.forEach((item) => {
            this.loadComplate++;
            BS.loadImg(data.img.url, (texture: egret.Texture) => {
                // 背景
                const bgImg = new egret.Bitmap();
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
                text.textColor = BS.setColor(data.style.color);
                text.lineSpacing = data.style.lineSpacing * 2;
                text.textAlign = data.style.alignH;
                text.verticalAlign = data.style.alignV;
                text.size = data.style.fontSize;
                text.x = item.x + item.text.offsetX;
                text.y = item.y + item.text.offsetY;
                text.width = item.width - (item.text.offsetX * 2);
                text.height = item.height - (item.text.offsetY * 2);
                text.text = item.text.content;
                this.addChildAt(text, 5);
                this.loadComplate--;
            }, this);

        });
    }

    // 数值字符转换
    private valueFilter(str) {
        let arr = str.split('\\sz');
        for (let i = 0; i < arr.length; i++) {
            if (i > 0) {
                let num = parseInt(arr[i].substring(1, 2));
                num--;
                if (this.values[num]) {
                    arr[i] = arr[i].replace(/\[(\d)\]/, this.values[num].num);
                } else {
                    arr[i] = arr[i].replace(/\[(\d)\]/, '');
                }
            }
        }
        return arr.join('');
    }

    // 预加载
    private loadNext() {
        const imgLoader: egret.ImageLoader = new egret.ImageLoader;
        let nextPage;
        if (this.choiceData) {
            nextPage = this.choiceData[this.choiceI + 1];
        } else {
            nextPage = this.pageData[this.pageI + 1];
        }
        if (nextPage) {
            imgLoader.load(nextPage.img.url + BS.size);
            if (nextPage.picture && nextPage.picture.length) {
                for (const key in nextPage.picture) {
                    imgLoader.load(nextPage.picture[key].img.url + BS.size);
                }
            }
        }
    }

    // 清除模块
    private clearChild() {
        this.texts = [];
        this.removeChildren();
        this.sounds.forEach((data) => {
            data.stop();
        });
    }

    // 动画
    private tweenImg(duration, delay, effect, item) {
        const locW = this.stage.stageWidth;
        const locH = this.stage.stageHeight;
        const ease = egret.Ease.sineInOut;
        const duration2 = duration * 1000;
        const delay2 = delay * 1000;
        let delayFun = (data) => {
            this.tweens++;
            setTimeout(() => {
                var tween = egret.Tween.get(item).to(data, duration2, ease).call(()=>{
                    this.tweens--;
                },this);
            }, delay2)
        }
        switch (effect) {
            case 'fadeIn':
                item.alpha = 0;
                delayFun({ alpha: 1 });
                break;
            case 'slideInLeft':
                item.x -= locW;
                delayFun({ x: item.x + locW });
                break;
            case 'slideInRight':
                item.x += locW;
                delayFun({ x: item.x - locW });
                break;
            case 'slideInDown':
                item.y += locH;
                delayFun({ y: item.y - locH });
                break;
            case 'slideInUp':
                item.y -= locH;
                delayFun({ y: item.y + locH });
                break;
            case 'zoomOut':
                item.alpha = 0;
                item.scaleX = 1.5;
                item.scaleY = 1.5;
                delayFun({
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1
                });
                break;
            case 'zoomIn':
                item.alpha = 0;
                item.scaleX = 0.5;
                item.scaleY = 0.5;
                delayFun({
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1
                });
                break;
            case 'rollIn':
                item.rotation = -100;
                item.x -= locW;
                delayFun({
                    rotation: 0,
                    x: item.x + locW,
                });
                break;
            case 'shock':
                item.x += 20;
                this.tweens++;
                setTimeout(() => {
                    egret.Tween.get(item).to({
                        x: item.x - 40
                    }, duration2 / 4, egret.Ease.bounceInOut).to({
                        x: item.x
                    }, duration2 / 4, egret.Ease.bounceInOut).to({
                        x: item.x - 40
                    }, duration2 / 4, egret.Ease.bounceInOut).to({
                        x: item.x
                    }, duration2 / 4, egret.Ease.bounceInOut).to({
                        x: item.x - 40
                    }, duration2 / 4, egret.Ease.bounceInOut).to({
                        x: item.x
                    }, duration2 / 4, egret.Ease.bounceInOut).to({
                        x: item.x - 20
                    }, duration2 / 4, egret.Ease.bounceInOut).call(()=>{
                        this.tweens--;
                    },this);
                }, delay2);
                break;
        }
    }
}
