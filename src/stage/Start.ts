/**
 * 开始场景
 * @class Start
 * @extends {egret.DisplayObjectContainer}
 */
class Start extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage() {
        const start = BS.data.start;
        BS.creatBg(start.img, this); // 创建背景图片
        // 创建图片组
        start.picture.forEach(data => {
            BS.creatImg(data, this);
        });
        setTimeout(() => {
            this.loadCommon();
        },0);
    }

    // 跳转
    private skip(type) {
        switch (type) {
            // 开始游戏
            case 'start':
                this.stage.addChildAt(BS.pageView, 1);
                this.stage.removeChild(this);
                break;
            // 链接跳转
            case 'link':
                break;
            // 读档案
            case 'readProgress':
                this.stage.addChildAt(BS.recordsModule, 10);
                break;
            // 目录
            case 'catalog':
                this.stage.addChildAt(BS.catalogModule, 10);
                break;
            default:
        }
    }

    private loadCommon() {
        const imgLoader: egret.ImageLoader = new egret.ImageLoader;
        let {record, catalog} = BS.data;
        let load = (data) => {
            imgLoader.load(data.img.url + BS.size);
            for (let key in data.picture) {
                imgLoader.load(data.picture[key].img.url + BS.size);
            }
        }
        load(record);
        load(catalog);
    }
}
