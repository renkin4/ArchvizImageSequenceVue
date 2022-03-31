<template> 
<div class="wrapper">
  <PreloadAssets :assetsUrl="allImageUrl" @loading-progress="handleLoadingProgress" >
    <ImageSequence bindInputs />
  </PreloadAssets>
</div>
</template>

<script setup lang="ts">  
import { ref } from 'vue';
import ImageSequence from './components/ImageSequence';
import PreloadAssets from './components/PreloadAssets';

let allImageUrl = ref<string[]>([]);


const GetImgURL = (index : number) => {
    return new URL(`./assets/sequence/podium_facility${index}.webp`, import.meta.url).href
}

for (let i = 1; i <= 90; i++) {
  // podium_facility1
  let url = GetImgURL(i);
  allImageUrl.value.push(url); 
}

let handleLoadingProgress = (progress : number) => {
  // console.log(`Loading progress: ${progress}%`);
}

</script>

<style>  
*{
  margin: 0;
  padding: 0;
}

.wrapper{
  height: 100vh;
}
</style>

