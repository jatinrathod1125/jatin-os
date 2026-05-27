import { Bot, Mic, SendHorizontal, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

type ChatMessage = {
    id: number;
    role: 'assistant' | 'user';
    text: string;
    animate?: boolean;
};

type RecognitionResult = {
    results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type Recognition = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: RecognitionResult) => void) | null;
    onend: (() => void) | null;
    start: () => void;
};

type RecognitionWindow = Window & {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
};

function csrfToken(): string {
    return (
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? ''
    );
}

function TypedResponse({ text }: { text: string }) {
    const [shown, setShown] = useState('');

    useEffect(() => {
        setShown('');
        let character = 0;
        const timer = window.setInterval(() => {
            character += 2;
            setShown(text.slice(0, character));

            if (character >= text.length) {
                window.clearInterval(timer);
            }
        }, 14);

        return () => window.clearInterval(timer);
    }, [text]);

    return <>{shown}</>;
}

export function AssistantApp() {
    const nextId = useRef(2);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            role: 'assistant',
            text: "Hello. I am ORBIT. Ask me about Jatin's builds, Laravel architecture or hiring fit.",
        },
    ]);

    const submit = async (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        const question = prompt.trim();

        if (!question || loading) {
            return;
        }

        const userMessage: ChatMessage = {
            id: nextId.current++,
            role: 'user',
            text: question,
        };
        setMessages((items) => [...items, userMessage]);
        setPrompt('');
        setLoading(true);

        try {
            const response = await fetch('/assistant/chat', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                },
                body: JSON.stringify({ prompt: question }),
            });

            if (!response.ok) {
                throw new Error('Assistant request failed');
            }

            const data = (await response.json()) as { answer: string };
            setMessages((items) => [
                ...items,
                {
                    id: nextId.current++,
                    role: 'assistant',
                    text: data.answer,
                    animate: true,
                },
            ]);
        } catch {
            setMessages((items) => [
                ...items,
                {
                    id: nextId.current++,
                    role: 'assistant',
                    text: 'The assistant link is temporarily unavailable. The Contact app is still ready.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const dictate = () => {
        const recognitionWindow = window as RecognitionWindow;
        const RecognitionApi =
            recognitionWindow.SpeechRecognition ??
            recognitionWindow.webkitSpeechRecognition;

        if (!RecognitionApi) {
            setMessages((items) => [
                ...items,
                {
                    id: nextId.current++,
                    role: 'assistant',
                    text: 'Voice input is not available in this browser. Text input is ready.',
                },
            ]);

            return;
        }

        const recognition = new RecognitionApi();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            setPrompt(event.results[0]?.[0]?.transcript ?? '');
        };
        recognition.onend = () => setListening(false);
        setListening(true);
        recognition.start();
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                    <span className="relative">
                        <Bot className="size-4 text-cyan-300" />
                        <span className="absolute -right-1 -bottom-1 size-1.5 rounded-full bg-emerald-400" />
                    </span>
                    ORBIT
                </div>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] text-emerald-300">
                    ONLINE
                </span>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                        {message.role === 'assistant' && (
                            <Bot className="mt-1 size-4 shrink-0 text-cyan-300" />
                        )}
                        <p
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                                message.role === 'user'
                                    ? 'bg-cyan-400 text-[#03111c]'
                                    : 'border border-white/8 bg-white/[0.035] text-slate-300'
                            }`}
                        >
                            {message.animate ? (
                                <TypedResponse text={message.text} />
                            ) : (
                                message.text
                            )}
                        </p>
                        {message.role === 'user' && (
                            <UserRound className="mt-1 size-4 shrink-0 text-slate-500" />
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <Bot className="size-4 text-cyan-300" />
                        <span className="animate-pulse">
                            ORBIT is compiling a response...
                        </span>
                    </div>
                )}
            </div>
            <form
                onSubmit={submit}
                className="flex gap-2 border-t border-white/8 p-4"
            >
                <button
                    type="button"
                    onClick={dictate}
                    aria-label="Use voice input"
                    className={`rounded-xl border p-3 transition ${
                        listening
                            ? 'border-cyan-300/40 bg-cyan-300/15 text-cyan-200'
                            : 'border-white/10 text-slate-400 hover:text-cyan-200'
                    }`}
                >
                    <Mic className="size-4" />
                </button>
                <input
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Ask about a project..."
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white transition outline-none focus:border-cyan-400/40"
                />
                <button
                    type="submit"
                    disabled={loading}
                    aria-label="Send message"
                    className="rounded-xl bg-cyan-400 p-3 text-[#03111c] transition hover:bg-cyan-300 disabled:opacity-40"
                >
                    <SendHorizontal className="size-4" />
                </button>
            </form>
        </div>
    );
}
