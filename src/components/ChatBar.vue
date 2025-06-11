<template>
  <el-row><!--当前聊天-->
    <el-col :span="24">
      <el-scrollbar>
        <div class="content" v-for="(message, index) in all_messages" :key="index">{{ message.role+": "+message.content }}</div>
      </el-scrollbar>
    </el-col>
  </el-row>
  <el-row><!--输入框-->
    <el-col :span="24">
      <el-input v-model="user_input" type="textarea" :rows="3" @keydown.enter="handleEnter" />
    </el-col>
  </el-row>


</template>

<script setup lang="ts">
import { ref } from 'vue'
import { all_messages, call_model } from '../scripts/chat.ts'
const user_input = ref("")

const handleEnter = async (event: KeyboardEvent) => {
  event.preventDefault()
  if (event.shiftKey) {
    user_input.value += '\n'
    return
  }
 call_model(user_input.value)
 user_input.value = ""
}
</script>

<style scoped>
.el-row {
  margin-bottom: 5px;
}

.el-col {
  border-radius: 5px;
}

.el-scrollbar {
  height: calc(100vh - 150px);
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
}

.content {
  max-width: 85%;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
  line-height: 1.5;
  background-color: bisque;
}

.content:has(+ .content[role="user"]),
.content[role="ai"] {
  background: #e0edff;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.content[role="user"] {
  background: #d1f0d7;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.content {
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center bottom;
}

.content-enter-active,
.content-leave-active {
  transition: all 0.3s;
}

.content-enter-from,
.content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.el-textarea {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-textarea :deep(.el-textarea__inner) {
  padding: 12px 16px;
  border-radius: 24px;
  min-height: 50px;
  resize: none;
}
</style>