import { ref } from 'vue'
const api_key = "9d29936c-f9a6-443f-895d-b562c5f280bd";
const url = 'https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions';

type Message = {
    role: "system" | "assistant" | "user";
    content: string;
};

export const all_messages = ref<Message[]>([]);
all_messages.value.push({ role: 'system', content: 'You are a helpful assistant.' });
//完整添加
function append_message(role: 'system' | 'user' | 'assistant', content: string) {
    all_messages.value.push({ role: role, content: content })
};
function pop_message() {
    all_messages.value.pop()
}
//逐字添加
function append_content(new_content: string) {
    all_messages.value[all_messages.value.length - 1].content += new_content;
}
//转化为列表
function plain_messages() {
    return all_messages.value.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
}
//请求model
export async function call_model(content: string) {
    append_message('user', content);
    append_message('assistant', '');
    const data = {
        model: "bot-20250220101548-62qmr",
        stream: true,
        messages: plain_messages()
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
                            append_content(delta.content);
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
        append_content(error_message);
    }
}
