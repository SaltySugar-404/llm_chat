import axios from 'axios';
import { ref } from 'vue'
const ARK_API_KEY = "9d29936c-f9a6-443f-895d-b562c5f280bd";
const url = 'https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions';

type Message = {
    role: "system" | "assistant" | "user";
    content: string;
};

export const all_messages = ref<Message[]>([]);
all_messages.value.push({ role: 'system', content: 'You are a helpful assistant.' });
//逐条添加
function add_message(role: 'system' | 'user' | 'assistant', content: string) {
    all_messages.value.push({ role: role, content: content })
};
//请求model
export async function call_model(content: string) {
    add_message('user', content)
    const data = {
        model: "bot-20250220101548-62qmr",
        stream: false,
        messages: all_messages
    };
    const config = {
        headers: {
            'Authorization': `Bearer ${ARK_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post(url, data, config)
        if (response.data.choices?.length) {
            add_message('assistant', response.data.choices[0].message.content);
        }

    } catch (error: any) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else {
            console.error('Request setup error:', error.message);
        }
    };
};