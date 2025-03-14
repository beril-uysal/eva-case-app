/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import api from '../../api'
import type { ActionContext } from 'vuex'
import type { RootState } from '@/types/vuex'
import type { AuthState, User, LoginCredentials } from '@/types/auth'

type Context = ActionContext<AuthState, RootState>

const state: AuthState = {
  token: localStorage.getItem('token') || null,
  user: null,
  marketplaceName: null,
  storeId: null,
}

const mutations = {
  SET_TOKEN(state: AuthState, token: string) {
    state.token = token
    localStorage.setItem('token', token)
  },
  SET_USER(state: AuthState, user: User) {
    state.user = user
  },
  SET_MARKETPLACE_AND_STORE(state: AuthState, { marketplaceName, storeId }: AuthState) {
    state.marketplaceName = marketplaceName
    state.storeId = storeId
  },
  LOGOUT(state: AuthState) {
    state.token = null
    state.user = null
    state.marketplaceName = null
    state.storeId = null
    localStorage.removeItem('token')
  },
}

const actions = {
  async login({ commit, dispatch }: Context, credentials: LoginCredentials): Promise<boolean> {
    const body = {
      Email: credentials.email,
      Password: credentials.password,
      GrantType: 'password',
      Scope: 'amazon_data',
      ClientId: 'C0001',
      ClientSecret: 'SECRET0001',
      RedirectUri: 'https://api.eva.guru',
    }

    try {
      const response = await api.post('/oauth/token', body)

      if (!response.data || !response.data.Data.AccessToken) return false

      commit('SET_TOKEN', response.data.Data.AccessToken)
      await dispatch('fetchUser', { email: credentials.email })

      return true
    } catch (error: any) {
      console.error('Login error:', error.response ? error.response.data : error)
      return false
    }
  },

  async fetchUser({ commit, state }: Context, { email }: { email: string }) {
    if (!state.token) return

    try {
      const response = await api.post(
        '/user/user-information',
        { email },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.data) {
        commit('SET_USER', response.data)
        const storeData = response.data.Data.user.store[0] || {}
        commit('SET_MARKETPLACE_AND_STORE', {
          marketplaceName: storeData.marketplaceName || '',
          storeId: storeData.storeId || '',
        })
      }
    } catch (error: any) {
      console.error(
        'Kullanıcı bilgisi alınamadı:',
        error.response ? error.response.data : error.message,
      )
    }
  },

  async logout({ commit }: Context) {
    if (!state.token) return

    try {
      await api.post('/user/logout', null, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    }

    commit('LOGOUT')
    commit('chart/SET_SELECTED_DAY', 30, { root: true })
    commit('table/CLEAR_TABLE_DATA', null, { root: true })
    commit('chart/CLEAR_CHART_DATA', null, { root: true })
  },
}

const getters = {
  isAuthenticated: (state: AuthState) => !!state.token,
  marketplaceName: (state: AuthState) => state.marketplaceName,
  storeId: (state: AuthState) => state.storeId,
}

const authModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

export default authModule
