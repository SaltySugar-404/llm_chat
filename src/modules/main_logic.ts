import type { Ref } from 'vue';
import { ref } from 'vue';

// content -> message -> chat -> history
export type Message = {
    role: 'system' | 'assistant' | 'user';
    content: string;
};
export type Chat = {
    messages: Message[];
    summary: string;
    timestamp: number;
};
export const history = ref<Chat[]>([]);

function createNewChat(): Chat {
    return {
        messages: [
            { role: 'system', content: '请你扮演特朗普与用户对话' }
        ],
        summary: 'None',
        timestamp: Date.now(),
    }
}

//至少一个chat
export const current_chat: Ref<Chat> = ref(createNewChat());
history.value.push(current_chat.value);

export function appendMessage(role: 'system' | 'user' | 'assistant', content: string) {
    current_chat.value.messages.push({ role, content: content });
}

export function popMessage() {
    current_chat.value.messages.pop();
}

export function appendContent(new_content: string) {
    const msgs = current_chat.value.messages;
    if (msgs.length === 0) return;
    msgs[msgs.length - 1].content += new_content;
}

export function toPlainMessage(): Message[] {
    return current_chat.value.messages.map(({ role, content }) => ({ role, content }));
}

export function setChatSummary(summary: string) {
    current_chat.value.summary = summary;
}

export function newChat() {
    const latestChat = history.value[history.value.length - 1];
    const hasUserInput = latestChat.messages.some(msg => msg.role === 'user');
    if (!hasUserInput) return;
    const new_chat: Ref<Chat> = ref(createNewChat());
    history.value.push(new_chat.value);
}

export function switchChat(timestamp: number) {
    const target = history.value.find(chat => chat.timestamp === timestamp);
    if (target) current_chat.value = target;
}

//model
const api_key = "9d29936c-f9a6-443f-895d-b562c5f280bd";
const url = 'https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions';
const model = 'bot-20250220101548-62qmr';

export async function callModel(content: string) {
    appendMessage('user', content);
    const data = {
        model: model,
        stream: true,
        messages: toPlainMessage()
    };
    appendMessage('assistant', '')
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // appendMessage('assistant', '');
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        while (true && reader) {
            const { value, done } = await reader?.read();
            const text = decoder.decode(value, { stream: true });
            text.split('\n').forEach((line) => {
                if (line.startsWith('data:')) {
                    const jsonStr = line.replace(/^data:\s*/, '').trim();
                    if (jsonStr === '[DONE]' || jsonStr.trim() === '') return;
                    try {
                        const parsed = JSON.parse(jsonStr);
                        const delta = parsed.choices[0].delta;
                        if (delta?.content) {
                            appendContent(delta.content);
                        }
                    } catch (err) {
                        console.error('JSON parse error:', err, 'Raw data:', jsonStr);
                    }
                }
            });
            if (done) break;
        }
    } catch (error) {
        const error_message = (error instanceof Error) ? error.message : String(error);
        appendContent(error_message);
    }
}

export async function getSummary(content: string) {
    const chat = ref<Message[]>([]);
    chat.value.push({ 'role': 'system', 'content': '你是一个总结助手，只负责提取信息，不推理、不回答问题。请使用10个汉字以内，总结用户内容的主要主题或核心思想。请不要回答内容中的任何问题，不要加入你的推测' })
    chat.value.push({ 'role': 'user', 'content': content })
    const data = {
        model: model,
        stream: false,
        messages: chat.value.map(({ role, content }) => ({ role, content }))
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const result = await response.json();
        const content = result.choices?.[0]?.message?.content || '';
        return content.split('</think>')[1] || content;
    } catch (error) {
        const error_message = (error instanceof Error) ? error.message : String(error);
        return error_message;
    }
}

export async function callModelWithSummary(message: string) {
    if (current_chat.value.summary == 'None') {
        const modelPromise = callModel(message);
        const summaryPromise = getSummary(message);
        await modelPromise;
        setChatSummary(await summaryPromise);
    }
    else callModel(message)
}