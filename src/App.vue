<template>
  <div style="height: 100vh;overflow: hidden;">
    <el-row style="height: 100%;">
      <el-col :span="3">
        <SideBar></SideBar>
      </el-col>
      <el-col :span="21">
        <ChatBar></ChatBar>
      </el-col>
    </el-row>
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
