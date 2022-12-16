/**
 * Entrypoint to this app.
 */

import child_process from "child_process"
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
    ; (async () => {
        for (let [i, currencyConfig] of config.currencies.entries()) {
            if (i = 0) await setTimeout(3000)

            const data = JSON.stringify({
                "sourceAmount": 1000,
                "sourceCurrency": currencyConfig.from,
                "targetCurrency": currencyConfig.to,
                "preferredPayIn": null,
                "guaranteedTargetAmount": false,
                "type": "REGULAR"
            })

            // Using curl way, otherwise axios will throw a cloudflare error 1020.
            const execOutput = child_process.spawnSync('curl', ['-X', 'POST', '-d', data, '-H', 'content-type: application/json', '-H', 'accept: application/json', 'https://wise.com/gateway/v3/quotes/'])

            if (execOutput.error) throw execOutput.error;

            const response = JSON.parse(String(execOutput.stdout))

            // notify discord according to config
            if (
                (currencyConfig.notifyBelow &&
                    response.rate <= currencyConfig.notifyBelow) ||
                (currencyConfig.notifyOver &&
                    response.rate >= currencyConfig.notifyOver)
            ) {
                await axios.post(config.discordWebhook, {
                    content: `${config.discordMention} 1${currencyConfig.from} = ${response.rate}${currencyConfig.to}`,
                })
            }
        }
    })()
