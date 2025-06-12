<template>
  <div class="scroll-container" ref="scrollContainer">
    <div class="bubble_container" v-for="(message, index) in all_messages" :key="index" :class="message.role">
      <span class="bubble" v-html="toMarkdown(message.content)"></span>
    </div>
  </div>
  <div class="text_input_container">
    <textarea v-model="user_input" class="text_input" rows="5" @keydown.enter="handleEnter"
      @keydown.shift.enter.stop></textarea>
  </div>
</template>


<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import { all_messages, callModel } from '../utils/chat.ts'

const user_input = ref("")
const scrollContainer = ref<HTMLElement | null>(null)

//处理回车
const handleEnter = async (event: KeyboardEvent) => {
  event.preventDefault()
  if (event.shiftKey) {
    user_input.value += '\n'
    return
  }
  callModel(user_input.value)
  user_input.value = ""
  console.log(all_messages.value)
}

const md = new MarkdownIt({
  breaks: true,
  html: false,
  typographer: true
})
//转化为markdown格式
const toMarkdown = (text: string) => {
  return md.render(text)
}
//监听新的用户输入
watch(all_messages, async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
})
//监听新的模型流式输出
watch(
  () => all_messages.value[all_messages.value.length - 1]?.content,
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
  max-height: calc(100vh - 160px);
  overflow-y: scroll;
  padding-bottom: 160px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.bubble_container {
  display: flex;
  width: 50%;
  margin: auto;
}

.bubble {
  max-width: 80%;
  width: fit-content;
  background-color: #303030;
  color: white;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica", "Arial", sans-serif;
  font-size: medium;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  word-break: break-word;
  text-align: left;
}

.user {
  justify-content: flex-end;
}

.user .bubble {
  text-align: left;
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
  position: fixed;
  bottom: 0;
  height: 160px;
  width: 100%;
  display: flex;
  background-color: #1d1d1d;
  padding-top: 10px;
}

.text_input {
  width: 50%;
  margin: auto;
  padding-top: 10px;
  padding-bottom: 10px;
  /* padding: 10px; */
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
