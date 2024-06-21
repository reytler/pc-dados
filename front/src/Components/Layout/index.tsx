import { NavigationBar } from '../Navigationbar'
import { Title } from '../Title'

interface IpropsLayout {
  title: string
  children: JSX.Element
}

export function Layout({ children, title }: IpropsLayout) {
  return (
    <div>
      <NavigationBar />
      <div
        style={{
          margin: '0 5px 0 8px',
        }}
      >
        <Title>{title}</Title>
        {children}
      </div>
    </div>
  )
}
