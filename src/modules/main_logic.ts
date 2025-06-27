import type { Ref } from 'vue';
import { ref } from 'vue';
import { current_role, loadRole } from './role'

// content = message < chat < history
export type Message = {
    role: 'system' | 'assistant' | 'user';
    content: string;
};

export type Chat = {
    messages: Message[];
    role_name: string;
    summary: string;
    timestamp: number;
};
//可存储的聊天历史
export const history = ref<Chat[]>([]);

const default_role_name = 'Donald Trump'

//新建对话，基于当前角色
function createNewChat(role_name: string = default_role_name): Chat {
    loadRole(role_name);
    return {
        messages: [
            { role: 'system', content: current_role.value.prompt },
            { role: 'assistant', content: current_role.value.welcome }
        ],
        role_name: role_name,
        summary: '未命名',
        timestamp: Date.now(),
    }
}
//当前操作的chat
export const current_chat: Ref<Chat> = ref(createNewChat());

//对话存储
const LOCAL_STORAGE_KEY = 'chat_history';

function saveHistory() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history.value));
}

export function loadHistory() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            const parsed: Chat[] = JSON.parse(saved);
            history.value = parsed;
            current_chat.value = history.value[history.value.length - 1];
            console.log(current_chat)
        } catch (err) {
            console.error('历史记录解析失败:', err);
        }
    } else {
        history.value = [createNewChat()];
        current_chat.value = history.value[0];
    }
}

function updateTimestamp() {
    current_chat.value.timestamp = Date.now();
}

function getLatestChat(): Chat | undefined {
    return history.value.reduce((latest, chat) =>
        chat.timestamp > latest.timestamp ? chat : latest,
        history.value[0]
    );
}

export function newChat(role_name: string) {
    const latestChat = getLatestChat();
    if (!latestChat) return;
    const hasUserInput = latestChat.messages.some(msg => msg.role === 'user');
    if (!hasUserInput) return;
    const new_chat = createNewChat(role_name);
    history.value.push(new_chat);
    current_chat.value = new_chat
}

export function switchChat(timestamp: number) {
    const target = history.value.find(chat => chat.timestamp === timestamp);
    if (target) current_chat.value = target;
}

export function setChatSummary(summary: string) {
    current_chat.value.summary = summary;
    saveHistory();
}

export function deleteChat(timestamp: number) {
    const index = history.value.findIndex(chat => chat.timestamp === timestamp);
    if (index !== -1) {
        const isCurrent = current_chat.value.timestamp === timestamp;
        history.value.splice(index, 1);
        if (history.value.length === 0) {
            const newChat = createNewChat();
            history.value.push(newChat);
            current_chat.value = newChat;
        } else if (isCurrent) {
            current_chat.value = getLatestChat()!;
        }
        saveHistory();
    }
}

export function appendMessage(role: 'system' | 'user' | 'assistant', content: string) {
    current_chat.value.messages.push({ role, content: content });
    updateTimestamp();
    saveHistory();
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
    if (current_chat.value.summary === '未命名') {
        const modelPromise = callModel(message);
        const summaryPromise = getSummary(message);
        await modelPromise;
        setChatSummary(await summaryPromise);
    }
    else callModel(message);
    updateTimestamp();
    saveHistory();
}