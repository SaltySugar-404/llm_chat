<template>
  <el-row>
    <el-col :span="24">
      <div class="scroll-container" ref="scrollContainer">
        <div class="bubble_container" v-for="(message, index) in chat" :key="index" :class="message.role">
          <span class="bubble" v-if="message.role == 'assistant'" v-html="toMarkdown(message.content)"></span>
          <span class="bubble" v-else>{{ message.content }}</span>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="text_input_container">
        <textarea v-model="user_input" class="text_input" rows="5" placeholder="Enter发送，Shift+Enter换行"
          @keydown.enter="handleEnter" @keydown.shift.enter.stop></textarea>
      </div>
    </el-col>
  </el-row>
</template>


<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import { callModel } from '@/modules/model'
import { history, type Message, appendMessage } from '@/modules/storage'

const chat = ref<Message[]>([]);
appendMessage(chat, 'system', 'System: 请你扮演特朗普与用户对话')
const user_input = ref("")

const handleEnter = async (event: KeyboardEvent) => {
  event.preventDefault()
  if (event.shiftKey) {
    user_input.value += '\n'
    return
  }
  callModel(chat, user_input.value)
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
watch(chat, async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
})
//监听新的模型流式输出
watch(
  () => chat.value[chat.value.length - 1]?.content,
  async () => {
    await nextTick()
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  }
)
</script>

<style scoped>
.scroll-container {
  top: 0;

  height: calc(100vh - 160px);

  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.bubble_container {
  margin: auto;

  display: flex;
  width: 50%;
}

.bubble {
  max-width: 80%;
  width: fit-content;

  padding: 10px;
  margin-bottom: 10px;

  border-radius: 10px;
  color: white;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica", "Arial", sans-serif;
  font-size: medium;

  word-break: break-word;
  text-align: left;
}

.bubble:first-child {
  margin-top: 20px;
}

.user {
  justify-content: flex-end;
}

.user .bubble {
  background-color: #303030;
  text-align: left;
  white-space: pre-line;
}

.assistant,
.system {
  justify-content: flex-start;
}

.assistant .bubble,
.system .bubble {
  text-align: left;
}

.text_input_container {
  bottom: 0;

  height: 160px;
  width: 100%;

  display: flex;
  background-color: #1d1d1d;
}

.text_input {
  margin: auto;

  width: 50%;
  padding-top: 10px;
  padding-bottom: 10px;
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
</style>
../modules/chat.ts