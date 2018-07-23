// 存档，读档

class Records extends egret.Sprite {

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.init, this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.vdata, this);
    }

    private record;

    private texts = [];

    private localData;

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
            if(item.type === 'save') {
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

    private skip(type, item) {
        switch (type) {
            case 'save':
                if(BS.isRead) {
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

    // 执行保存
    private save(item) {
        var time = this.getTime();
        let index = {
            page: BS.pageView.pageI
        }
        var data = this.localData ? this.localData : new Array(this.texts.length);
        data[item.biaoshi] = {
            time: time,
            index: index
        }
        localStorage.setItem(BS.getID(), JSON.stringify(data));
        this.vdata();
        BS.menuModule.visible = false;
        BS.btnMenu.visible = true;
        this.stage.removeChild(BS.recordsModule);
    }

    // 读取
    private read(item) {
        if(this.localData[item.biaoshi] && this.localData[item.biaoshi].index) {
            if(!BS.pageView.$hasAddToStage) {
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

    private getTime() {
        var now = new Date();
        var year = now.getFullYear(); // 年
        var month = now.getMonth() + 1; // 月
        var day = now.getDate(); // 日
        var hh = now.getHours(); // 时
        var mm = now.getMinutes(); // 分
        function check(str) {
            str = str.toString();
            if (str.length < 2) {
                str = '0' + str;
            }
            return str;
        }
        return year + '/' + check(month) + '/' + check(day) + ' ' + check(hh) + ':' + check(mm);
    }
}
