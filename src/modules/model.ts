import type { Ref } from 'vue'
import type { Message } from '@/modules/storage'
import { appendMessage, appendContent, toPlainMessage } from '@/modules/storage'

const api_key = "9d29936c-f9a6-443f-895d-b562c5f280bd";
const url = 'https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions';

export async function callModel(chat: Ref<Message[]>, content: string) {
    appendMessage(chat, 'user', content);
    appendMessage(chat, 'assistant', '');
    const data = {
        model: "bot-20250220101548-62qmr",
        stream: true,
        messages: toPlainMessage(chat)
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
                            appendContent(chat, delta.content);
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
        appendContent(chat, error_message);
    }
}