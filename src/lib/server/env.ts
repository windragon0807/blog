import 'server-only'

export function getNodeEnv() {
  return process.env.NODE_ENV
}

export function getNotionApiKey() {
  return process.env.NOTION_API_KEY
}

export function getNotionDatabaseId() {
  return process.env.NOTION_DATABASE_ID
}

export function getNotionPortfolioDatabaseId() {
  return process.env.NOTION_PORTFOLIO_DATABASE_ID
}

export function getNotionWebhookVerificationToken() {
  return process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN
}

export function getPublicSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL
}
