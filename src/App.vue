<template>
  <el-row>
    <el-col :span="4">
      <SideBar></SideBar>
    </el-col>
    <el-col :span="20">
      <ChatBar></ChatBar>
    </el-col>
  </el-row>

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
  background-color: #1d1d1d;
}
</style>
