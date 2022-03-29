import { ComponentPublicInstance, defineComponent, h, InjectionKey } from "vue"; 
import { CallbackType } from "../utils/tools";

type FinishLoadingEvent = (allLoadedImages : HTMLImageElement[]) => void;
type LoadingProgressEvent =  (loadedImages : number) => void;
type VoidEvent = () => void;

export interface PreloadAssetsSetup { 
    assetLength?: number;
    allLoadedImages?: HTMLImageElement[];
    
    finishLoading : FinishLoadingEvent[];
    loadingProgress : LoadingProgressEvent[];
    startLoading : VoidEvent[];
}
 
export interface PreloadPublicInterface extends ComponentPublicInstance, PreloadAssetsSetup {} 
export const PreloadInjectKey: InjectionKey<PreloadPublicInterface> = Symbol('Preload');

/**
 * PreloadAssets component
 * Can be used to preload assets before the app is loaded
 * Can Pass Assets URL in Array form or pass a json file to load assets from json url
 * Priority is given to the assets passed in the array
 */
export default defineComponent({
    name: "PreloadAssets",
    props: {
        assetsUrl: { type: [String, Array], default : []},
        jsonUrl: String,
    },
    emits: ['finishLoading', 'loadingProgress', 'startLoading'],
    provide () {
        return {
            [PreloadInjectKey as symbol]: this,
        };
    },
    setup(props, {emit}) : PreloadAssetsSetup {
        const { assetsUrl, jsonUrl } = props;  // TODO load from Json URL if assets URL doesn't exist
        const assetLength : number = assetsUrl?.length ?? 0;

        const finishLoading : FinishLoadingEvent[] = [];
        const loadingProgress : LoadingProgressEvent[] = [];
        const startLoading : VoidEvent[] = [];

        let allLoadedImages: HTMLImageElement[] = [];

        let onImageLoaded = (e : Event, index : number) => {
            allLoadedImages[index] = (e.target as HTMLImageElement); 
            emit('loadingProgress', allLoadedImages.length / assetLength); 
            loadingProgress.forEach(cb => cb(allLoadedImages.length / assetLength));

            if(allLoadedImages.length >= assetLength){
                finishLoading.forEach(cb => cb(allLoadedImages));
                emit('finishLoading', allLoadedImages);  
            }
        }

        let preloadAssets = async () => { 
            for (let i = 0; i < assetLength; i++) { 
                const url = assetsUrl[i] as string;
                let image = new Image();
                image.src = url;

                image.onload = (e : Event) => { onImageLoaded(e, i); };
            }
        } 
        if(assetLength > 0){ 
            emit('startLoading');
            startLoading.forEach(cb => cb());

            preloadAssets();
        }   

        return {
            assetLength,
            allLoadedImages,
            finishLoading,
            loadingProgress,
            startLoading,
        }
    },
    methods: {
        
    },
    render() {
        return this.$slots.default ? this.$slots.default() : [];
    }
});