import { Session } from 'next-auth'

export const adminSession: Session = {
  user: { id: '2', name: 'John', email: 'John@test.pl', role: 'admin' },
  expires: '9999',
}

export const userSession: Session = {
  ...adminSession,
  user: { ...adminSession.user, role: 'user' },
}
