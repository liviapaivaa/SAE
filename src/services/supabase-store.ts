
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
export async function saveSupabaseData(data: AppData): Promise<void> {
  const supabase = createClientBrowser()

  const syncTable = async (
    table: string,
    rows: Record<string, unknown>[],
  ) => {
    const validIds = rows.map((r) => String(r.id)).filter(Boolean)

    if (validIds.length > 0) {
      await supabase
        .from(table)
        .delete()
        .not('id', 'in', `(${validIds.map((id) => `"${id}"`).join(',')})`)

      const { error } = await supabase.from(table).upsert(rows)
      if (error) console.error(`Erro ao salvar em ${table}:`, error.message)
    } else {
      await supabase.from(table).delete().neq('id', '')
    }
  }

  await Promise.all([
    syncTable(
      'classes',
      data.classes.map((c) => ({
        id: c.id,
        code: c.code,
        course: c.course,
        year: c.year,
        status: c.status,
      })),
    ),
    syncTable(
      'students',
      data.students.map((s) => ({
        id: s.id,
        name: s.name,
        matricula: s.matricula,
        class_id: s.classId,
        status: s.status,
        pcd_notes: s.pcdNotes ?? null,
        created_at: s.createdAt,
      })),
    ),
    syncTable(
      'assistants',
      data.assistants.map((a) => ({
        id: a.id,
        name: a.name,
        username: a.username,
        role: a.role,
        status: a.status,
      })),
    ),
    syncTable(
      'occurrences',
      data.occurrences.map((o) => ({
        id: o.id,
        student_id: o.studentId,
        class_id: o.classId,
        type: o.type,
        subtype: o.subtype,
        date: o.date,
        time: o.time,
        delay_minutes: o.delayMinutes ?? null,
        description: o.description,
        justification: o.justification ?? null,
        notes: o.notes ?? null,
        classification: o.classification,
        responsible: o.responsible,
        created_at: o.createdAt,
        status: o.status,
      })),
    ),
    syncTable(
      'referrals',
      data.referrals.map((r) => ({
        id: r.id,
        student_id: r.studentId,
        occurrence_ids: r.occurrenceIds,
        date: r.date,
        reason: r.reason,
        responsible: r.responsible,
        service_status: r.serviceStatus,
        notes: r.notes ?? null,
        created_at: r.createdAt,
      })),
    ),
    syncTable(
      'email_simulations',
      data.emailSimulations.map((e) => ({
        id: e.id,
        student_id: e.studentId,
        occurrence_count: e.occurrenceCount,
        sent_at: e.sentAt,
        status: e.status,
        recipient: e.recipient,
        subject: e.subject,
        message: e.message,
      })),
    ),
    syncTable(
      'audit',
      data.audit.map((aud) => ({
        id: aud.id,
        at: aud.at,
        user: aud.user,
        action: aud.action,
        entity: aud.entity,
        entity_id: aud.entityId,
        changes: aud.changes,
      })),
    ),
  ])
}
