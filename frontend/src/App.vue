<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import ReaderLayout from '@/layouts/ReaderLayout.vue';
import StaffLayout from '@/layouts/StaffLayout.vue';
import BlankLayout from '@/layouts/BlankLayout.vue'; 

const route = useRoute();

const layout = computed(() => {
  if (route.meta.layout === 'staff') return StaffLayout;
  if (route.meta.layout === 'blank') return BlankLayout; 
  
  return ReaderLayout; 
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<style>
body { background-color: #f8f9fa; }
</style>