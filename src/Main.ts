//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        // this.load();
        this.stage.addChild(BS.startView);
    }

    private load() {
        var list = [
            'https://dc-platform.dianchu.com/dc_plat/h5/base/back-groud/indoor/n913ndpvmb.jpg',
            'https://dc-platform.dianchu.com/dc_plat/h5/base/back-groud/indoor/81hi9o3mll.jpg',
            'https://dc-platform.dianchu.com/dc_plat/h5/base/back-groud/indoor/qurx8tlr1z.png',
            'https://dc-platform.dianchu.com/dc_plat/h5/base/back-groud/indoor/14yo7raz9t.jpg'
        ]
        var imgLoader:egret.ImageLoader = new egret.ImageLoader;
        list.forEach((data) => {
            imgLoader.load(data);
        })
        console.log(imgLoader.data);
        // imgLoader.once( egret.Event.COMPLETE, (evt:egret.Event) => {
        //     console.log(evt);
        //     console.log(imgLoader.data);
        //     let texture = new egret.Texture();
        //         texture._setBitmapData(evt.currentTarget.data);
        //     console.log(texture);
        //     // console.log(imgLoader.data)
        // }, this);

    }

}
