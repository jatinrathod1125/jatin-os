import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Bot, Eye, Mail, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
                <div>
                    <p className="text-xs font-medium tracking-[0.22em] text-cyan-600 dark:text-cyan-300">
                        SYSTEM ADMINISTRATION
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold">
                        Portfolio control center
                    </h1>
                    {flash?.success && (
                        <p className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-300">
                            {flash.success}
                        </p>
                    )}
                </div>
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
                <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                    <Panel title="Project filesystem">
                        <div className="space-y-2">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">
                                            {project.title}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
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
                                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                                >
                                    <span>
                                        {skill.name}{' '}
                                        <span className="text-muted-foreground">
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
                <section className="grid gap-5 xl:grid-cols-2">
                    <Panel title="Latest transmissions">
                        {messages.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No contact messages yet.
                            </p>
                        )}
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <article
                                    key={message.id}
                                    className="rounded-lg border border-border p-3"
                                >
                                    <p className="text-sm font-medium">
                                        {message.name}{' '}
                                        <span className="font-normal text-muted-foreground">
                                            {message.email}
                                        </span>
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {message.subject || 'Portfolio inquiry'}
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-sm">
                                        {message.message}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </Panel>
                    <Panel title="ORBIT history">
                        {chats.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No assistant prompts yet.
                            </p>
                        )}
                        <div className="space-y-3">
                            {chats.map((chat) => (
                                <article
                                    key={chat.id}
                                    className="rounded-lg border border-border p-3"
                                >
                                    <p className="text-sm font-medium">
                                        {chat.prompt}
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                                        {chat.response}
                                    </p>
                                    <p className="mt-2 font-mono text-[10px] text-cyan-600 uppercase dark:text-cyan-300">
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

function Metric({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number;
    icon: typeof Eye;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <Icon className="size-4 text-cyan-600 dark:text-cyan-300" />
            <p className="mt-4 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
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
        <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-4 text-sm font-semibold">{title}</h2>
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
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
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
            className="mt-5 space-y-2 border-t border-border pt-4"
        >
            <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Plus className="size-4" />
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
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            />
            <AdminInput
                placeholder="Stack, separated by commas"
                value={form.data.tech_stack}
                onChange={(value) => form.setData('tech_stack', value)}
            />
            <div className="flex flex-wrap items-center gap-3 py-2 text-xs">
                <select
                    value={form.data.accent}
                    onChange={(event) =>
                        form.setData(
                            'accent',
                            event.target.value as Project['accent'],
                        )
                    }
                    className="rounded-md border border-input bg-background px-2 py-1.5"
                >
                    <option value="cyan">Cyan</option>
                    <option value="violet">Violet</option>
                    <option value="emerald">Emerald</option>
                    <option value="amber">Amber</option>
                </select>
                <label>
                    <input
                        type="checkbox"
                        checked={form.data.featured}
                        onChange={(event) =>
                            form.setData('featured', event.target.checked)
                        }
                    />{' '}
                    Featured
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={form.data.published}
                        onChange={(event) =>
                            form.setData('published', event.target.checked)
                        }
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
        <form onSubmit={onSubmit} className="border-t border-border pt-4">
            <p className="mb-3 text-sm font-medium">
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
            <label className="my-3 block text-xs">
                <input
                    type="checkbox"
                    checked={form.data.visible}
                    onChange={(event) =>
                        form.setData('visible', event.target.checked)
                    }
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
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
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
                className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground disabled:opacity-50"
            >
                {editing ? 'Update' : 'Create'}
            </button>
            {editing && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border border-input px-3 py-2 text-xs"
                >
                    Cancel
                </button>
            )}
        </div>
    );
}
