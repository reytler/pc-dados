import { createContext, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface IContextNotification {
  notify: (type: string, msg: string, promise?: Promise<any>) => void
}

export const enumTypeNotification = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  PROMISE: 'PROMISE',
  WARN: 'WARN',
}

const NotificationContext = createContext<IContextNotification | undefined>(
  undefined,
)

export function NotificationProvider({ children }: { children: JSX.Element }) {
  function notify(type: string, msg: string, promise?: Promise<any>) {
    switch (type) {
      case enumTypeNotification.SUCCESS:
        toast.success(msg)
        break
      case enumTypeNotification.ERROR:
        toast.error(msg)
        break
      case enumTypeNotification.WARN:
        toast.custom((t)=>(
          <p style={{
            background:'rgba(255,0,0,0.02)',
            borderRadius: '5px',
            padding:'5px',
            color:'rgba(255,0,0,0.5)'
          }}>
            <i className="bi bi-exclamation-triangle-fill"></i>
            {' '}
            Altere sua senha o mais rápido possível
          </p>
        ),{position:'top-center'})
        break
      case enumTypeNotification.PROMISE:
        toast.promise(promise!, {
          loading: msg,
          success: <b>Dados Carregados</b>,
          error: <b>Erro ao carregar dados</b>,
        })
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
