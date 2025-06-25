<template>
  <div style="height: 100vh; padding: 5px 10px;">
    <el-row style="height: 85%;">
      <el-col style="height: 100%;">
        <div class="chat_container" ref="scrollContainer">
          <div v-for="(message, index) in current_chat.messages" :key="index" class="chat_message"
            :class="message.role">
            <div class="bubble">
              {{ message.content }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="height: 15%;">
      <el-col style="height: 100%;">
        <div class="text_container">
          <textarea v-model="user_input" class="text_input" rows="5" placeholder="Enter发送，Shift+Enter换行"
            @keydown.enter="handleEnter" @keydown.shift.enter.stop></textarea>
        </div>
      </el-col>
    </el-row>
  </div>
</template>



<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import { current_chat, callModelWithSummary } from '@/modules/main_logic'

const user_input = ref("")

const handleEnter = async (event: KeyboardEvent) => {
  event.preventDefault()
  if (event.shiftKey) {
    user_input.value += '\n'
    return
  }
  console.log(current_chat.value)
  callModelWithSummary(user_input.value)
  user_input.value = ""
}
//转化为markdown格式
const md = new MarkdownIt({
  breaks: true,
  html: false,
  typographer: true
})

const toMarkdown = (text: string) => {
  return md.render(text)
}

const scrollContainer = ref<HTMLElement | null>(null)
//监听新的用户输入
watch(current_chat, async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
})
//监听新的模型流式输出
watch(
  () => current_chat.value.messages[current_chat.value.messages.length - 1]?.content,
  async () => {
    await nextTick()
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  }
)
</script>

<style scoped>
.el-row {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-col {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat_container {
  height: 100%;
  width: 50%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
}

.chat_message {
  display: flex;
  margin-bottom: 12px;
  max-width: 100%;
}

.chat_message.user {
  justify-content: flex-end;
}

.chat_message.assistant {
  justify-content: flex-start;
}

.bubble {
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 15px;
  background-color: #303030;
  color: white;
}

.chat_message.user .bubble {
  border-bottom-right-radius: 4px;
}

.chat_message.assistant .bubble {
  border-bottom-left-radius: 4px;
}

.text_container {
  height: 100%;
  padding: 10px;
  margin-top: 10px;
  width: 50%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.text_input {
  padding: 10px;
  background-color: #303030;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: medium;
  resize: none;
  outline: none;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica", "Arial", sans-serif;
}
</style>@/modules/main@/modules/main_logic