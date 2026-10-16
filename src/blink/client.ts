import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'evidence-board-site-52zy0dfe',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_zMKZplhVZySOzifq0LoeEPnAJtWJLTbE',
  authRequired: false,
  auth: { mode: 'managed' },
})
