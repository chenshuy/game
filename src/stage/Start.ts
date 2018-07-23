// 开始页面

class Start extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage() {
        var start = BS.data.start;

        BS.creatBg(start.img, this); // 创建背景图片

        // 创建图片组
        start.picture.forEach(data => {
            BS.creatImg(data, this);
        });
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
}
