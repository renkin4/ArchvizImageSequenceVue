import { ComponentPublicInstance, defineComponent, h, inject, onMounted, onUnmounted, Ref, ref } from 'vue'
import { PreloadInjectKey } from './PreloadAssets';

interface ImageSequenceSetupInterface {
    imgDiv ?: Ref<HTMLDivElement | undefined>;
    imgSrc ?: Ref<string>;
    changeImage : (index ?: number) => void;
}

export interface ImageSequencePublicInterface extends ComponentPublicInstance, ImageSequenceSetupInterface {}

interface Vector2 {
    x: number;
    y: number;
}

export default defineComponent({
    name: 'ImageSequenceVue',
    props:{
        height : { type : String, default : '100' },
        width : { type : String, default : '100' },
        bindInputs  : Boolean,
    },
    inheritAttrs: false,
    setup(props, { attrs }) : ImageSequenceSetupInterface{
        let imgSrc = ref('');
        let loadedImages : HTMLImageElement[] = [];
        let currentImageIndex = 0;
        let preload = inject(PreloadInjectKey);
        let imgDiv = ref<HTMLDivElement>();
                
        let [startPointerTime, endPointerTime, swapImageTime] : number[] = [0, 99, 0];
        let startPointerPosition: Vector2 = { x: 0, y: 0 };
        let currentPointerPosition: Vector2 = { x: 0, y: 0 };
        let endPointerPosition: Vector2 = { x: 0, y: 0 };

        let swapImageTimeHandler : number | undefined = undefined;

        let dir : number = 0;

        let onFinishLoading = (allImages : HTMLImageElement[]) => {
            if(allImages.length <= 0){
                return;
            }

            loadedImages = allImages;
            imgSrc.value = allImages[0].src;
        }

        if(preload !== undefined){ 
            preload.finishLoading.push(onFinishLoading); 
        }
        else{
            console.error("Preload Assets Doesn't Exist For Image Sequence ");
        }

        let changeImage = (inDir? : number | undefined) => {
             if(inDir !== undefined){
                dir = inDir;
            }
            
            const loadImageLength = loadedImages.length;
            const newIndex = currentImageIndex + dir; 

            currentImageIndex = ((newIndex % loadImageLength) + loadImageLength ) % loadImageLength; 
            imgSrc.value = loadedImages[currentImageIndex].src;

        }

        let swapToNewImage = () => {
         

            let currentTime = new Date().getTime();
            if(startPointerTime < endPointerTime || currentTime < startPointerTime + 0.125){
                return;
            }
            
            swapImageTime = currentTime;
            changeImage();

            swapImageTimeHandler = setTimeout(() => {
                swapToNewImage();
            }, 1000/60);
        }

        let tryToSwapImage = () => {
            let currentTime = new Date().getTime();
            if(startPointerTime < endPointerTime || swapImageTime + 1000/60*1.5 > currentTime){
                return;
            }

            swapToNewImage();
        }

        let pointerDown = (event: TouchEvent | MouseEvent) => {
            event.preventDefault();
            startPointerTime = new Date().getTime();

            // @ts-ignore
            if (event.touches && event.touches.length > 0) {
            startPointerPosition.x = (<TouchEvent>event).touches[0].clientX;
            startPointerPosition.y = (<TouchEvent>event).touches[0].clientY;
            } else {
            startPointerPosition.x = (<MouseEvent>event).clientX;
            startPointerPosition.y = (<MouseEvent>event).clientY;
            } 

            if(swapImageTimeHandler !== undefined){
                clearInterval(swapImageTimeHandler);
                swapImageTimeHandler = undefined;
            }
        }
        let pointerMove = (event: TouchEvent | MouseEvent) => {
            // @ts-ignore
            if (event.touches && event.touches.length > 0) {
            currentPointerPosition.x = (<TouchEvent>event).touches[0].clientX;
            currentPointerPosition.y = (<TouchEvent>event).touches[0].clientY;
            } else {
            currentPointerPosition.x = (<MouseEvent>event).clientX;
            currentPointerPosition.y = (<MouseEvent>event).clientY;
            }  

            dir = Math.sign(currentPointerPosition.x - startPointerPosition.x);
            tryToSwapImage();
        }
        let pointerUp = (event: TouchEvent | MouseEvent) => {
            endPointerTime = new Date().getTime();

            // @ts-ignore
            if (event.touches && event.touches.length > 0) {
            endPointerPosition.x = (<TouchEvent>event).touches[0].clientX;
            endPointerPosition.y = (<TouchEvent>event).touches[0].clientY;
            } else {
            endPointerPosition.x = (<MouseEvent>event).clientX;
            endPointerPosition.y = (<MouseEvent>event).clientY;
            }

            if(swapImageTimeHandler !== undefined){
                clearTimeout(swapImageTimeHandler);
                swapImageTimeHandler = undefined;
            }
        } 

        let addListeners = () => {
            const imgDom : HTMLDivElement | undefined = imgDiv.value ?? undefined;
            if(!imgDom) return; 
            
            imgDom.addEventListener('mousedown', pointerDown);
            imgDom.addEventListener('mouseup', pointerUp);
            imgDom.addEventListener('mousemove', pointerMove) ;
            imgDom.addEventListener('touchstart', pointerDown);
            imgDom.addEventListener('touchmove', pointerMove);
            imgDom.addEventListener('touchend', pointerUp) ; 
        }

        let removeListeners = () => {
            const imgDom : HTMLDivElement | undefined = imgDiv.value ?? undefined;
            if(!imgDom) return;

            imgDom.removeEventListener('mousedown', pointerDown);
            imgDom.removeEventListener('mouseup', pointerUp);
            imgDom.removeEventListener('mousemove', pointerMove) ;
            imgDom.removeEventListener('touchstart', pointerDown);
            imgDom.removeEventListener('touchmove', pointerMove);
            imgDom.removeEventListener('touchend', pointerUp) ; 
        }

        onMounted(() => {
            if(props.bindInputs){ 
                addListeners();
            }
        });

        onUnmounted(() => {
            if(props.bindInputs)
                removeListeners();
        });

        return {
            imgDiv,
            imgSrc,
            changeImage,
        };
    },
    render() {
        return [
            h('div', 
                { 
                    class: 'image-wrapper',
                    ref: 'imgDiv',
                    style : `height:${this.height}%; width:${this.width}%`
                },
                [
                    h('img', 
                        { 
                            src : this.imgSrc,
                        }
                    )
                ]
            )
        ];
    }
});
 