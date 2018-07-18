// Start

class Start extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage() {
        var start = game_text.start;
        this.creatBg(start.img);
        start.picture.forEach(element => {
            this.creatImg(element);
        });

        console.log(a.d('a'));
        // var c = a.b('aa');

    }


    // 加载背景
    private creatBg(item) {
        RES.getResByUrl(item.url, function(texture:egret.Texture):void {
            var result:egret.Bitmap = new egret.Bitmap();
            result.texture = texture;
            this.addChildAt(result, 0);
        }, this, RES.ResourceItem.TYPE_IMAGE);
    }

    // 加载图片
    private creatImg(item) {
        RES.getResByUrl(item.img.url, function(texture:egret.Texture):void {
            var result:egret.Bitmap = new egret.Bitmap();
            result.texture = texture;
            result.x = item.x;
            result.y = item.y;
            result.width = item.width;
            result.height = item.height;
            this.addChildAt(result, 1);
            result.touchEnabled = true;
            result.addEventListener(egret.TouchEvent.TOUCH_END, function() {
                this.skip(item.type)
            }, this)
        }, this, RES.ResourceItem.TYPE_IMAGE);
    }

    // 跳转
    private skip(type) {
        console.log(type)
        switch (type) {
            // 开始游戏
            case 'start':
                const pageView = new Page();
                this.stage.addChild(pageView);
                this.stage.removeChild(this);
                break;
            // 链接跳转
            case 'link':
                this.parent.removeChild(this)
                break;
            // 读档案
            case 'readProgress':

                break;
            // 目录
            case 'catalog':

                break;
            default:
        }
    }
}
