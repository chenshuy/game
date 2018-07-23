// 目录

class Catalog extends egret.Sprite {

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage() {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, (Event) => {
            Event.stopImmediatePropagation();
        }, this);
        var catalog = BS.data.catalog;
        // 创建背景图片
        BS.creatBg(catalog.img, this);
        // 创建图片组
        catalog.picture.forEach(data => {
            BS.creatImg(data, this);
        });
        this.setText();
    }

    private setText() {
        var content = new egret.DisplayObjectContainer();
        this.createConten(content);
        var myscrollView:egret.ScrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = 880;
        myscrollView.height = 400;
        myscrollView.x = this.stage.stageWidth / 2;
        myscrollView.y = this.stage.stageHeight / 2;
        myscrollView.anchorOffsetX = myscrollView.width / 2;
        myscrollView.anchorOffsetY = myscrollView.height / 2;
        this.addChild(myscrollView);
    }

    private createConten(content) {
        const arr = [];
        arr.length = BS.data.page.length;
        var j = 0;
        for (let i = 0; i < arr.length; i++) {
            let text = new egret.TextField();
            text.width = 88;
            text.height = 30;
            text.textAlign = 'center';
            text.verticalAlign = 'middle';
            text.size = 24;
            text.text = String(i+1);
            text.x = (i % 10) * 88;
            text.y = j*40;
            i%10 === 9 && j++;
            text.touchEnabled = true;
            text.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if(!BS.pageView.$hasAddToStage) {
                    BS.pageView.skipIn = true;
                    this.stage.addChildAt(BS.pageView, 1);
                    this.stage.removeChild(BS.startView);
                } else {
                    BS.menuModule.visible = false;
                    BS.btnMenu.visible = true;
                }
                BS.pageView.skip({page: i});
                this.stage.removeChild(this);
            }, this);
            content.addChild(text);
        }
    }

    private skip(type) {
        switch (type) {
            case 'back':
                BS.menuModule.visible = true;
                this.stage.removeChild(BS.catalogModule);
                break;
            default:
        }
    }
}
