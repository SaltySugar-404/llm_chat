<template>
  <el-row><!-- 当前聊天 -->
    <el-col :span="24">
      <el-scrollbar>
        <div class="message" v-for="(message, index) in all_messages" :key="index" :class="message.role">
          <span class="bubble">{{ message.content }}</span>
        </div>
      </el-scrollbar>
    </el-col>
  </el-row>

  <el-row class="input-row">
    <el-col :span="24">
      <el-input v-model="user_input" type="textarea" :rows="3" @keydown.enter="handleEnter"></el-input>
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
.el-scrollbar {
  padding-bottom: 100px;
}

.message {
  display: flex;
  margin: 8px 0;
}

.user {
  justify-content: flex-end;
}

.user .bubble {
  background-color: #409EFF;
  color: white;
  text-align: left;
}

.assistant,
.system {
  justify-content: flex-start;
}

.assistant .bubble {
  background-color: #e6f7ff;
  color: black;
  text-align: left;
}

.system .bubble {
  background-color: #f5f5f5;
  color: black;
  font-style: italic;
}

.bubble {
  max-width: 60%;
  width: fit-content;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica", "Arial", sans-serif;
  padding: 10px 14px;
  border-radius: 12px;
  word-break: break-word;
  white-space: pre-wrap;
  text-align: left;
}

.input-row {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  padding: 10px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
