import { createContext, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface IContextNotification {
  notify: (type: string, msg: string) => void
}

const NotificationContext = createContext<IContextNotification | undefined>(
  undefined,
)

export function NotificationProvider({ children }: { children: JSX.Element }) {
  function notify(type: string, msg: string) {
    switch (type) {
      case 'SUCCESS':
        toast.success(msg)
        break
      case 'ERROR':
        toast.error(msg)
        break
      default:
        toast.success(msg)
    }
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = (): IContextNotification => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotification deve ser usado dentro de um NotificationProvider',
    )
  }
  return context
}
