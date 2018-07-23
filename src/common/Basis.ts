class BS {

    constructor() {}

    static data = window.game_text || {}; // 存储配置

    static startView = new Start(); // 开始场景
    static pageView = new Page();   // 页面场景
    static recordsModule = new Records(); // 读档，存档
    static menuModule = new Menu(); // 菜单
    static catalogModule = new Catalog(); // 目录

    static isRead = true; // 是否读档

    static btnMenu: egret.Bitmap; // 菜单按钮

    // 加载图片
    static loadImg(url, callback, that) {
        var imgLoader:egret.ImageLoader = new egret.ImageLoader;
        imgLoader.once( egret.Event.COMPLETE, (evt:egret.Event) => {
            let texture = new egret.Texture();
                texture._setBitmapData(evt.currentTarget.data);
            callback.call(that, texture);
        }, that);
        imgLoader.load(url);
    }

    // 创建背景图片
    static creatBg(item, that) {
        this.loadImg(item.url, function(texture:egret.Texture):void {
            var result:egret.Bitmap = new egret.Bitmap();
            result.texture = texture;
            this.addChildAt(result, 0);
        }, that);
    }

    // 创建图片
    static creatImg(item, that, callback?) {
        this.loadImg(item.img.url, function(texture:egret.Texture):void {
            var result:egret.Bitmap = new egret.Bitmap();
            result.texture = texture;
            result.x = item.x;
            result.y = item.y;
            result.width = item.width;
            result.height = item.height;
            this.addChildAt(result, 1);
            result.touchEnabled = true;
            result.addEventListener(egret.TouchEvent.TOUCH_TAP, function(Event) {
                this.skip(item.type, result);
                Event.stopImmediatePropagation();
            }, this);
            callback && callback(result);
        }, that);
    }

    static getID() {
        var href = location.href;
        var indexw = href.indexOf('?') === -1 ? href.length : href.indexOf('?');
        var str = 'save' + href.substring(href.lastIndexOf('/') + 1, indexw);
        return 'saveh5103';
    }

}
