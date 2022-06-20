/**
 * Entrypoint to this app.
 */

// Interfaces
interface CurrencyConfig {
    notifyOver: number | null
    notifyBelow: number | null
    from: string
    to: string
}

interface GlobalConfig {
    discordWebhook: string
    currencies: CurrencyConfig[]
}

// load env if needed?
const config: GlobalConfig = process.env.FOREX_WATCHER_CONFIG
    ? JSON.parse(process.env.FOREX_WATCHER_CONFIG)
    : require("forex-watcher-config.json")

// fetch forex data
config.currencies.forEach((currencyConfig) => {
    
})

// notify discord according to config
