import { CornerDownLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type {
    AppId,
    PortfolioProject,
    PortfolioSkill,
} from '@/components/portfolio/types';

type TerminalLine = {
    id: number;
    prompt?: string;
    output: string;
    tone?: 'muted' | 'bright' | 'success';
};

export function TerminalApp({
    projects,
    skills,
    onOpen,
}: {
    projects: PortfolioProject[];
    skills: PortfolioSkill[];
    onOpen: (app: AppId) => void;
}) {
    const nextLine = useRef(4);
    const [input, setInput] = useState('');
    const [lines, setLines] = useState<TerminalLine[]>([
        { id: 1, output: 'Jatin OS terminal [version 1.0.0]', tone: 'bright' },
        { id: 2, output: 'Type "help" to discover commands.', tone: 'muted' },
        { id: 3, output: '' },
    ]);

    const append = (entries: Omit<TerminalLine, 'id'>[]) => {
        setLines((previous) => [
            ...previous,
            ...entries.map((entry) => ({ ...entry, id: nextLine.current++ })),
        ]);
    };

    const run = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const raw = input.trim();
        const command = raw.toLowerCase();
        setInput('');

        if (!raw) {
            return;
        }

        if (command === 'clear') {
            setLines([]);

            return;
        }

        const response: Omit<TerminalLine, 'id'>[] = [
            { prompt: raw, output: '' },
        ];

        switch (command) {
            case 'help':
                response.push({
                    output: 'help | about | skills | projects | contact | open ai | hire jatin | clear',
                    tone: 'muted',
                });
                break;
            case 'about':
                onOpen('about');
                response.push({ output: 'Opening /about...', tone: 'success' });
                break;
            case 'skills':
                response.push({
                    output: skills.map((skill) => skill.name).join(' :: '),
                    tone: 'bright',
                });
                break;
            case 'projects':
                onOpen('projects');
                response.push({
                    output: `${projects.length} published builds found. Opening /projects...`,
                    tone: 'success',
                });
                break;
            case 'contact':
                onOpen('contact');
                response.push({
                    output: 'Opening secure contact channel...',
                    tone: 'success',
                });
                break;
            case 'open ai':
                onOpen('assistant');
                response.push({
                    output: 'ORBIT assistant is online.',
                    tone: 'success',
                });
                break;
            case 'hire jatin':
                onOpen('contact');
                response.push({
                    output: 'Excellent command. Contact channel prepared for your brief.',
                    tone: 'success',
                });
                break;
            default:
                response.push({
                    output: `Command not found: ${raw}. Run "help" for supported commands.`,
                    tone: 'muted',
                });
        }

        append(response);
    };

    return (
        <div className="flex h-full flex-col bg-[#040a11] font-mono text-xs">
            <div className="flex-1 space-y-2 overflow-y-auto p-5 text-slate-300">
                {lines.map((line) => (
                    <div key={line.id}>
                        {line.prompt && (
                            <p className="text-cyan-300">
                                guest@jatin-os:~${' '}
                                <span className="text-slate-100">
                                    {line.prompt}
                                </span>
                            </p>
                        )}
                        {line.output && (
                            <p
                                className={
                                    line.tone === 'success'
                                        ? 'text-emerald-300'
                                        : line.tone === 'bright'
                                          ? 'text-slate-100'
                                          : 'text-slate-500'
                                }
                            >
                                {line.output}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <form
                onSubmit={run}
                className="flex items-center gap-2 border-t border-white/8 p-4"
            >
                <span className="text-cyan-300">guest@jatin-os:~$</span>
                <input
                    autoFocus
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-600"
                    placeholder="enter command"
                />
                <button
                    type="submit"
                    aria-label="Run command"
                    className="rounded-md border border-cyan-300/20 p-1.5 text-cyan-300"
                >
                    <CornerDownLeft className="size-3.5" />
                </button>
            </form>
        </div>
    );
}
