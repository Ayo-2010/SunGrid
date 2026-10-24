import type { DemoMessage, DemoMessageChannel } from '#shared/types'

const STORAGE_KEY = 'sungrid-demo-messages-v1'

interface NewMessage {
  channel: DemoMessageChannel
  name: string
  phone: string
  email: string
  subject: string
  body: string
  meta?: string
}

function makeReference(channel: DemoMessageChannel): string {
  const prefix = channel === 'contact' ? 'MSG' : channel === 'service' ? 'SRV' : 'INS'
  return `SG-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
}

/**
 * Contact and service messages are kept in localStorage only. They exist so
 * the demo dashboard can show that a form did something, without pretending
 * that an email or ticket was created on a server.
 */
export function useDemoMessages() {
  const messages = useState<DemoMessage[]>('sungrid-demo-messages', () => [])
  const hydrated = useState<boolean>('sungrid-demo-messages-hydrated', () => false)

  onMounted(() => {
    if (hydrated.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed)) messages.value = parsed as DemoMessage[]
      }
    } catch {
      /* Ignore unavailable storage. */
    }
    hydrated.value = true
  })

  if (import.meta.client) {
    watch(
      messages,
      (value) => {
        if (!hydrated.value) return
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch {
          /* Ignore quota errors in demo mode. */
        }
      },
      { deep: true },
    )
  }

  function add(input: NewMessage): DemoMessage {
    const message: DemoMessage = {
      id: `msg-${Date.now()}`,
      reference: makeReference(input.channel),
      channel: input.channel,
      name: input.name,
      phone: input.phone,
      email: input.email,
      subject: input.subject,
      body: input.body,
      meta: input.meta ?? '',
      read: false,
      createdAt: new Date().toISOString(),
      demo: true,
    }
    messages.value.unshift(message)
    return message
  }

  function markRead(id: string, read = true) {
    const message = messages.value.find((entry) => entry.id === id)
    if (message) message.read = read
  }

  function remove(id: string) {
    messages.value = messages.value.filter((entry) => entry.id !== id)
  }

  const unread = computed(() => messages.value.filter((entry) => !entry.read).length)

  return { messages, unread, add, markRead, remove }
}
