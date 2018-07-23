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

    public skipIn = false;

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
        BS.loadImg('static/common/img/menu.png', function(texture:egret.Texture) {
            BS.btnMenu = new egret.Bitmap();
            BS.btnMenu.texture = texture;
            BS.btnMenu.width = 50;
            BS.btnMenu.height = 50;
            BS.btnMenu.x = this.stage.stageWidth - 70;
            BS.btnMenu.y = 20;
            this.stage.addChild(BS.btnMenu);
            BS.btnMenu.touchEnabled = true;
            BS.btnMenu.addEventListener(egret.TouchEvent.TOUCH_TAP, function(Event) {
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
        // 判断是否选项场景
        if(this.isChoice) {
            this.choiceI++;
            if(this.choiceI < this.choiceLen) {
                this.setPage(this.choiceData, this.choiceI);
            } else {
                this.isChoice = false;
                this.choiceI = undefined;
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
    private setPage(page, i) {
        this.clearChild();
        this.texts = [];
        let pi = page[i];
        // 背景
        if(pi.img) {
            this.creatBg(pi.img);
        }
        // 图片
        if(pi.picture && pi.picture.length) {
            pi.picture.forEach(data => {
                this.creatImg(data);
            });
        }
        // 文本
        if(pi.texts && pi.texts.length) {
            pi.texts.forEach(data => {
                this.creatText(data);
            });
        }
        // 选项
        if(pi.choice) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            this.choice(pi.choice);
        }
    }

    // 清除模块
    private clearChild() {
        this.$children.forEach(data => {
            this.removeChild(data);
        });
        this.$children = [];
    }

    // 加载背景
    private creatBg(item) {
        BS.loadImg(item.url, function(texture:egret.Texture) {
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
        }, this);
    }

    // 加载图片
    private creatImg(item) {
        BS.loadImg(item.img.url, function(texture:egret.Texture):void {
            var result:egret.Bitmap = new egret.Bitmap();
            result.texture = texture;
            result.x = item.x;
            result.y = item.y;
            result.width = item.width;
            result.height = item.height;
            result.touchEnabled = true;
            result.addEventListener(egret.TouchEvent.TOUCH_END, function() {
                // const pageView = new Page();
                // this.stage.addChild(pageView);
                // this.stage.removeChild(this);
            }, this);
            this.addChildAt(result, 1);
            if(item.effect && item.effect.duration !== 0) {
                this.tweenBg(item.duration, item.delay, item.effect, result)
            }
        }, this);
    }

    // 文本
    private creatText(item) {
        let content = item.text.content;
        // 文本背景
        let resComplate = (texture) => {
            var result:egret.Bitmap = new egret.Bitmap();
            result.texture = texture;
            result.x = item.x;
            result.y = item.y;
            result.width = item.width;
            result.height = item.height;

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
            this.addChildAt(result, 2);
            this.addChildAt(text, 3);
            this.texts.push(text);
        }
        BS.loadImg(item.img.url, resComplate, this);
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
            BS.loadImg(data.img.url, function(texture:egret.Texture):void {
                // 背景
                var bgImg = new egret.Bitmap();
                bgImg.texture = texture;
                bgImg.x = item.x;
                bgImg.y = item.y;
                bgImg.width = item.width;
                bgImg.height = item.height;
                this.addChildAt(bgImg, 4);
                bgImg.touchEnabled = true;
                bgImg.addEventListener(egret.TouchEvent.TOUCH_TAP, function(Event) {
                    console.log('choice');
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

    // 创建Bitmap对象
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}
