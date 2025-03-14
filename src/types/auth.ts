export interface User {
  storeId: string
  marketplaceName: string
  email: string
  store?: {
    storeId: string
    marketplaceName: string
  }[]
}

export interface AuthState {
  token: string | null
  user: User | null
  marketplaceName: string | null
  storeId: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}
