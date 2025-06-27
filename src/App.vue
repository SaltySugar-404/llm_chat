<template>
  <div style="height: 100vh; overflow-x: auto; display: flex; min-width: 600px;overflow-y: hidden;overflow-x: hidden;">
    <div style="width: 12%; min-width: 200px; height: 100%;">
      <SideBar />
    </div>
    <div style="flex: 1;"></div>
    <div style="width: 50%; min-width: 400px; height: 100%;">
      <ChatBar />
    </div>
    <div style="flex: 1;"></div>
  </div>
</template>



<script setup lang="ts">
import ChatBar from '@/components/ChatBar.vue'
import SideBar from '@/components/SideBar.vue'
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
  background-color: #1d1d1d;
}
</style>
