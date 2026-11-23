
import { createClientBrowser } from '@/lib/supabase-browser'
import type { AppData } from '@/models/school'

export async function loadSupabaseData(): Promise<AppData> {
  const supabase = createClientBrowser()

  const tables = [
    'classes',
    'students',
    'assistants',
    'occurrences',
    'referrals',
    'email_simulations',
    'audit',
  ] as const

  const results = await Promise.all(
    tables.map(async (table) => {
      const { data, error } = await supabase
        .from(table)
        .select('*')

      if (error) {
        throw new Error(`Erro ao carregar ${table}: ${error.message}`)
      }

      return data ?? []
    }),
  )

  const [classes, students, assistants, occurrences, referrals, emailSimulations, audit] = results

  return {
    classes: classes.map((item: any) => ({
      id: item.id,
      code: item.code,
      course: item.course,
      year: item.year,
      status: item.status,
    })),

    students: students.map((item: any) => ({
      id: item.id,
      name: item.name,
      matricula: item.matricula,
      classId: item.class_id,
      status: item.status,
      pcdNotes: item.pcd_notes,
      createdAt: item.created_at,
    })),

    assistants: assistants.map((item: any) => ({
      id: item.id,
      name: item.name,
      username: item.email || item.username,
      passwordHash: '',
      role: item.role,
      status: item.status,
    })),

    occurrences: occurrences.map((item: any) => ({
      id: item.id,
      studentId: item.student_id,
      classId: item.class_id,
      type: item.type,
      subtype: item.subtype,
      date: item.date,
      time: item.time,
      delayMinutes: item.delay_minutes,
      description: item.description,
      justification: item.justification,
      notes: item.notes,
      classification: item.classification,
      responsible: item.responsible,
      createdAt: item.created_at,
      status: item.status,
    })),

    referrals: referrals.map((item: any) => ({
      id: item.id,
      studentId: item.student_id,
      occurrenceIds: item.occurrence_ids,
      date: item.date,
      reason: item.reason,
      responsible: item.responsible,
      serviceStatus: item.service_status,
      notes: item.notes,
      createdAt: item.created_at,
    })),

    emailSimulations: emailSimulations.map((item: any) => ({
      id: item.id,
      studentId: item.student_id,
      occurrenceCount: item.occurrence_count,
      sentAt: item.sent_at,
      status: item.status,
      recipient: item.recipient,
      subject: item.subject,
      message: item.message,
    })),

    audit: audit.map((item: any) => ({
      id: item.id,
      at: item.at,
      user: item.user,
      action: item.action,
      entity: item.entity,
      entityId: item.entity_id,
      changes: item.changes,
    })),
  }
}
