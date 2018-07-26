/**
 * 公用变量、函数
 * @class BS
 */
class BS {

    constructor() { }

    static data = window.game_text || {}; // 存储配置

    static startView = new Start(); // 开始场景
    static pageView = new Page();   // 页面场景
    static recordsModule = new Records(); // 读档，存档
    static menuModule = new Menu(); // 菜单
    static catalogModule = new Catalog(); // 目录

    static isRead: boolean = true; // 是否读档

    static size: string = "?x-oss-process=image/resize,w_1080"; // oss尺寸

    static btnMenu: egret.Bitmap; // 菜单按钮

    // 加载图片
    static loadImg(url, callback, that) {
        const imgLoader: egret.ImageLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, (evt: egret.Event): void => {
            let texture = new egret.Texture();
            texture._setBitmapData(evt.currentTarget.data);
            callback.call(that, texture);
        }, that);
        imgLoader.load(url + this.size);
    }

    // 创建背景图片
    static creatBg(item, that) {
        this.loadImg(item.url, function (texture: egret.Texture): void {
            let result: egret.Bitmap = new egret.Bitmap();
            result.texture = texture;
            result.width = this.stage.stageWidth;
            result.height = this.stage.stageHeight;
            this.addChildAt(result, 0);
        }, that);
    }

    // 创建图片
    static creatImg(item, that, callback?) {
        this.loadImg(item.img.url, function (texture: egret.Texture): void {
            let result: egret.Bitmap = new egret.Bitmap();
            result.texture = texture;
            result.x = item.x;
            result.y = item.y;
            result.width = item.width;
            result.height = item.height;
            this.addChildAt(result, 1);
            result.touchEnabled = true;
            result.addEventListener(egret.TouchEvent.TOUCH_TAP, function (Event) {
                this.skip(item.type, result);
                Event.stopImmediatePropagation();
            }, this);
            callback && callback(result);
        }, that);
    }

    // 获取地址栏游戏id
    static getID(): string {
        const href = location.href;
        const indexw = href.indexOf('?') === -1 ? href.length : href.indexOf('?');
        let str = 'save' + href.substring(href.lastIndexOf('/') + 1, indexw);
        return str;
    }

    // 色值转换
    static setColor(data: any): number {
        let num = data.split('#')[1];
        let color = num.length === 3 ? (num + num) : num;
        return Number('0x' + color);
    }

    // 获取时间
    static getTime(): string {
        let now = new Date();
        let year = now.getFullYear(); // 年
        let month = now.getMonth() + 1; // 月
        let day = now.getDate(); // 日
        let hh = now.getHours(); // 时
        let mm = now.getMinutes(); // 分
        let check = (str): string => {
            str = str.toString();
            if (str.length < 2) {
                str = '0' + str;
            }
            return str;
        }
        return year + '/' + check(month) + '/' + check(day) + ' ' + check(hh) + ':' + check(mm);
    }
}
