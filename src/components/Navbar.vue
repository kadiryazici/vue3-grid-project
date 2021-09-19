<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import { Transition } from 'vue';
import { useMainStore } from '/src/stores/mainStore';
import LightModeIcon from 'virtual:icons/icon-park-outline/brightness';
import DarkModeIcon from 'virtual:icons/icon-park-outline/dark-mode';

const mainStore = useMainStore();
</script>

<template>
   <div id="navbar-wrapper">
      <div id="navbar">
         <!-- LINKS -->
         <span class="links">
            <RouterLink class="navbar-link" to="/">Vue + Fetch</RouterLink>
            <RouterLink class="navbar-link" to="/datasource">Data Source</RouterLink>
         </span>
         <!-- ICONS -->
         <span class="icons">
            <span role="button" @click="mainStore.toggleDark" class="icon">
               <Transition mode="out-in" enterActiveClass="AnimInIcon" leaveActiveClass="AnimOutIcon">
                  <DarkModeIcon v-if="mainStore.isDarkMode" />
                  <LightModeIcon v-else />
               </Transition>
            </span>
         </span>
      </div>
   </div>
</template>

<style lang="scss" scoped>
@include forDark {
   #navbar-wrapper {
      @apply bg-dark-900;
   }
}

#navbar-wrapper {
   @apply z-999 flex  bg-white box-border px-3 fixed top-0 left-0 w-full;
   box-shadow: vars.$navbarShadow;
   #navbar {
      @apply z-999 flex items-center justify-between  box-border px-3 w-full max-w-850px mx-auto;
      height: vars.$navbarHeight;
      .navbar-link {
         @apply transition-colors duration-300;
         @apply no-underline rounded-md text-[var(--color-accent)] text-size-15px px-2 font-bold py-1;
         @apply hover:(opacity-50);
         &.router-link-exact-active {
            @apply rounded-md text-white  shadow bg-[var(--color-accent)];
         }
      }

      .icons {
         // @apply overflow-hidden;
         .icon {
            @apply text-size-20px text-[var(--color-accent)] cursor-pointer overflow-hidden inline-block;
         }
      }
   }
}

@keyframes AnimInRight {
   0% {
      transform: translateX(105%);
   }
   100% {
      transform: translateX(0%);
   }
}
@keyframes AnimOutLeft {
   0% {
      transform: translateX(0%);
   }
   100% {
      transform: translateX(-105%);
   }
}

.AnimInIcon {
   animation: AnimInRight 0.2s;
}
.AnimOutIcon {
   animation: AnimOutLeft 0.2s;
}
</style>
