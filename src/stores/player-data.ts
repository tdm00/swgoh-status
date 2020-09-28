import { forEach, keyBy } from 'lodash'
import { Writable, writable } from 'svelte/store'

import fetch_json from '../utils/fetch-json'
import getCachedData from '../utils/get-cached-data'

export const loading = writable(true)
export const player = writable({})
export const units = writable({})

export const fetch = async function() {
    const match = document.location.search.match(/^\?player=(\d{9,})$/)
    if (match) {
        const player_id = match[1]
        const data = await getCachedData(`player_${player_id}`, 3600000, async () => {
            return await fetch_json(`https://swgoh.gg/api/player/${player_id}/`)
        })

        const parsed = JSON.parse(data)

        let sigh = {}
        forEach(parsed.units, function(unit) {
            sigh[unit.data.name] = unit.data
        })

        player.set(parsed.data)
        units.set(sigh)
        loading.set(false)
    }
}

export default {
    loading,
    player,
    fetch,
}