/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'vuex' {
  export interface ActionContext<S, R> {
    commit: Commit
    dispatch: Dispatch
    state: S
    rootState: R
    getters: any
    rootGetters: any
  }

  export type Commit = (type: string, payload?: any) => void
  export type Dispatch = (type: string, payload?: any) => any
}

export interface RootState {
  auth: {
    token: string | null
    user: {
      storeId: string
      marketplaceName: string
      email: string
    } | null
    marketplaceName: string | null
    storeId: string | null
  }
}
