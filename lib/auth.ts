'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'

// Секретный ключ для JWT (в продакшене использовать переменную окружения!)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
)

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_COOKIE = 'session'
const SESSION_DURATION = 60 * 60 // 1 час в секундах

export interface SessionPayload {
  isAdmin: boolean
  exp: number
}

/**
 * Создает JWT токен с указанным временем истечения
 */
async function createToken(expiresIn: number = SESSION_DURATION): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + expiresIn
  
  return new SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(exp)
    .setIssuedAt()
    .sign(JWT_SECRET)
}

/**
 * Верифицирует JWT токен и возвращает payload
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

/**
 * Авторизация пользователя
 */
export async function login(formData: FormData) {
  const password = formData.get('password') as string
  
  if (password === ADMIN_PASSWORD) {
    const token = await createToken()
    const cookieStore = await cookies()
    
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
      path: '/',
    })
    
    redirect('/admin')
  }
  
  return { error: 'Неверный пароль' }
}

/**
 * Выход из системы
 */
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/login')
}

/**
 * Проверка текущей сессии
 */
export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)
  
  if (!sessionCookie?.value) {
    return false
  }
  
  const payload = await verifyToken(sessionCookie.value)
  return payload?.isAdmin === true
}

/**
 * Обновление сессии (скользящая сессия) - используется в middleware
 */
export async function refreshSession(): Promise<string> {
  return createToken()
}
