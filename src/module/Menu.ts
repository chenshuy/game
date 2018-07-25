/**
 *  菜单
 * @class Menu
 * @extends {egret.Sprite}
 */
class Menu extends egret.Sprite {

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage() {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, (Event) => {
            Event.stopImmediatePropagation();
        }, this);
        var menu = BS.data.menu;
        // 创建背景图片
        BS.creatBg(menu.img, this);
        // 创建图片组
        menu.picture.forEach(data => {
            BS.creatImg(data, this);
        });
    }

    private skip(type) {
        switch (type) {
            case 'back':
                this.visible = false;
                BS.btnMenu.visible = true;
                break;
            case "saveProgress":
                this.visible = false;
                BS.isRead = false;
                this.stage.addChildAt(BS.recordsModule, 10);
                break;
            // 读档案
            case 'readProgress':
                this.visible = false;
                BS.isRead = true;
                this.stage.addChildAt(BS.recordsModule, 10);
                break;
            case "catalog":
                this.stage.addChildAt(BS.catalogModule, 10);
                this.visible = false;
                break;
            default:
        }
    }
}
