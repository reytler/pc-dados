import { NotificationProvider } from './Notification'

export function ContextGlobalProvider({ children }: { children: JSX.Element }) {
  return <NotificationProvider>{children}</NotificationProvider>
}
