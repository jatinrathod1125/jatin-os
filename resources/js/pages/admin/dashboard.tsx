import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Bot, Eye, Mail, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { dashboard } from '@/routes';

type Project = {
    id: number;
    title: string;
    slug: string;
    tagline: string;
    description: string;
    tech_stack: string[] | null;
    accent: 'cyan' | 'violet' | 'emerald' | 'amber';
    featured: boolean;
    published: boolean;
    sort_order: number;
    repository_url: string | null;
    live_url: string | null;
};

type Skill = {
    id: number;
    name: string;
    category: string;
    level: number;
    summary: string | null;
    visible: boolean;
    sort_order: number;
};

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    created_at: string;
};

type Chat = {
    id: number;
    prompt: string;
    response: string;
    provider: string;
    created_at: string;
};

type Props = {
    metrics: {
        visitors: number;
        visitorsToday: number;
        messages: number;
        chatPrompts: number;
    };
    projects: Project[];
    skills: Skill[];
    messages: ContactMessage[];
    chats: Chat[];
};

const blankProject = {
    title: '',
    slug: '',
    tagline: '',
    description: '',
    tech_stack: '',
    repository_url: '',
    live_url: '',
    accent: 'cyan' as Project['accent'],
    featured: true,
    published: true,
    sort_order: 0,
};

const blankSkill = {
    name: '',
    category: 'Backend',
    level: 80,
    summary: '',
    visible: true,
    sort_order: 0,
};

export default function AdminDashboard({
    metrics,
    projects,
    skills,
    messages,
    chats,
}: Props) {
    const flash = usePage<{ flash?: { success?: string } }>().props.flash;
    const [editingProject, setEditingProject] = useState<number | null>(null);
    const [editingSkill, setEditingSkill] = useState<number | null>(null);
    const projectForm = useForm(blankProject);
    const skillForm = useForm(blankSkill);

    const submitProject = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                projectForm.reset();
                setEditingProject(null);
            },
        };

        if (editingProject) {
            projectForm.put(`/admin/projects/${editingProject}`, options);
        } else {
            projectForm.post('/admin/projects', options);
        }
    };

    const editProject = (project: Project) => {
        setEditingProject(project.id);
        projectForm.setData({
            title: project.title,
            slug: project.slug,
            tagline: project.tagline,
            description: project.description,
            tech_stack: (project.tech_stack ?? []).join(', '),
            repository_url: project.repository_url ?? '',
            live_url: project.live_url ?? '',
            accent: project.accent,
            featured: project.featured,
            published: project.published,
            sort_order: project.sort_order,
        });
    };

    const submitSkill = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                skillForm.reset();
                setEditingSkill(null);
            },
        };

        if (editingSkill) {
            skillForm.put(`/admin/skills/${editingSkill}`, options);
        } else {
            skillForm.post('/admin/skills', options);
        }
    };

    const editSkill = (skill: Skill) => {
        setEditingSkill(skill.id);
        skillForm.setData({
            name: skill.name,
            category: skill.category,
            level: skill.level,
            summary: skill.summary ?? '',
            visible: skill.visible,
            sort_order: skill.sort_order,
        });
    };

    return (
        <>
            <Head title="Admin Console" />
            <div className="flex flex-1 flex-col gap-6 overflow-x-hidden p-4 md:p-6">
                {/* Header section */}
                <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] text-cyan-300 uppercase">
                        SYSTEM ADMINISTRATION
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-white">
                        Portfolio control center
                    </h1>
                    {flash?.success && (
                        <div className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-2.5 backdrop-blur-sm">
                            <p className="text-sm text-emerald-300">
                                {flash.success}
                            </p>
                        </div>
                    )}
                </div>

                {/* Metrics grid */}
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Metric
                        label="Unique visits"
                        value={metrics.visitors}
                        icon={Eye}
                    />
                    <Metric
                        label="Today"
                        value={metrics.visitorsToday}
                        icon={Eye}
                    />
                    <Metric
                        label="Messages"
                        value={metrics.messages}
                        icon={Mail}
                    />
                    <Metric
                        label="AI prompts"
                        value={metrics.chatPrompts}
                        icon={Bot}
                    />
                </section>

                {/* Projects + Skills */}
                <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                    <Panel title="Project filesystem">
                        <div className="space-y-2">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="group flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-white">
                                            {project.title}
                                        </p>
                                        <p className="truncate text-xs text-slate-400">
                                            {project.tagline}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <IconButton
                                            label="Edit"
                                            onClick={() => editProject(project)}
                                        >
                                            <Pencil className="size-3.5" />
                                        </IconButton>
                                        <IconButton
                                            label="Delete"
                                            onClick={() =>
                                                router.delete(
                                                    `/admin/projects/${project.id}`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                        >
                                            <Trash2 className="size-3.5" />
                                        </IconButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ProjectForm
                            editing={Boolean(editingProject)}
                            form={projectForm}
                            onSubmit={submitProject}
                            onCancel={() => {
                                projectForm.reset();
                                setEditingProject(null);
                            }}
                        />
                    </Panel>
                    <Panel title="Capability matrix">
                        <div className="mb-4 space-y-2">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]"
                                >
                                    <span className="text-slate-300">
                                        {skill.name}{' '}
                                        <span className="text-slate-500">
                                            {skill.level}%
                                        </span>
                                    </span>
                                    <div className="flex gap-1">
                                        <IconButton
                                            label="Edit"
                                            onClick={() => editSkill(skill)}
                                        >
                                            <Pencil className="size-3.5" />
                                        </IconButton>
                                        <IconButton
                                            label="Delete"
                                            onClick={() =>
                                                router.delete(
                                                    `/admin/skills/${skill.id}`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                        >
                                            <Trash2 className="size-3.5" />
                                        </IconButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <SkillForm
                            editing={Boolean(editingSkill)}
                            form={skillForm}
                            onSubmit={submitSkill}
                            onCancel={() => {
                                skillForm.reset();
                                setEditingSkill(null);
                            }}
                        />
                    </Panel>
                </section>

                {/* Messages + Chats */}
                <section className="grid gap-5 xl:grid-cols-2">
                    <Panel title="Latest transmissions">
                        {messages.length === 0 && (
                            <p className="text-sm text-slate-500">
                                No contact messages yet.
                            </p>
                        )}
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <article
                                    key={message.id}
                                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]"
                                >
                                    <p className="text-sm font-medium text-white">
                                        {message.name}{' '}
                                        <span className="font-normal text-slate-400">
                                            {message.email}
                                        </span>
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {message.subject || 'Portfolio inquiry'}
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                                        {message.message}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </Panel>
                    <Panel title="ORBIT history">
                        {chats.length === 0 && (
                            <p className="text-sm text-slate-500">
                                No assistant prompts yet.
                            </p>
                        )}
                        <div className="space-y-3">
                            {chats.map((chat) => (
                                <article
                                    key={chat.id}
                                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]"
                                >
                                    <p className="text-sm font-medium text-white">
                                        {chat.prompt}
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                                        {chat.response}
                                    </p>
                                    <p className="mt-2 font-mono text-[10px] tracking-[0.22em] text-cyan-300 uppercase">
                                        {chat.provider}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </Panel>
                </section>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Admin Console', href: '/admin' },
    ],
};

/* ─── Sub-components ─────────────────────────────────────────────── */

function Metric({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number;
    icon: typeof Eye;
}) {
    const [displayed, setDisplayed] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value === 0) {
            setDisplayed(0);
            return;
        }

        const duration = 1200;
        const steps = 40;
        const increment = value / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), value);
            setDisplayed(current);
            if (step >= steps) {
                clearInterval(timer);
                setDisplayed(value);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div
            ref={ref}
            className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.05] hover:shadow-[0_0_30px_-5px_rgba(0,245,255,0.08)]"
        >
            {/* Decorative glow dot */}
            <div className="absolute -top-1 -right-1 size-16 rounded-full bg-cyan-400/[0.04] blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

            <Icon className="size-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(0,245,255,0.4)]" />
            <p className="mt-4 text-3xl font-bold tabular-nums text-white">
                {displayed}
            </p>
            <p className="mt-1 text-sm text-slate-400">{label}</p>
        </div>
    );
}

function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
            {/* Panel header */}
            <h2 className="mb-4 font-mono text-[10px] font-semibold tracking-[0.22em] text-cyan-300 uppercase">
                {title}
            </h2>
            {children}
        </section>
    );
}

function IconButton({
    label,
    onClick,
    children,
}: {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
}) {
    const isDelete = label === 'Delete';
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={`rounded-md p-2 text-slate-500 transition-all duration-200 ${
                isDelete
                    ? 'hover:bg-rose-400/[0.15] hover:text-rose-300'
                    : 'hover:bg-white/[0.08] hover:text-cyan-200'
            }`}
        >
            {children}
        </button>
    );
}

function ProjectForm({
    form,
    editing,
    onSubmit,
    onCancel,
}: {
    form: ReturnType<typeof useForm<typeof blankProject>>;
    editing: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="mt-5 space-y-2 border-t border-white/[0.06] pt-4"
        >
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                <Plus className="size-4 text-cyan-400" />
                {editing ? 'Edit project' : 'Add project'}
            </p>
            <div className="grid gap-2 md:grid-cols-2">
                <AdminInput
                    placeholder="Title"
                    value={form.data.title}
                    onChange={(value) => form.setData('title', value)}
                />
                <AdminInput
                    placeholder="Slug"
                    value={form.data.slug}
                    onChange={(value) => form.setData('slug', value)}
                />
            </div>
            <AdminInput
                placeholder="Tagline"
                value={form.data.tagline}
                onChange={(value) => form.setData('tagline', value)}
            />
            <textarea
                required
                value={form.data.description}
                onChange={(event) =>
                    form.setData('description', event.target.value)
                }
                placeholder="Description"
                className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors duration-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
            />
            <AdminInput
                placeholder="Stack, separated by commas"
                value={form.data.tech_stack}
                onChange={(value) => form.setData('tech_stack', value)}
            />
            <div className="flex flex-wrap items-center gap-3 py-2 text-xs text-slate-300">
                <select
                    value={form.data.accent}
                    onChange={(event) =>
                        form.setData(
                            'accent',
                            event.target.value as Project['accent'],
                        )
                    }
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-white transition-colors duration-200 focus:border-cyan-400/50 focus:outline-none"
                >
                    <option value="cyan">Cyan</option>
                    <option value="violet">Violet</option>
                    <option value="emerald">Emerald</option>
                    <option value="amber">Amber</option>
                </select>
                <label className="flex items-center gap-1.5 text-slate-300 select-none">
                    <input
                        type="checkbox"
                        checked={form.data.featured}
                        onChange={(event) =>
                            form.setData('featured', event.target.checked)
                        }
                        className="accent-cyan-400"
                    />{' '}
                    Featured
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 select-none">
                    <input
                        type="checkbox"
                        checked={form.data.published}
                        onChange={(event) =>
                            form.setData('published', event.target.checked)
                        }
                        className="accent-cyan-400"
                    />{' '}
                    Published
                </label>
            </div>
            <FormActions
                processing={form.processing}
                editing={editing}
                onCancel={onCancel}
            />
        </form>
    );
}

function SkillForm({
    form,
    editing,
    onSubmit,
    onCancel,
}: {
    form: ReturnType<typeof useForm<typeof blankSkill>>;
    editing: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}) {
    return (
        <form onSubmit={onSubmit} className="border-t border-white/[0.06] pt-4">
            <p className="mb-3 text-sm font-medium text-white">
                {editing ? 'Edit skill' : 'Add skill'}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
                <AdminInput
                    placeholder="Skill"
                    value={form.data.name}
                    onChange={(value) => form.setData('name', value)}
                />
                <AdminInput
                    placeholder="Category"
                    value={form.data.category}
                    onChange={(value) => form.setData('category', value)}
                />
                <AdminInput
                    placeholder="Level"
                    type="number"
                    value={String(form.data.level)}
                    onChange={(value) => form.setData('level', Number(value))}
                />
                <AdminInput
                    placeholder="Order"
                    type="number"
                    value={String(form.data.sort_order)}
                    onChange={(value) =>
                        form.setData('sort_order', Number(value))
                    }
                />
            </div>
            <AdminInput
                placeholder="Summary"
                value={form.data.summary}
                onChange={(value) => form.setData('summary', value)}
            />
            <label className="my-3 flex items-center gap-1.5 text-xs text-slate-300 select-none">
                <input
                    type="checkbox"
                    checked={form.data.visible}
                    onChange={(event) =>
                        form.setData('visible', event.target.checked)
                    }
                    className="accent-cyan-400"
                />{' '}
                Visible on portfolio
            </label>
            <FormActions
                processing={form.processing}
                editing={editing}
                onCancel={onCancel}
            />
        </form>
    );
}

function AdminInput({
    placeholder,
    type = 'text',
    value,
    onChange,
}: {
    placeholder: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <input
            required={
                !placeholder.includes('Stack') &&
                !placeholder.includes('Summary')
            }
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors duration-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
        />
    );
}

function FormActions({
    processing,
    editing,
    onCancel,
}: {
    processing: boolean;
    editing: boolean;
    onCancel: () => void;
}) {
    return (
        <div className="flex gap-2 pt-2">
            <button
                disabled={processing}
                className="rounded-md bg-cyan-400 px-4 py-2 text-xs font-semibold text-[#03111c] shadow-[0_0_20px_-4px_rgba(0,245,255,0.3)] transition-all duration-200 hover:bg-cyan-300 hover:shadow-[0_0_25px_-2px_rgba(0,245,255,0.4)] disabled:opacity-50"
            >
                {editing ? 'Update' : 'Create'}
            </button>
            {editing && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08]"
                >
                    Cancel
                </button>
            )}
        </div>
    );
}
