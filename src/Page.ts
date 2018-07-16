// Page

class Page extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        var page = game_text.page;
        console.log(page);
        var indexPage = 0;
        this.creatBg(page.img[indexPage]);
        // start.picture.forEach(element => {
        //     this.creatImg(element);
        // });
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
}
