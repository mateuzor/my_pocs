import { makeAutoObservable, autorun, reaction, when } from 'mobx'

export class ReactionStore {
  temperature = 20
  logs: string[] = []

  constructor() {
    makeAutoObservable(this)

    // autorun: runs immediately and re-runs whenever any observable it reads changes.
    // Good for side effects that should always stay in sync with state.
    autorun(() => {
      this.logs.push(`[autorun] temperature is now ${this.temperature}°C`)
    })

    // reaction: separates WHAT to track from WHAT to do.
    // First fn (data fn) — only this is tracked. Second fn (effect fn) — runs when the tracked value changes, not on init.
    reaction(
      () => this.temperature > 30,
      (isHot) => {
        this.logs.push(`[reaction] isHot changed → ${isHot ? '🔥 Too hot!' : '✓ Comfortable'}`)
      }
    )

    // when: one-shot reaction — fires once when predicate becomes true, then disposes itself
    when(
      () => this.temperature >= 100,
      () => this.logs.push('[when] 💧 Water is boiling!')
    )
  }

  setTemperature(t: number) { this.temperature = t }
  clearLogs() { this.logs = [] }
}

export const reactionStore = new ReactionStore()
