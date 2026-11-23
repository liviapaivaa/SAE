export type Status = 'ativo' | 'inativo'
export type Role = 'administrador' | 'assistente' | 'professor'
export type Classification = 'amarelo' | 'laranja' | 'vermelho'
export type OccurrenceType = 'atraso' | 'uniforme' | 'outra'

export type SchoolClass = {
  id: string
  code: string
  course: string
  year: string
  status: Status
}

export type Student = {
  id: string
  name: string
  matricula: string
  classId: string
  status: Status
  pcdNotes?: string
  createdAt: string
}

export type Assistant = {
  id: string
  name: string
  username: string
  passwordHash: string
  role: Role
  status: Status
}

export type Occurrence = {
  id: string
  studentId: string
  classId: string
  type: OccurrenceType
  subtype: string
  date: string
  time: string
  delayMinutes?: number
  description: string
  justification?: string
  notes?: string
  classification: Classification
  responsible: string
  createdAt: string
  status: 'ativo' | 'arquivado'
}

export type Referral = {
  id: string
  studentId: string
  occurrenceIds: string[]
  date: string
  reason: string
  responsible: string
  serviceStatus: 'pendente' | 'em_analise' | 'concluido'
  notes?: string
  createdAt: string
}

export type EmailSimulation = {
  id: string
  studentId: string
  occurrenceCount: number
  sentAt: string
  status: 'simulado'
  recipient: string
  subject: string
  message: string
}

export type AuditEntry = {
  id: string
  at: string
  user: string
  action: string
  entity: string
  entityId: string
}
export type AppData = {
  classes: SchoolClass[]
  students: Student[]
  assistants: Assistant[]
  occurrences: Occurrence[]
  referrals: Referral[]
  emailSimulations: EmailSimulation[]
  audit: AuditEntry[]
}

