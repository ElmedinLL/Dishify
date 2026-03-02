import { jwtDecode } from "jwt-decode"

const TOKEN_KEY = "dishify_token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function decodeToken(token) {
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

export function isTokenValid(token) {
  if (!token) return false
  const decoded = decodeToken(token)
  if (!decoded?.exp) return false
  return decoded.exp * 1000 > Date.now()
}

const EMAIL_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"

export function getStoredUser() {
  const token = getToken()
  if (!token || !isTokenValid(token)) return null
  const decoded = decodeToken(token)
  return {
    email: decoded.email || decoded[EMAIL_CLAIM],
    fullname: decoded.fullname,
    role: decoded.role || decoded[ROLE_CLAIM],
    id: decoded.id || decoded.sub,
  }
}
