import { makeObservable, observable, action, computed } from 'mobx'

// makeObservable is the explicit API — you declare each field's role.
// Use it when you want precise control (vs makeAutoObservable which infers everything).
export class CounterStore {
  // observable: MobX tracks this value — any component reading it will re-render on change
  count = 0
  step = 1

  constructor() {
    makeObservable(this, {
      count:       observable,
      step:        observable,
      increment:   action,      // action: mutates observable state and batches updates
      decrement:   action,
      setStep:     action,
      reset:       action,
      doubled:     computed,    // computed: derived value, memoized until dependencies change
      isPositive:  computed,
    })
  }

  increment() { this.count += this.step }
  decrement() { this.count -= this.step }
  setStep(n: number) { this.step = n }
  reset() { this.count = 0 }

  // computed values are cached — only recalculated when count changes
  get doubled() { return this.count * 2 }
  get isPositive() { return this.count > 0 }
}

export const counterStore = new CounterStore()
