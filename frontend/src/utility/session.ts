import { UserCredentials } from "./use-auth-client"

export const getSession = (name: string) => {
  const data = sessionStorage.getItem(name)
  return data ? JSON.parse(data) : null
}

export const setSession = <T>(name: string, data: T) => {
  sessionStorage.setItem(name, JSON.stringify(data))
}

export const clearSession = (name: string) => {
  sessionStorage.removeItem(name)
}


