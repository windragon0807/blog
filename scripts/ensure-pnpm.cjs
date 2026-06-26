const userAgent = process.env.npm_config_user_agent || ''
const execPath = process.env.npm_execpath || ''

const isPnpm =
  userAgent.startsWith('pnpm/') ||
  userAgent.includes(' pnpm/') ||
  execPath.includes('/pnpm') ||
  execPath.includes('\\pnpm')

if (!isPnpm) {
  console.error('\nThis project uses pnpm. Run `pnpm install` instead.\n')
  process.exit(1)
}
