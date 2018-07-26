/**
 *  存档，读档
 * @class Records
 * @extends {egret.Sprite}
 */
class Records extends egret.Sprite {

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.init, this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.vdata, this);
    }

    private record;
    private texts = [];
    private localData; // 本地数据

    private init() {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, (Event) => {
            Event.stopImmediatePropagation();
        }, this);
        this.record = BS.data.record;
        // 创建背景图片
        BS.creatBg(this.record.img, this);
        // 创建图片组
        this.record.picture.forEach((data, index) => {
            BS.creatImg(data, this, (item) => {
                item.biaoshi = index;
            });
        });
        this.record.picture.forEach((item) => {
            if (item.type === 'save') {
                let text = new egret.TextField();
                text.text = '';
                text.textColor = 0xffffff;
                text.x = item.x + 140;
                text.y = item.y + 25;
                text.size = 24;
                text.lineSpacing = 10;
                this.addChild(text);
                this.texts.push(text);
            }
        });
    }

    // 更新数据
    private vdata() {
        this.localData = JSON.parse(localStorage.getItem(BS.getID()));
        this.localData && this.texts.forEach((data, index) => {
            let ldIndex = this.localData[index];
            if (ldIndex) {
                let page = ldIndex.index.page + 1;
                let time = ldIndex.time;
                data.text = '剧情 ' + page + '\n' + time;
            }
        });
    }

    // 执行保存
    private save(item) {
        const time = BS.getTime();
        let index = {
            page: BS.pageView.pageI
        }
        let data = this.localData ? this.localData : new Array(this.texts.length);
        data[item.biaoshi] = {
            time: time,
            index: index
        }
        localStorage.setItem(BS.getID(), JSON.stringify(data));
        this.vdata();
    }

    // 读取
    private read(item) {
        if (this.localData[item.biaoshi] && this.localData[item.biaoshi].index) {
            if (!BS.pageView.$hasAddToStage) {
                BS.pageView.skipIn = true;
                this.stage.addChildAt(BS.pageView, 1);
                this.stage.removeChild(BS.startView);
            } else {
                BS.menuModule.visible = false;
                BS.btnMenu.visible = true;
            }
            BS.pageView.skip(this.localData[item.biaoshi].index);
            this.stage.removeChild(this);
        }
    }

    private skip(type, item) {
        switch (type) {
            case 'save':
                if (BS.isRead) {
                    this.read(item);
                } else {
                    this.save(item);
                }
                break;
            case 'back':
                BS.menuModule.visible = true;
                this.stage.removeChild(BS.recordsModule);
                break;
            default:
        }
    }
}
