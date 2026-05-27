import { CheckCircle2, Mail, SendHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Profile } from '@/components/portfolio/types';

type ContactFields = {
    name: string;
    email: string;
    subject: string;
    message: string;
    website: string;
};

const initialFields: ContactFields = {
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
};

function csrfToken(): string {
    return (
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? ''
    );
}

export function ContactApp({ profile }: { profile: Profile }) {
    const [fields, setFields] = useState(initialFields);
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSending(true);
        setStatus(null);
        setError(null);

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                },
                body: JSON.stringify(fields),
            });

            if (!response.ok) {
                throw new Error('Unable to send message');
            }

            const data = (await response.json()) as { message: string };
            setStatus(data.message);
            setFields(initialFields);
        } catch {
            setError('Please check your details and try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="grid h-full md:grid-cols-[205px_1fr]">
            <aside className="border-b border-white/8 bg-cyan-400/[0.035] p-5 md:border-r md:border-b-0">
                <Mail className="mb-5 size-7 text-cyan-300" />
                <p className="font-mono text-[10px] tracking-[0.22em] text-cyan-300">
                    SECURE CHANNEL
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white">
                    Start a conversation
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                    Share your role, product or technical problem. Messages land
                    in the admin inbox.
                </p>
                <p className="mt-7 font-mono text-xs break-all text-slate-300">
                    {profile.contact_email}
                </p>
            </aside>
            <form onSubmit={submit} className="space-y-3 p-5">
                <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={fields.website}
                    onChange={(event) =>
                        setFields({ ...fields, website: event.target.value })
                    }
                    className="hidden"
                    aria-hidden="true"
                    name="website"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                        label="Name"
                        value={fields.name}
                        onChange={(value) =>
                            setFields({ ...fields, name: value })
                        }
                        required
                    />
                    <Field
                        label="Email"
                        type="email"
                        value={fields.email}
                        onChange={(value) =>
                            setFields({ ...fields, email: value })
                        }
                        required
                    />
                </div>
                <Field
                    label="Subject"
                    value={fields.subject}
                    onChange={(value) =>
                        setFields({ ...fields, subject: value })
                    }
                />
                <label className="block">
                    <span className="mb-1.5 block text-xs text-slate-400">
                        Message
                    </span>
                    <textarea
                        required
                        minLength={10}
                        rows={4}
                        value={fields.message}
                        onChange={(event) =>
                            setFields({
                                ...fields,
                                message: event.target.value,
                            })
                        }
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
                        placeholder="Tell me what you are building..."
                    />
                </label>
                {status && (
                    <p className="flex items-center gap-2 text-sm text-emerald-300">
                        <CheckCircle2 className="size-4" />
                        {status}
                    </p>
                )}
                {error && <p className="text-sm text-rose-300">{error}</p>}
                <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-medium text-[#03111c] transition hover:bg-cyan-300 disabled:opacity-50"
                >
                    <SendHorizontal className="size-4" />
                    {sending ? 'Transmitting...' : 'Send message'}
                </button>
            </form>
        </div>
    );
}

function Field({
    label,
    type = 'text',
    value,
    required = false,
    onChange,
}: {
    label: string;
    type?: string;
    value: string;
    required?: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">{label}</span>
            <input
                required={required}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
            />
        </label>
    );
}
