import { App, createApp as _createApp } from 'vue'
import ImageSequenceVue from './components/ImageSequence.vue'
import PreloadAssets from './components/PreloadAssets';

export const YangAISPlugin = {
    install(app : App) : void{
        app.component('ImageSequenceVue', ImageSequenceVue);
        app.component('PreloadAssets', PreloadAssets);
    }
}


export function createApp(params: any): App {
    return _createApp(params).use(YangAISPlugin);
}
