import Alpine from 'alpinejs';

window.Alpine = Alpine;

// removed initThemeToggle

function parseSsePayload(line) {
    if (!line.startsWith('data: ')) return null;
    const data = line.slice(6).trim();
    if (data === '[DONE]') return { done: true };
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

async function streamChat({ url, message, conversationId, onConversation, onDelta, onDone, onError }) {
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
            Accept: 'text/event-stream',
        },
        body: JSON.stringify({ message, conversation_id: conversationId }),
    });

    if (!response.ok) {
        onError?.('Gagal menghubungi server AI.');
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
            const payload = parseSsePayload(line);
            if (!payload) continue;
            if (payload.done) {
                onDone?.();
                return;
            }
            if (payload.type === 'conversation' && payload.conversation_id) {
                onConversation?.(payload.conversation_id, payload.title);
            }
            if (payload.type === 'text_delta' && payload.delta) {
                onDelta?.(payload.delta);
            }
        }
    }

    onDone?.();
}

async function streamSummary({ url, onDelta, onDone, onError }) {
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    const response = await fetch(url, {
        headers: {
            'X-CSRF-TOKEN': token,
            Accept: 'text/event-stream',
        },
    });

    if (!response.ok) {
        onError?.('Gagal memuat ringkasan AI.');
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
            const payload = parseSsePayload(line);
            if (!payload) continue;
            if (payload.done) {
                onDone?.();
                return;
            }
            if (payload.type === 'text_delta' && payload.delta) {
                onDelta?.(payload.delta);
            }
        }
    }

    onDone?.();
}

window.PayGent = {
    streamChat,
    streamSummary,
};

// Removed redundant DOMContentLoaded

Alpine.start();
