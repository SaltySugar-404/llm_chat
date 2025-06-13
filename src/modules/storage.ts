import type { Ref } from 'vue'
import { ref } from 'vue'

//content->message->chat->history

export type Message = {
    role: "system" | "assistant" | "user";
    content: string;
};
export const history = ref<Message[][]>([]);

//chat
export function appendMessage(chat: Ref<Message[]>, role: 'system' | 'user' | 'assistant', content: string) {
    chat.value.push({ role, content });
}

export function popMessage(chat: Ref<Message[]>) {
    chat.value.pop();
}

export function appendContent(chat: Ref<Message[]>, new_content: string) {
    if (chat.value.length === 0) return;
    chat.value[chat.value.length - 1].content += new_content;
}

export function toPlainMessage(chat: Ref<Message[]>) {
    return chat.value.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
}

//hsitory
export function appendChat(chat: Ref<Message[]>) {
    history.value.push(chat.value);
}

export function deleteChat(index: number) {
    if (index >= 0 && index < history.value.length) {
        history.value.splice(index, 1);
    }
}

export function clearHistory() {
    history.value = [];
}