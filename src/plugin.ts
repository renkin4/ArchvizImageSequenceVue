import { App, createApp as _createApp } from 'vue'
import ImageSequence from './components/ImageSequence'
import PreloadAssets from './components/PreloadAssets';

export const YangAISPlugin = {
    install(app : App) : void{
        app.component('ImageSequence', ImageSequence);
        app.component('PreloadAssets', PreloadAssets);
    }
}


export function createApp(params: any): App {
    return _createApp(params).use(YangAISPlugin);
}
