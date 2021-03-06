# Vue 3 + Typescript + Vite

This is vue component package. A very simple package that helps you setup a image sequence for architecture visualization purpose.  

I made this package to help myself setup image sequence quickers and cleaner.  

## Installation Guide 

### Node

```bash 
npm i archviz-is-vue
```

### Yarn 

```bash 
yarn add archviz-is-vue
```

--- 

### Setup Plugin in Vue

**main.js**

```typescript
import { YangAISPlugin } from 'archviz-is-vue';

app.use(YangAISPlugin);
```

example:
```typescript
import { createApp } from 'vue'
import App from './App.vue'

import { YangAISPlugin } from 'archviz-is-vue';

let app = createApp(App);
app.use(YangAISPlugin);
app.mount('#app');
```


## Usage

App.vue
```vue
<template>
<div class="wrapper">
  <PreloadAssets :assetsUrl="allImageUrl" @loading-progress="handleLoadingProgress" >
    <ImageSequence bindInputs/>
  </PreloadAssets>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
```

---

PS: I have yet explain all the usage of this component. I will be uploading a guide on how to hook all the events and some custom controls that exposed soon.