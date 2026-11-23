'use client'

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import type {
  AppData,
  Assistant,
  Classification,
  Occurrence,
  OccurrenceType,
  Referral,
  SchoolClass,
  Student,
} from '@/models/school'
import { emptyData, hashPassword, loadData, saveData } from '@/services/local-store'


type View =
  | 'dashboard'
  | 'ocorrencias'
  | 'uniformes'
  | 'atrasos'
  | 'alunos'
  | 'turmas'
  | 'assistentes'
  | 'historico'
  | 'auditoria'
  | 'reincidencias'
  | 'encaminhamentos'
  | 'relatorios'
  | 'configuracoes'


type IconName =
  | 'grid'
  | 'alert'
  | 'shirt'
  | 'clock'
  | 'users'
  | 'school'
  | 'shield'
  | 'history'
  | 'repeat'
  | 'send'
  | 'file'
  | 'settings'
  | 'logout'
  | 'menu'
  | 'plus'
  | 'search'
  | 'edit'
  | 'trash'
  | 'eye'
  | 'download'
  | 'chevron'
  | 'bell'
  | 'x'

const paths: Record<IconName, ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  alert: (
    <>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.7 2.5 18a2 2 0 0 0 1.8 3h15.4a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
    </>
  ),
  shirt: (
    <>
      <path d="m8 3 4 2 4-2 5 3-3 5-2-1v11H8V10l-2 1-3-5 5-3Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  school: (
    <>
      <path d="m3 10 9-6 9 6" />
      <path d="M5 9v11h14V9M9 20v-6h6v6" />
      <path d="M3 20h18" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5M12 7v5l3 2" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4" />
      <path d="M21 13v2a3 3 0 0 1-3 3H3" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17l5-5-5-5M15 12H3" />
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  x: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

const nav: { id: View; label: string; icon: IconName }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'ocorrencias', label: 'Registrar ocorrência', icon: 'alert' },
  { id: 'uniformes', label: 'Controle de uniforme', icon: 'shirt' },
  { id: 'atrasos', label: 'Controle de atrasos', icon: 'clock' },
  { id: 'alunos', label: 'Alunos', icon: 'users' },
  { id: 'turmas', label: 'Turmas', icon: 'school' },
  { id: 'assistentes', label: 'Assistentes', icon: 'shield' },
  { id: 'historico', label: 'Histórico de ocorrências', icon: 'history' },
  { id: 'auditoria', label: 'Auditoria do sistema', icon: 'history' },
  { id: 'reincidencias', label: 'Reincidências', icon: 'repeat' },
  { id: 'encaminhamentos', label: 'Encaminhamentos ao DEPE', icon: 'send' },
  { id: 'relatorios', label: 'Relatórios', icon: 'file' },
  { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
]

const titles: Record<View, [string, string]> = {
  dashboard: ['Dashboard', 'Visão geral da assistência estudantil'],
  ocorrencias: ['Ocorrências', 'Registre e acompanhe ocorrências escolares'],
  uniformes: ['Controle de uniforme', 'Fiscalização e orientação do padrão institucional'],
  atrasos: ['Controle de atrasos', 'Registros de chegada e tolerância de 15 minutos'],
  alunos: ['Alunos', 'Cadastro e histórico individual dos estudantes'],
  turmas: ['Turmas', 'Cursos técnicos integrados do Campus Tefé'],
  assistentes: ['Assistentes', 'Usuários, perfis e permissões de acesso'],
  historico: ['Histórico de ocorrências', 'Consulta consolidada de todos os registros'],
  auditoria: ['Auditoria', '📋'],
  reincidencias: ['Reincidências', 'Alunos com três ou mais registros na mesma categoria'],
  encaminhamentos: ['Encaminhamentos ao DEPE', 'Acompanhamento de análises e providências'],
  relatorios: ['Relatórios', 'Emissão de documentos institucionais'],
  configuracoes: ['Configurações', 'Preferências e informações do sistema'],
}

const today = () => new Date().toISOString().slice(0, 10)
const nowTime = () => new Date().toTimeString().slice(0, 5)
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const displayDate = (value: string) =>
  value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '—'
const classLabel = (classes: SchoolClass[], id: string) =>
  classes.find((item) => item.id === id)?.code ?? '—'
const studentLabel = (students: Student[], id: string) =>
  students.find((item) => item.id === id)?.name ?? 'Aluno removido'
const typeLabel = (value: OccurrenceType) =>
  ({ atraso: 'Atraso', uniforme: 'Uniforme', outra: 'Outra ocorrência' })[value]
const classTone = (value: Classification) =>
  value === 'vermelho'
    ? 'bg-red-50 text-red-700 ring-red-200'
    : value === 'laranja'
      ? 'bg-orange-50 text-orange-700 ring-orange-200'
      : 'bg-amber-50 text-amber-700 ring-amber-200'

function Login({ data, onLogin }: { data: AppData; onLogin: (user: Assistant) => void }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    const passwordHash = await hashPassword(password)
    const user = data.assistants.find(
      (item) =>
        item.username.toLowerCase() === username.toLowerCase() &&
        item.passwordHash === passwordHash &&
        item.status === 'ativo',
    )
    setBusy(false)
    if (!user) return setError('Usuário, senha ou situação da conta inválidos.')
    onLogin(user)
  }

  return (
    <main className="min-h-screen bg-[#071c36] p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden overflow-hidden bg-[#0b2b52] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[55px] border-white/5" />
          <div className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-[#c81e2b]/20 blur-2xl" />
          <div className="relative">
            <Brand light />
            <p className="mt-16 max-w-md text-4xl font-semibold leading-tight tracking-tight">
              Cuidado, organização e acompanhamento em um só lugar.
            </p>
            <p className="mt-5 max-w-md text-base leading-7 text-blue-100/70">
              Uma ferramenta institucional para apoiar a assistência de alunos do IFAM Campus Tefé.
            </p>
          </div>
          <div className="relative flex items-center gap-3 text-sm text-blue-100/60">
            <span className="h-px w-10 bg-red-400" /> Ambiente local de demonstração
          </div>
        </section>
        <section className="flex items-center justify-center px-6 py-12 sm:px-14">
          <div className="w-full max-w-sm">
            <div className="mb-10 lg:hidden">
              <Brand />
            </div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#c81e2b]">
              Acesso institucional
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Entre com sua identificação para acessar o sistema.
            </p>
            <form className="mt-9 space-y-5" onSubmit={submit}>
              <Field label="Identificação de usuário">
                <input
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </Field>
              <Field label="Senha">
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </Field>
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
              )}
              <button className="primary-button w-full justify-center py-3.5" disabled={busy}>
                {busy ? 'Verificando…' : 'Entrar no sistema'} <Icon name="chevron" size={17} />
              </button>
            </form>
            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-slate-600">
              <p className="font-semibold text-[#0b2b52]">Acesso inicial</p>
              <p className="mt-1">
                Usuário: <strong>admin</strong> · Senha: <strong>admin123</strong>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#c81e2b] text-lg font-black text-white shadow-lg shadow-red-950/20">
        IF
      </div>
      <div>
        <p
          className={`text-base font-extrabold tracking-wide ${light ? 'text-white' : 'text-[#0b2b52]'}`}
        >
          SAE · IFAM CAMPUS TEFÉ
        </p>
        <p className={`text-[11px] ${light ? 'text-blue-100/60' : 'text-slate-500'}`}>
          Sistema de Assistência Estudantil
        </p>
      </div>
    </div>
  )
}

export function SchoolSystem() {
  const [data, setData] = useState<AppData>(emptyData)
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<Assistant | null>(null)
  const [view, setView] = useState<View>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setData(loadData())
    setReady(true)
  }, [])
  useEffect(() => {
    if (ready) saveData(data)
  }, [data, ready])

  
function update(
  mutator: (current: AppData) => AppData,
  action?: { label: string; entity: string; id: string },
) {
  setData((current) => {
    const next = mutator(current)

    if (!action || !user) return next
    const currentAction = action

    function findRecord(source: AppData) {
      const collections = [
        source.students,
        source.occurrences,
        source.classes,
        source.assistants,
        source.referrals,
        source.emailSimulations,
      ]

      for (const collection of collections) {
        const found = collection.find((item) => item.id === currentAction.id)

        if (found) {
          return found as unknown as Record<string, unknown>
        }
      }

      return undefined
    }

    function formatValue(value: unknown): string {
      if (value === undefined || value === null || value === '') {
        return '—'
      }

      if (typeof value === 'object') {
        return JSON.stringify(value)
      }

      return String(value)
    }

    const beforeRecord = findRecord(current)
    const afterRecord = findRecord(next)

    const fields = new Set([
      ...Object.keys(beforeRecord ?? {}),
      ...Object.keys(afterRecord ?? {}),
    ])

    const changes = Array.from(fields)
      .filter((field) => {
        if (field === 'passwordHash' || field === 'id') return false

        return (
          JSON.stringify(beforeRecord?.[field]) !==
          JSON.stringify(afterRecord?.[field])
        )
      })
      .map((field) => ({
        field,
        before: formatValue(beforeRecord?.[field]),
        after: formatValue(afterRecord?.[field]),
      }))

    return {
      ...next,
      audit: [
        {
          id: uid('aud'),
          at: new Date().toISOString(),
          user: user.name,
          action: action.label,
          entity: action.entity,
          entityId: action.id,
          changes,
        },
        ...next.audit,
      ],
    }
  })
}


  if (!ready)
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">
        Carregando sistema…
      </div>
    )
  if (!user) return <Login data={data} onLogin={setUser} />

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <Sidebar
        view={view}
        setView={(next) => {
          setView(next)
          setMenuOpen(false)
        }}
        user={user}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={() => setUser(null)}
      />
      <div className="min-h-screen lg:pl-[270px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="icon-button lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Icon name="menu" />
            </button>
            <div>
              <p className="text-base font-semibold text-[#0b2b52] sm:text-lg">{titles[view][0]}</p>
              <p className="hidden text-xs text-slate-500 sm:block">{titles[view][1]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="icon-button relative" aria-label="Notificações">
              <Icon name="bell" size={19} />
              {getRecurrences(data).length > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold">{user.name}</p>
              <p className="text-[11px] capitalize text-slate-500">{user.role}</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0b2b52] text-xs font-bold text-white">
              {user.name
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')}
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-8">
          {view === 'dashboard' && <Dashboard data={data} setView={setView} />}
          {(view === 'ocorrencias' || view === 'uniformes' || view === 'atrasos') && (
            <OccurrenceModule
              data={data}
              update={update}
              user={user}
              mode={view === 'ocorrencias' ? 'outra' : view === 'uniformes' ? 'uniforme' : 'atraso'}
            />
          )}
          {view === 'alunos' && <Students data={data} update={update} />}
          {view === 'turmas' && <Classes data={data} update={update} />}
          {view === 'assistentes' && <Assistants data={data} update={update} currentUser={user} />}
          {view === 'historico' && <History data={data} update={update} />}
          {view === 'auditoria' && <AuditHistory data={data} />}
          {view === 'reincidencias' && <Recurrences data={data} setView={setView} />}
          {view === 'encaminhamentos' && <Referrals data={data} update={update} user={user} />}
          {view === 'relatorios' && <Reports data={data} user={user} />}
          {view === 'configuracoes' && <Settings data={data} update={update} user={user} />}
        </main>
      </div>
    </div>
  )
}

function Sidebar({
  view,
  setView,
  user,
  open,
  onClose,
  onLogout,
}: {
  view: View
  setView: (view: View) => void
  user: Assistant
  open: boolean
  onClose: () => void
  onLogout: () => void
}) {
  return (
    <>
      {open && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col bg-[#092849] text-white shadow-2xl transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-[90px] items-center justify-between border-b border-white/10 px-6">
          <Brand light />
          <button className="text-white/60 lg:hidden" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.22em] text-blue-200/40">
            Navegação
          </p>
          <div className="space-y-1">
            {nav
              .filter(
                (item) =>
                  user.role === 'administrador' ||
                  !['assistentes', 'configuracoes'].includes(item.id),
              )
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${view === item.id ? 'bg-white text-[#092849] shadow-lg shadow-black/10' : 'text-blue-100/70 hover:bg-white/8 hover:text-white'}`}
                >
                  <span
                    className={
                      view === item.id
                        ? 'text-[#c81e2b]'
                        : 'text-blue-200/60 group-hover:text-white'
                    }
                  >
                    <Icon name={item.icon} size={18} />
                  </span>
                  {item.label}
                  {view === item.id && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c81e2b]" />
                  )}
                </button>
              ))}
          </div>
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-blue-100/60 hover:bg-red-500/15 hover:text-red-200"
          >
            <Icon name="logout" size={18} /> Sair
          </button>
        </div>
      </aside>
    </>
  )
}

function Dashboard({ data, setView }: { data: AppData; setView: (view: View) => void }) {
  const active = data.occurrences.filter((item) => item.status === 'ativo')
  const recurrences = getRecurrences(data)
  const cards = [
    ['Total de ocorrências', active.length, 'alert', 'bg-blue-50 text-blue-700'],
    [
      'Atrasos registrados',
      active.filter((item) => item.type === 'atraso').length,
      'clock',
      'bg-violet-50 text-violet-700',
    ],
    [
      'Irregularidades de uniforme',
      active.filter((item) => item.type === 'uniforme').length,
      'shirt',
      'bg-orange-50 text-orange-700',
    ],
    ['Reincidências', recurrences.length, 'repeat', 'bg-red-50 text-red-700'],
    [
      'Registros hoje',
      active.filter((item) => item.date === today()).length,
      'history',
      'bg-emerald-50 text-emerald-700',
    ],
    [
      'Alunos ativos',
      data.students.filter((item) => item.status === 'ativo').length,
      'users',
      'bg-cyan-50 text-cyan-700',
    ],
  ] as [string, number, IconName, string][]
  const byClass = data.classes
    .map((item) => ({
      label: item.code,
      value: active.filter((occurrence) => occurrence.classId === item.id).length,
    }))
    .filter((item) => item.value > 0)
  const maxClass = Math.max(...byClass.map((item) => item.value), 1)
  const latest = active
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-[#0b2b52] p-6 text-white shadow-xl shadow-blue-950/10 sm:p-8">
        <div className="absolute -right-12 -top-28 h-64 w-64 rounded-full border-[42px] border-white/5" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-blue-200/60">
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Acompanhamento estudantil
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/65">
              Registre orientações, acompanhe reincidências e mantenha o histórico institucional
              organizado.
            </p>
          </div>
          <button
            onClick={() => setView('ocorrencias')}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#c81e2b] px-5 py-3 text-sm font-semibold shadow-lg shadow-red-950/20 hover:bg-red-700"
          >
            <Icon name="plus" size={18} /> Nova ocorrência
          </button>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map(([label, value, icon, tone]) => (
          <div key={label} className="panel flex items-center gap-4 p-5">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}>
              <Icon name={icon} size={20} />
            </span>
            <div>
              <p className="text-2xl font-bold tracking-tight text-slate-950">{value}</p>
              <p className="mt-0.5 text-xs leading-4 text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <div className="panel p-6">
          <SectionHead title="Ocorrências por turma" subtitle="Distribuição dos registros ativos" />
          <div className="mt-8 flex h-56 items-end gap-2 overflow-x-auto border-b border-slate-200 pb-px">
            {byClass.length ? (
              byClass.map((item) => (
                <div
                  key={item.label}
                  className="flex min-w-12 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-bold text-slate-600">{item.value}</span>
                  <div
                    className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-[#0b2b52] to-blue-400"
                    style={{ height: `${Math.max(12, (item.value / maxClass) * 160)}px` }}
                  />
                  <span className="pb-3 text-[10px] font-semibold text-slate-500">
                    {item.label}
                  </span>
                </div>
              ))
            ) : (
              <Empty compact title="Sem dados para o gráfico" />
            )}
          </div>
        </div>
        <div className="panel p-6">
          <SectionHead title="Por categoria" subtitle="Composição dos registros" />
          <div className="mt-8 space-y-6">
            {(['atraso', 'uniforme', 'outra'] as OccurrenceType[]).map((type, index) => {
              const value = active.filter((item) => item.type === type).length
              const percent = active.length ? Math.round((value / active.length) * 100) : 0
              return (
                <div key={type}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="font-medium text-slate-600">{typeLabel(type)}</span>
                    <strong>
                      {value} · {percent}%
                    </strong>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${['bg-violet-500', 'bg-orange-500', 'bg-blue-600'][index]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            A classificação é apenas um sinalizador de acompanhamento. O sistema não aplica
            penalidades automaticamente.
          </div>
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="p-6">
          <SectionHead
            title="Registros recentes"
            subtitle="Últimas movimentações do sistema"
            action={
              <button
                className="text-xs font-semibold text-blue-700"
                onClick={() => setView('historico')}
              >
                Ver histórico completo
              </button>
            }
          />
        </div>
        <OccurrenceTable data={data} items={latest} />
      </section>
    </div>
  )
}

function Students({ data, update }: { data: AppData; update: UpdateFn }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const filtered = data.students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterClass || student.classId === filterClass),
  )
  function remove(student: Student) {
    if (confirm(`Desativar o cadastro de ${student.name}?`))
      update(
        (current) => ({
          ...current,
          students: current.students.map((item) =>
            item.id === student.id ? { ...item, status: 'inativo' } : item,
          ),
        }),
        { label: 'Desativou aluno', entity: 'aluno', id: student.id },
      )
  }
  return (
    <Module
      title="Estudantes cadastrados"
      description={`${data.students.filter((item) => item.status === 'ativo').length} alunos ativos`}
      action={
        <button
          className="primary-button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          <Icon name="plus" size={17} /> Cadastrar aluno
        </button>
      }
    >
      <Filters search={search} setSearch={setSearch}>
        <select
          className="select"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">Todas as turmas</option>
          {data.classes.map((item) => (
            <option value={item.id} key={item.id}>
              {item.code}
            </option>
          ))}
        </select>
      </Filters>
      {filtered.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Turma</th>
                <th>Situação</th>
                <th>Ocorrências</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id}>
                  <td>
  <p className="font-semibold text-slate-800">{student.name}</p>
</td>
                  <td>
                    <ClassBadge code={classLabel(data.classes, student.classId)} />
                  </td>
                  <td>
                    <StatusBadge value={student.status} />
                  </td>
                  <td>
                    {
                      data.occurrences.filter(
                        (item) => item.studentId === student.id && item.status === 'ativo',
                      ).length
                    }
                  </td>
                  <td>
                    <Actions
                      onEdit={() => {
                        setEditing(student)
                        setOpen(true)
                      }}
                      onDelete={() => remove(student)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title="Nenhum aluno encontrado" />
      )}
      {open && (
        <StudentModal
          data={data}
          student={editing}
          onClose={() => setOpen(false)}

onSave={(student) => {
  const matriculaNormalizada = student.matricula.trim().toLowerCase()

  const duplicado = data.students.some(
    (item) =>
      item.id !== student.id &&
      item.matricula?.trim().toLowerCase() === matriculaNormalizada,
  )

  if (duplicado) {
    alert('Esta matrícula já está cadastrada no sistema!')
    return
  }

  update(
    (current) => ({
      ...current,
      students: editing
        ? current.students.map((item) =>
            item.id === editing.id ? student : item,
          )
        : [student, ...current.students],
    }),
    {
      label: editing ? 'Editou aluno' : 'Cadastrou aluno',
      entity: 'aluno',
      id: student.id,
    },
  )

  setOpen(false)
}}

        />
      )}
    </Module>
  )
}


function StudentModal({
  data,
  student,
  onClose,
  onSave,
}: {
  data: AppData
  student: Student | null
  onClose: () => void
  onSave: (student: Student) => void
}) {
  const [form, setForm] = useState({
    name: student?.name ?? '',
    matricula: student?.matricula ?? '',
    classId:
      student?.classId ??
      data.classes.find((item) => item.status === 'ativo')?.id ??
      '',
    status: student?.status ?? 'ativo',
    pcdNotes: student?.pcdNotes ?? '',
  })

  return (
    <Modal
      title={student ? 'Editar aluno' : 'Cadastrar aluno'}
      subtitle="Dados acadêmicos e observações de acompanhamento"
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave({
            id: student?.id ?? uid('ALU'),
            name: form.name.trim(),
            matricula: form.matricula.trim(),
            classId: form.classId,
            status: form.status as 'ativo' | 'inativo',
            pcdNotes: form.pcdNotes,
            createdAt: student?.createdAt ?? new Date().toISOString(),
          })
        }}
        className="form-grid"
      >
        <Field label="Nome completo" wide>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Field>

        <Field label="Número de matrícula" wide>
          <input
            className="input"
            value={form.matricula}
            onChange={(e) =>
              setForm({ ...form, matricula: e.target.value })
            }
            required
          />
        </Field>

        <Field label="Turma">
          <select
            className="input"
            value={form.classId}
            onChange={(e) => setForm({ ...form, classId: e.target.value })}
            required
          >
            {data.classes
              .filter((item) => item.status === 'ativo')
              .map((item) => (
                <option value={item.id} key={item.id}>
                  {item.code} — {item.course}
                </option>
              ))}
          </select>
        </Field>

        <Field label="Situação">
          <select
            className="input"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as Student['status'] })
            }
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </Field>

        <Field label="Observações relacionadas a PCD" wide>
          <textarea
            className="input min-h-24"
            value={form.pcdNotes}
            onChange={(e) => setForm({ ...form, pcdNotes: e.target.value })}
            placeholder="Registre apenas informações necessárias ao acompanhamento e à acessibilidade."
          />
        </Field>

        <ModalActions
          onClose={onClose}
          label={student ? 'Salvar alterações' : 'Cadastrar aluno'}
        />
      </form>
    </Modal>
  )
}

type UpdateFn = (
  mutator: (current: AppData) => AppData,
  action?: { label: string; entity: string; id: string },
) => void

function OccurrenceModule({
  data,
  update,
  user,
  mode,
}: {
  data: AppData
  update: UpdateFn
  user: Assistant
  mode: OccurrenceType
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Occurrence | null>(null)
  const [search, setSearch] = useState('')
  const items = data.occurrences
    .filter(
      (item) =>
        item.type === mode &&
        item.status === 'ativo' &&
        studentLabel(data.students, item.studentId).toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const copy =
    mode === 'atraso'
      ? ['Atrasos registrados', 'A tolerância institucional é de 15 minutos.']
      : mode === 'uniforme'
        ? [
            'Registros de uniforme',
            'O registro orienta o acompanhamento e não impede automaticamente o acesso à aula.',
          ]
        : [
            'Ocorrências escolares',
            'Registre outras infrações, orientações e etapas de acompanhamento.',
          ]
  function archive(item: Occurrence) {
    if (confirm('Arquivar este registro? O histórico será preservado.'))
      update(
        (current) => ({
          ...current,
          occurrences: current.occurrences.map((occurrence) =>
            occurrence.id === item.id ? { ...occurrence, status: 'arquivado' } : occurrence,
          ),
        }),
        { label: 'Arquivou ocorrência', entity: 'ocorrência', id: item.id },
      )
  }
  return (
    <Module
      title={copy[0]}
      description={copy[1]}
      action={
        <button
          className="primary-button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          <Icon name="plus" size={17} /> Novo registro
        </button>
      }
    >
      {mode === 'uniforme' && (
        <Notice title="Orientações institucionais">
          Uniforme padrão obrigatório, calçado fechado e regras específicas para os terceiros anos.
          Considere o prazo de 30 dias após o início das aulas e registre situações excepcionais
          apenas como observação.
        </Notice>
      )}
      <Filters search={search} setSearch={setSearch} placeholder="Pesquisar pelo nome do aluno…" />
      {items.length ? (
        <OccurrenceTable
          data={data}
          items={items}
          actions={(item) => (
            <Actions
              onEdit={() => {
                setEditing(item)
                setOpen(true)
              }}
              onDelete={() => archive(item)}
            />
          )}
        />
      ) : (
        <Empty title="Nenhum registro nesta categoria" />
      )}
      {open && (
        <OccurrenceModal
          data={data}
          occurrence={editing}
          type={mode}
          user={user}
          onClose={() => setOpen(false)}

onSave={(occurrence) => {
  update(
    (current) => {
      const occurrences = editing
        ? current.occurrences.map((item) =>
            item.id === editing.id ? occurrence : item
          )
        : [occurrence, ...current.occurrences]

      const total = occurrences.filter(
        (item) =>
          item.studentId === occurrence.studentId &&
          item.status === 'ativo'
      ).length

      const simulacoes = current.emailSimulations ?? []

      const jaSimulado = simulacoes.some(
        (item) => item.studentId === occurrence.studentId
      )

      let emailSimulations = simulacoes

      if (!editing && total >= 3 && !jaSimulado) {
        const aluno = current.students.find(
          (item) => item.id === occurrence.studentId
        )

        const turma = current.classes.find(
          (item) => item.id === aluno?.classId
        )

        emailSimulations = [
          {
            id: uid('EMAIL'),
            studentId: occurrence.studentId,
            occurrenceCount: 3,
            sentAt: new Date().toISOString(),
            status: 'simulado',
            recipient: 'DEPE – IFAM Campus Tefé',
            subject: 'Comunicação de aluno com três ocorrências',
            message:
              `SIMULAÇÃO DE E-MAIL — Nenhuma mensagem real foi enviada.\n\n` +
              `Aluno: ${aluno?.name ?? 'Não identificado'}\n` +
              `Turma: ${turma?.code ?? 'Não identificada'}\n` +
              `Total de ocorrências ativas: ${total}\n\n` +
              `Solicitamos que o DEPE tome conhecimento do registro e avalie os procedimentos institucionais cabíveis.\n\n` +
              `SAE – Sistema de Assistência Estudantil\nIFAM – Campus Tefé`,
          },
          ...simulacoes,
        ]
      }

      return {
        ...current,
        occurrences,
        emailSimulations,
      }
    },
    {
      label: editing ? 'Editou ocorrência' : 'Registrou ocorrência',
      entity: 'ocorrência',
      id: occurrence.id,
    }
  )

  setOpen(false)
}}

        />
      )}
    </Module>
  )
}

function OccurrenceModal({
  data,
  occurrence,
  type,
  user,
  onClose,
  onSave,
}: {
  data: AppData
  occurrence: Occurrence | null
  type: OccurrenceType
  user: Assistant
  onClose: () => void
  onSave: (value: Occurrence) => void
}) {
  const students = data.students.filter((item) => item.status === 'ativo')
  const first = students[0]
  const [form, setForm] = useState({
    studentId: occurrence?.studentId ?? first?.id ?? '',
    date: occurrence?.date ?? today(),
    time: occurrence?.time ?? nowTime(),
    subtype: occurrence?.subtype ?? '',
    description: occurrence?.description ?? '',
    justification: occurrence?.justification ?? '',
    notes: occurrence?.notes ?? '',
    classification: occurrence?.classification ?? 'amarelo',
    delayMinutes: occurrence?.delayMinutes?.toString() ?? '',
  })
  const student = data.students.find((item) => item.id === form.studentId)
  const subtypes =
    type === 'uniforme'
      ? [
          'Ausência de uniforme',
          'Uniforme incompleto',
          'Calçado inadequado',
          'Outro descumprimento',
        ]
      : type === 'atraso'
        ? ['Atraso até 15 minutos', 'Atraso acima de 15 minutos', 'Entrada no segundo tempo']
        : [
            'Comportamento inadequado',
            'Descumprimento de orientação',
            'Conflito interpessoal',
            'Outra ocorrência',
          ]
  return (
    <Modal
      title={occurrence ? 'Editar registro' : `Registrar ${type === 'outra' ? 'ocorrência' : type}`}
      subtitle="A data do fato e a data de inserção são registradas separadamente."
      onClose={onClose}
    >
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault()
          if (!student) return
          onSave({
            id: occurrence?.id ?? uid('OCR'),
            studentId: form.studentId,
            classId: student.classId,
            type,
            subtype: form.subtype,
            date: form.date,
            time: form.time,
            delayMinutes: type === 'atraso' ? Number(form.delayMinutes || 0) : undefined,
            description: form.description,
            justification: form.justification,
            notes: form.notes,
            classification: form.classification as Classification,
            responsible: occurrence?.responsible ?? user.name,
            createdAt: occurrence?.createdAt ?? new Date().toISOString(),
            status: occurrence?.status ?? 'ativo',
          })
        }}
      >
        <Field label="Aluno" wide>
          <select
            className="input"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            required
          >
            <option value="">Selecione um aluno</option>
            {students.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name} — {classLabel(data.classes, item.classId)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Data da ocorrência">
          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </Field>
        <Field label={type === 'atraso' ? 'Horário de chegada' : 'Horário'}>
          <input
            type="time"
            className="input"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
          />
        </Field>
        <Field label={type === 'uniforme' ? 'Tipo de irregularidade' : 'Tipo de ocorrência'} wide>
          <select
            className="input"
            value={form.subtype}
            onChange={(e) => setForm({ ...form, subtype: e.target.value })}
            required
          >
            <option value="">Selecione</option>
            {subtypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        {type === 'atraso' && (
          <Field label="Tempo de atraso (minutos)">
            <input
              className="input"
              type="number"
              min="0"
              value={form.delayMinutes}
              onChange={(e) => setForm({ ...form, delayMinutes: e.target.value })}
              required
            />
          </Field>
        )}
        <Field label="Classificação">
          <select
            className="input"
            value={form.classification}
            onChange={(e) =>
              setForm({
                ...form,
                classification: e.target.value as Classification,
              })
            }
          >
            <option value="amarelo">Amarelo — orientação verbal</option>
            <option value="laranja">Laranja — registro por escrito</option>
            <option value="vermelho">Vermelho — atenção / análise do DEPE</option>
          </select>
        </Field>
        <Field label="Descrição da infração" wide>
          <textarea
            className="input min-h-24"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </Field>
        {type === 'atraso' && (
          <Field label="Justificativa" wide>
            <textarea
              className="input min-h-20"
              value={form.justification}
              onChange={(e) => setForm({ ...form, justification: e.target.value })}
            />
          </Field>
        )}
        <Field label="Observações complementares" wide>
          <textarea
            className="input min-h-20"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Field>
        <ModalActions
          onClose={onClose}
          label={occurrence ? 'Salvar alterações' : 'Registrar ocorrência'}
        />
      </form>
    </Modal>
  )
}

function History({ data, update }: { data: AppData; update: UpdateFn }) {
  const [search, setSearch] = useState('')
  const [classId, setClassId] = useState('')
  const [type, setType] = useState('')
  const [classification, setClassification] = useState('')
  const items = data.occurrences
    .filter(
      (item) =>
        item.status === 'ativo' &&
        studentLabel(data.students, item.studentId).toLowerCase().includes(search.toLowerCase()) &&
        (!classId || item.classId === classId) &&
        (!type || item.type === type) &&
        (!classification || item.classification === classification),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
  return (
    <Module
      title="Tabela geral de ocorrências"
      description={`${items.length} registros encontrados`}
      action={
        <button className="secondary-button" onClick={() => exportOccurrences(data, items)}>
          <Icon name="download" size={17} /> Exportar CSV
        </button>
      }
    >
      <Filters search={search} setSearch={setSearch}>
        <select className="select" value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Todas as turmas</option>
          {data.classes.map((item) => (
            <option value={item.id} key={item.id}>
              {item.code}
            </option>
          ))}
        </select>
        <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Todas as categorias</option>
          <option value="atraso">Atrasos</option>
          <option value="uniforme">Uniforme</option>
          <option value="outra">Outras</option>
        </select>
        <select
          className="select"
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
        >
          <option value="">Todas as classificações</option>
          <option value="amarelo">Amarelo</option>
          <option value="laranja">Laranja</option>
          <option value="vermelho">Vermelho</option>
        </select>
      </Filters>
      {items.length ? (
        <OccurrenceTable
          data={data}
          items={items}
          actions={(item) => (
            <button
              className="icon-button text-red-600"
              title="Arquivar"
              onClick={() => {
                if (confirm('Arquivar esta ocorrência?'))
                  update(
                    (current) => ({
                      ...current,
                      occurrences: current.occurrences.map((entry) =>
                        entry.id === item.id ? { ...entry, status: 'arquivado' } : entry,
                      ),
                    }),
                    { label: 'Arquivou ocorrência', entity: 'ocorrência', id: item.id },
                  )
              }}
            >
              <Icon name="trash" size={16} />
            </button>
          )}
        />
      ) : (
        <Empty title="Nenhum registro encontrado" />
      )}
    </Module>
  )
}
function AuditHistory({ data }: { data: AppData }) {
  const [search, setSearch] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')

  const items = [...data.audit]
    .filter((item) =>
      `${item.user} ${item.action} ${item.entity}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .filter((item) => !userFilter || item.user === userFilter)
    .filter((item) => !moduleFilter || item.entity === moduleFilter)
    .sort((a, b) => b.at.localeCompare(a.at))

  const users = [...new Set(data.audit.map((item) => item.user))]
  const modules = [...new Set(data.audit.map((item) => item.entity))]

  return (
    <Module
      title="Auditoria do sistema"
      description={`${items.length} ações registradas`}
    >
      <Filters search={search} setSearch={setSearch}>
        <select
          className="select"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        >
          <option value="">Todos os usuários</option>
          {users.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          className="select"
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
        >
          <option value="">Todos os módulos</option>
          {modules.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </Filters>

      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <strong>{item.action}</strong>
                <span className="text-sm text-slate-500">
                  {new Date(item.at).toLocaleString('pt-BR')}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-600">
                Usuário: {item.user} | Módulo: {item.entity}
              </p>

              <p className="text-sm text-slate-600">
                Registro: {item.entityId}
              </p>

              {item.changes?.length ? (
                <div className="mt-3 space-y-2">
                  {item.changes.map((change, index) => (
                    <div key={`${item.id}-${index}`} className="rounded-lg bg-slate-50 p-3 text-sm">
                      <strong>{change.field}</strong>
                      <p>Antes: {change.before}</p>
                      <p>Depois: {change.after}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Nenhuma alteração detalhada disponível para este registro.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Empty title="Nenhuma ação encontrada" />
      )}
    </Module>
  )
}

function Classes({ data, update }: { data: AppData; update: UpdateFn }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<SchoolClass | null>(null)
  return (
    <Module
      title="Turmas do Campus Tefé"
      description="Nove turmas iniciais cadastradas"
      action={
        <button
          className="primary-button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          <Icon name="plus" size={17} /> Nova turma
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.classes.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[#0b2b52]">
                <Icon name="school" />
              </div>
              <StatusBadge value={item.status} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#0b2b52]">{item.code}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {item.course} · {item.year}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400">
                {
                  data.students.filter(
                    (student) => student.classId === item.id && student.status === 'ativo',
                  ).length
                }{' '}
                alunos
              </span>
              <div className="flex gap-1">
                <button
                  className="icon-button"
                  onClick={() => {
                    setEditing(item)
                    setOpen(true)
                  }}
                >
                  <Icon name="edit" size={16} />
                </button>
                <button
                  className="icon-button text-red-600"
                  onClick={() => {
                    if (confirm('Alterar a situação desta turma?'))
                      update(
                        (current) => ({
                          ...current,
                          classes: current.classes.map((entry) =>
                            entry.id === item.id
                              ? { ...entry, status: entry.status === 'ativo' ? 'inativo' : 'ativo' }
                              : entry,
                          ),
                        }),
                        { label: 'Alterou situação da turma', entity: 'turma', id: item.id },
                      )
                  }}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {open && (
        <ClassModal
          value={editing}
          onClose={() => setOpen(false)}
          onSave={(value) => {
            update(
              (current) => ({
                ...current,
                classes: editing
                  ? current.classes.map((item) => (item.id === editing.id ? value : item))
                  : [...current.classes, value],
              }),
              {
                label: editing ? 'Editou turma' : 'Cadastrou turma',
                entity: 'turma',
                id: value.id,
              },
            )
            setOpen(false)
          }}
        />
      )}
    </Module>
  )
}

function ClassModal({
  value,
  onClose,
  onSave,
}: {
  value: SchoolClass | null
  onClose: () => void
  onSave: (value: SchoolClass) => void
}) {
  const [form, setForm] = useState({
    code: value?.code ?? '',
    course: value?.course ?? '',
    year: value?.year ?? '1º ano',
    status: value?.status ?? 'ativo',
  })
  return (
    <Modal title={value ? 'Editar turma' : 'Cadastrar turma'} onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault()
          onSave({
            id: value?.id ?? uid('TUR'),
            code: form.code.toUpperCase(),
            course: form.course,
            year: form.year,
            status: form.status as 'ativo' | 'inativo',
          })
        }}
      >
        <Field label="Código">
          <input
            className="input uppercase"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
        </Field>
        <Field label="Curso">
          <input
            className="input"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            required
          />
        </Field>
        <Field label="Ano">
          <select
            className="input"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          >
            <option>1º ano</option>
            <option>2º ano</option>
            <option>3º ano</option>
          </select>
        </Field>
        <Field label="Situação">
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as SchoolClass['status'] })}
          >
            <option value="ativo">Ativa</option>
            <option value="inativo">Inativa</option>
          </select>
        </Field>
        <ModalActions onClose={onClose} label="Salvar turma" />
      </form>
    </Modal>
  )
}

function Assistants({
  data,
  update,
  currentUser,
}: {
  data: AppData
  update: UpdateFn
  currentUser: Assistant
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Assistant | null>(null)
  return (
    <Module
      title="Usuários do sistema"
      description="Gerencie perfis e níveis de permissão"
      action={
        <button
          className="primary-button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          <Icon name="plus" size={17} /> Novo usuário
        </button>
      }
    >
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Usuário</th>
              <th>Perfil</th>
              <th>Situação</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.assistants.map((item) => (
              <tr key={item.id}>
                <td className="font-semibold text-slate-800">{item.name}</td>
                <td>{item.username}</td>
                <td className="capitalize">{item.role}</td>
                <td>
                  <StatusBadge value={item.status} />
                </td>
                <td>
                  <Actions
                    onEdit={() => {
                      setEditing(item)
                      setOpen(true)
                    }}
                    onDelete={() => {
                      if (item.id === currentUser.id)
                        return alert('Você não pode desativar a própria conta.')
                      if (confirm('Desativar esta conta?'))
                        update(
                          (current) => ({
                            ...current,
                            assistants: current.assistants.map((entry) =>
                              entry.id === item.id ? { ...entry, status: 'inativo' } : entry,
                            ),
                          }),
                          { label: 'Desativou usuário', entity: 'assistente', id: item.id },
                        )
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <AssistantModal
          value={editing}
          onClose={() => setOpen(false)}
          onSave={(value) => {
            update(
              (current) => ({
                ...current,
                assistants: editing
                  ? current.assistants.map((item) => (item.id === editing.id ? value : item))
                  : [...current.assistants, value],
              }),
              {
                label: editing ? 'Editou usuário' : 'Cadastrou usuário',
                entity: 'assistente',
                id: value.id,
              },
            )
            setOpen(false)
          }}
        />
      )}
    </Module>
  )
}

function AssistantModal({
  value,
  onClose,
  onSave,
}: {
  value: Assistant | null
  onClose: () => void
  onSave: (value: Assistant) => void
}) {
  const [form, setForm] = useState({
    name: value?.name ?? '',
    username: value?.username ?? '',
    password: '',
    role: value?.role ?? 'assistente',
    status: value?.status ?? 'ativo',
  })
  return (
    <Modal title={value ? 'Editar usuário' : 'Cadastrar usuário'} onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={async (e) => {
          e.preventDefault()
          const passwordHash = form.password
            ? await hashPassword(form.password)
            : value?.passwordHash
          if (!passwordHash) return
          onSave({
            id: value?.id ?? uid('USR'),
            name: form.name,
            username: form.username,
            passwordHash,
            role: form.role as Assistant['role'],
            status: form.status as Assistant['status'],
          })
        }}
      >
        <Field label="Nome completo" wide>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Field>
        <Field label="Identificação">
          <input
            className="input"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </Field>
        <Field label={value ? 'Nova senha (opcional)' : 'Senha'}>
          <input
            className="input"
            type="password"
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!value}
          />
        </Field>
        <Field label="Permissão">
          <select
            className="input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Assistant['role'] })}
          >
            <option value="administrador">Administrador</option>
            <option value="assistente">Assistente de alunos</option>
            <option value="professor">Professor</option>
          </select>
        </Field>
        <Field label="Situação">
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Assistant['status'] })}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </Field>
        <ModalActions onClose={onClose} label="Salvar usuário" />
      </form>
    </Modal>
  )
}


function getRecurrences(data: AppData) {
  const map = new Map<
    string,
    { studentId: string; count: number; latest: string }
  >()

  data.occurrences
    .filter((item) => item.status === 'ativo')
    .forEach((item) => {
      const existing = map.get(item.studentId)

      map.set(item.studentId, {
        studentId: item.studentId,
        count: (existing?.count ?? 0) + 1,
        latest:
          existing && existing.latest > item.date
            ? existing.latest
            : item.date,
      })
    })

  return [...map.values()]
    .filter((item) => item.count >= 3)
    .sort((a, b) => b.count - a.count)
}


function Recurrences({ data, setView }: { data: AppData; setView: (view: View) => void }) {
  const items = getRecurrences(data)
  return (
    <Module
      title="Alertas de reincidência"
      description="A contagem considera separadamente atrasos, uniforme e outras ocorrências"
      action={
        <button className="secondary-button" onClick={() => setView('encaminhamentos')}>
          <Icon name="send" size={17} /> Ir para encaminhamentos
        </button>
      }
    >
      <Notice title="Atenção">
        A reincidência é um alerta para análise dos responsáveis. Nenhuma penalidade ou suspensão é
        aplicada automaticamente.
      </Notice>
      {items.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.studentId}
              className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 ring-4 ring-red-50" />
                    <h3 className="font-semibold">{studentLabel(data.students, item.studentId)}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {classLabel(
                      data.classes,
                      data.students.find((student) => student.id === item.studentId)?.classId ?? '',
                    )}{' '}
                    · Todas as categorias
                  </p>
                </div>
                <span className="rounded-xl bg-red-50 px-3 py-2 text-center">
                  <strong className="block text-xl text-red-700">{item.count}</strong>
                  <span className="text-[10px] uppercase text-red-600">registros</span>
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span>Último em {displayDate(item.latest)}</span>
                <span className="font-semibold text-red-700">Requer análise</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Nenhuma reincidência identificada"
          description="Os alertas aparecerão após três registros na mesma categoria."
        />
      )}
    </Module>
  )
}

function Referrals({ data, update, user }: { data: AppData; update: UpdateFn; user: Assistant }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Referral | null>(null)
  return (
    <Module
      title="Encaminhamentos registrados"
      description={`${data.referrals.length} encaminhamentos no histórico`}
      action={
        <button
          className="primary-button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          <Icon name="plus" size={17} /> Novo encaminhamento
        </button>
      }
    >
      {data.referrals.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Data</th>
                <th>Motivo</th>
                <th>Situação</th>
                <th>Responsável</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.referrals.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">{studentLabel(data.students, item.studentId)}</td>
                  <td>{displayDate(item.date)}</td>
                  <td className="max-w-xs truncate">{item.reason}</td>
                  <td>
                    <ReferralBadge value={item.serviceStatus} />
                  </td>
                  <td>{item.responsible}</td>
                  <td>
                    <Actions
                      onEdit={() => {
                        setEditing(item)
                        setOpen(true)
                      }}
                      onDelete={() => {
                        if (confirm('Excluir este encaminhamento?'))
                          update(
                            (current) => ({
                              ...current,
                              referrals: current.referrals.filter((entry) => entry.id !== item.id),
                            }),
                            {
                              label: 'Excluiu encaminhamento',
                              entity: 'encaminhamento',
                              id: item.id,
                            },
                          )
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title="Nenhum encaminhamento registrado" /> 
      )}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div>
          <h3 className="font-semibold text-slate-900">
            Histórico de e-mails simulados
          </h3>
          <p className="text-sm text-slate-500">
            Registro das comunicações simuladas ao DEPE.
          </p>
        </div>

        {data.emailSimulations?.length ? (
          <div className="mt-4 space-y-3">
            {data.emailSimulations.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {studentLabel(data.students, item.studentId)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.recipient}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.subject}
                    </p>
                  </div>

                  <span className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                    E-mail simulado com sucesso
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Simulado em{' '}
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  }).format(new Date(item.sentAt))}
                </p>

                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-blue-700">
                    Ver conteúdo simulado
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm">
                    {item.message}
                  </pre>
                </details>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="Nenhuma simulação registrada"
            description="O histórico aparecerá quando um aluno atingir três ocorrências ativas."
          />
        )}
      </section>

      {open && (
        <ReferralModal
          data={data}
          value={editing}
          user={user}
          onClose={() => setOpen(false)}
          onSave={(value) => {
            update(
              (current) => ({
                ...current,
                referrals: editing
                  ? current.referrals.map((item) => (item.id === editing.id ? value : item))
                  : [value, ...current.referrals],
              }),
              {
                label: editing ? 'Editou encaminhamento' : 'Registrou encaminhamento',
                entity: 'encaminhamento',
                id: value.id,
              },
            )
            setOpen(false)
          }}
        />
      )}
    </Module>
  )
}

function ReferralModal({
  data,
  value,
  user,
  onClose,
  onSave,
}: {
  data: AppData
  value: Referral | null
  user: Assistant
  onClose: () => void
  onSave: (value: Referral) => void
}) {
  const [form, setForm] = useState({
    studentId: value?.studentId ?? '',
    date: value?.date ?? today(),
    reason: value?.reason ?? '',
    serviceStatus: value?.serviceStatus ?? 'pendente',
    notes: value?.notes ?? '',
  })
  const related = data.occurrences.filter(
    (item) => item.studentId === form.studentId && item.status === 'ativo',
  )
  return (
    <Modal
      title={value ? 'Editar encaminhamento' : 'Encaminhar ao DEPE'}
      subtitle="Documente a análise sem aplicar medidas automaticamente."
      onClose={onClose}
    >
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault()
          onSave({
            id: value?.id ?? uid('DEPE'),
            studentId: form.studentId,
            occurrenceIds: related.map((item) => item.id),
            date: form.date,
            reason: form.reason,
            responsible: value?.responsible ?? user.name,
            serviceStatus: form.serviceStatus as Referral['serviceStatus'],
            notes: form.notes,
            createdAt: value?.createdAt ?? new Date().toISOString(),
          })
        }}
      >
        <Field label="Aluno" wide>
          <select
            className="input"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            required
          >
            <option value="">Selecione</option>
            {data.students
              .filter((item) => item.status === 'ativo')
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {classLabel(data.classes, item.classId)}
                </option>
              ))}
          </select>
        </Field>
        <Field label="Data">
          <input
            className="input"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </Field>
        <Field label="Situação">
          <select
            className="input"
            value={form.serviceStatus}
            onChange={(e) =>
              setForm({ ...form, serviceStatus: e.target.value as Referral['serviceStatus'] })
            }
          >
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em análise</option>
            <option value="concluido">Concluído</option>
          </select>
        </Field>
        <Field label="Motivo do encaminhamento" wide>
          <textarea
            className="input min-h-24"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            required
          />
        </Field>
        <Field label="Observações" wide>
          <textarea
            className="input min-h-20"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Field>
        {form.studentId && (
          <div className="col-span-full rounded-xl bg-blue-50 p-3 text-xs text-blue-800">
            {related.length} ocorrência(s) ativa(s) serão vinculadas ao encaminhamento.
          </div>
        )}
        <ModalActions onClose={onClose} label="Salvar encaminhamento" />
      </form>
    </Modal>
  )
}

function Reports({ data, user }: { data: AppData; user: Assistant }) {
  const reports = [
    [
      'Relatório geral de ocorrências',
      'Todos os registros ativos e classificações',
      'alert',
      data.occurrences,
    ],
    [
      'Relatório de atrasos',
      'Chegadas, minutos e justificativas',
      'clock',
      data.occurrences.filter((item) => item.type === 'atraso'),
    ],
    [
      'Relatório de uniforme',
      'Irregularidades por aluno e turma',
      'shirt',
      data.occurrences.filter((item) => item.type === 'uniforme'),
    ],
    [
  'Relatório de reincidência',
  'Alertas por aluno, considerando todas as categorias',
  'repeat',
  data.occurrences.filter((item) =>
    getRecurrences(data).some(
      (rec) => rec.studentId === item.studentId,
    ),
  ),
],
  ] as [string, string, IconName, Occurrence[]][]
  return (
    <Module
      title="Central de relatórios"
      description="Documentos com identificação institucional, data e responsável"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map(([title, description, icon, items]) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5" key={title}>
            <div className="flex gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <Icon name={icon} />
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400">{items.length} registros</span>
              <div className="flex gap-2">
                <button
                  className="secondary-button py-2 text-xs"
                  onClick={() => exportOccurrences(data, items)}
                >
                  <Icon name="download" size={15} /> Excel/CSV
                </button>
                <button
                  className="secondary-button py-2 text-xs"
                  onClick={() => printReport(title, user.name)}
                >
                  <Icon name="file" size={15} /> PDF/Imprimir
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Notice title="Relatórios institucionais">
        A exportação PDF utiliza a caixa de impressão do navegador. Selecione “Salvar como PDF”. Os
        arquivos CSV podem ser abertos diretamente no Excel.
      </Notice>
    </Module>
  )
}

function Settings({ data, update, user }: { data: AppData; update: UpdateFn; user: Assistant }) {
  const [password, setPassword] = useState('')
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Module title="Segurança da conta" description="Altere a senha do usuário conectado">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault()
            const passwordHash = await hashPassword(password)
            update(
              (current) => ({
                ...current,
                assistants: current.assistants.map((item) =>
                  item.id === user.id ? { ...item, passwordHash } : item,
                ),
              }),
              { label: 'Alterou a própria senha', entity: 'assistente', id: user.id },
            )
            setPassword('')
            alert('Senha alterada com sucesso.')
          }}
        >
          <input
            className="input flex-1"
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nova senha (mínimo de 6 caracteres)"
            required
          />
          <button className="primary-button justify-center">Alterar senha</button>
        </form>
      </Module>
      <Module title="Armazenamento local" description="Os dados permanecem somente neste navegador">
        <div className="flex flex-col gap-4 rounded-2xl bg-amber-50 p-5 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl leading-6">
            Esta versão não usa banco de dados. Limpar os dados do navegador removerá todos os
            registros deste dispositivo.
          </p>
          <button
            className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-700"
            onClick={() => {
              if (confirm('Apagar todos os registros locais e restaurar as nove turmas?')) {
                update(() => emptyData)
                window.location.reload()
              }
            }}
          >
            Restaurar sistema
          </button>
        </div>
      </Module>
      <Module title="Auditoria local" description={`${data.audit.length} alterações registradas`}>
        <div className="max-h-80 divide-y divide-slate-100 overflow-auto">
          {data.audit.slice(0, 50).map((item) => (
            <div key={item.id} className="flex justify-between gap-4 py-3 text-xs">
              <div>
                <p className="font-semibold text-slate-700">{item.action}</p>
                <p className="mt-1 text-slate-400">
                  {item.user} · {item.entity}
                </p>
              </div>
              <time className="whitespace-nowrap text-slate-400">
                {new Date(item.at).toLocaleString('pt-BR')}
              </time>
            </div>
          ))}
          {!data.audit.length && <Empty compact title="Nenhuma alteração registrada" />}
        </div>
      </Module>
    </div>
  )
}

function Module({
  title,
  description,
  action,
  children,
}: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0b2b52]">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        {action}
      </div>
      <div className="panel space-y-5 p-4 sm:p-6">{children}</div>
    </section>
  )
}

function SectionHead({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={wide ? 'col-span-full' : ''}>
      <span className="mb-2 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  )
}
function Filters({
  search,
  setSearch,
  placeholder = 'Pesquisar…',
  children,
}: {
  search: string
  setSearch: (value: string) => void
  placeholder?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-3 md:flex-row">
      <label className="relative min-w-0 flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon name="search" size={17} />
        </span>
        <input
          className="input bg-white pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
        />
      </label>
      {children}
    </div>
  )
}
function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[#0b2b52]">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="p-6">{children}</div>
      </section>
    </div>
  )
}
function ModalActions({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <div className="col-span-full mt-2 flex justify-end gap-3 border-t border-slate-100 pt-5">
      <button type="button" className="secondary-button" onClick={onClose}>
        Cancelar
      </button>
      <button className="primary-button">{label}</button>
    </div>
  )
}
function Empty({
  title,
  description,
  compact = false,
}: {
  title: string
  description?: string
  compact?: boolean
}) {
  return (
    <div className={`grid w-full place-items-center text-center ${compact ? 'py-8' : 'py-16'}`}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon name="file" />
      </span>
      <p className="mt-3 text-sm font-semibold text-slate-700">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  )
}
function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-950">
      <span className="mt-0.5 text-blue-600">
        <Icon name="alert" size={18} />
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-blue-900/70">{children}</p>
      </div>
    </div>
  )
}
function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${value === 'ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
    >
      {value}
    </span>
  )
}
function ClassBadge({ code }: { code: string }) {
  return (
    <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
      {code}
    </span>
  )
}
function ReferralBadge({ value }: { value: Referral['serviceStatus'] }) {
  const label = { pendente: 'Pendente', em_analise: 'Em análise', concluido: 'Concluído' }[value]
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${value === 'concluido' ? 'bg-emerald-50 text-emerald-700' : value === 'em_analise' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}
    >
      {label}
    </span>
  )
}
function Actions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <button className="icon-button" title="Editar" onClick={onEdit}>
        <Icon name="edit" size={16} />
      </button>
      <button className="icon-button text-red-600" title="Excluir ou desativar" onClick={onDelete}>
        <Icon name="trash" size={16} />
      </button>
    </div>
  )
}

function OccurrenceTable({
  data,
  items,
  actions,
}: {
  data: AppData
  items: Occurrence[]
  actions?: (item: Occurrence) => ReactNode
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Aluno</th>
            <th>Turma</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Classificação</th>
            <th>Responsável</th>
            {actions && <th className="text-right">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="font-mono text-[10px] text-slate-400">
                {item.id.split('-').slice(-1)}
              </td>
              <td>
                <p className="font-semibold text-slate-800">
                  {studentLabel(data.students, item.studentId)}
                </p>
                <p className="max-w-48 truncate text-[11px] text-slate-400">{item.subtype}</p>
              </td>
              <td>
                <ClassBadge code={classLabel(data.classes, item.classId)} />
              </td>
              <td>
                <p className="font-semibold text-slate-800">
                  {item.subtype || typeLabel(item.type)}
                </p>
                 <p className="text-[10px] text-slate-400">
                  {typeLabel(item.type)}
                </p>
                </td>
              <td>
                {displayDate(item.date)}
                <p className="text-[10px] text-slate-400">{item.time}</p>
              </td>
              <td>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ring-1 ${classTone(item.classification)}`}
                >
                  {item.classification}
                </span>
              </td>
              <td>{item.responsible}</td>
              {actions && <td>{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function exportOccurrences(data: AppData, items: Occurrence[]) {
  const rows = [
    [
      'ID',
      'Aluno',
      'Turma',
      'Tipo',
      'Subtipo',
      'Data',
      'Horário',
      'Classificação',
      'Descrição',
      'Responsável',
    ],
    ...items.map((item) => [
      item.id,
      studentLabel(data.students, item.studentId),
      classLabel(data.classes, item.classId),
      typeLabel(item.type),
      item.subtype,
      item.date,
      item.time,
      item.classification,
      item.description,
      item.responsible,
    ]),
  ]
  const csv =
    '\uFEFF' +
    rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';'))
      .join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `ifam-ocorrencias-${today()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function printReport(title: string, responsible: string) {
  const previous = document.title
  document.title = `${title} - IFAM Campus Tefé - ${responsible}`
  window.print()
  document.title = previous
}
