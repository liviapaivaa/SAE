import type { AppData } from '@/models/school'

const STORAGE_KEY = 'ifam-tefe-occurrences-v1'

const classes = [
  ['IINF11', 'Informática', '1º ano'],
  ['IINF21', 'Informática', '2º ano'],
  ['IINF31', 'Informática', '3º ano'],
  ['IAGRO11', 'Agropecuária', '1º ano'],
  ['IAGRO21', 'Agropecuária', '2º ano'],
  ['IAGRO31', 'Agropecuária', '3º ano'],
  ['IADM11', 'Administração', '1º ano'],
  ['IADM21', 'Administração', '2º ano'],
  ['IADM31', 'Administração', '3º ano'],
].map(([code, course, year], index) => ({
  id: `turma-${index + 1}`,
  code,
  course,
  year,
  status: 'ativo' as const,
}))

export const emptyData: AppData = {
  classes,
  students: [],
  assistants: [
    {
      id: 'usuario-admin',
      name: 'Administrador do Sistema',
      username: 'admin',
      passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
      role: 'administrador',
      status: 'ativo',
    },
  ],
  occurrences: [],
  referrals: [],
  emailSimulations: [],
  audit: [],
}

export function loadData(): AppData {
  if (typeof window === 'undefined') return emptyData
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? { ...emptyData, ...JSON.parse(stored) } : emptyData
  } catch {
    return emptyData
  }
}

export function saveData(data: AppData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function hashPassword(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}
