<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
</script>

<template>
   <Navbar />
   <RouterView v-slot="{ Component }">
      <Suspense>
         <template #fallback>
            <div class="text-size-20px text-center p-2 w-full">Yükleniyor</div>
         </template>
         <component :is="Component" />
      </Suspense>
   </RouterView>
</template>

<style lang="scss">
@use '/src/styles/global.scss';
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@200&display=swap');
</style>
