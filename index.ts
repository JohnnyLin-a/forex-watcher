/**
 * Entrypoint to this app.
 */

import axios from "axios"
import { setTimeout } from "timers/promises"

// Interfaces
interface CurrencyConfig {
    notifyOver: number | null
    notifyBelow: number | null
    from: string
    to: string
}

interface GlobalConfig {
    discordWebhook: string
    discordMention: string
    currencies: CurrencyConfig[]
}

// load env if needed?
const config: GlobalConfig = process.env.FOREX_WATCHER_CONFIG
    ? JSON.parse(process.env.FOREX_WATCHER_CONFIG)
    : require("./forex-watcher-config.json")

// fetch forex data
;(async () => {
    for (let currencyConfig of config.currencies) {
        await setTimeout(3000)
        const response = await axios.get(
            `https://wise.com/rates/live?source=${currencyConfig.from}&target=${currencyConfig.to}`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                },
            }
        )

        // notify discord according to config
        if (
            (currencyConfig.notifyBelow &&
                response.data.value <= currencyConfig.notifyBelow) ||
            (currencyConfig.notifyOver &&
                response.data.value >= currencyConfig.notifyOver)
        ) {
            await axios.post(config.discordWebhook, {
                content: `${config.discordMention} 1${currencyConfig.from} = ${response.data.value}${currencyConfig.to}`,
            })
        }
    }
})()
