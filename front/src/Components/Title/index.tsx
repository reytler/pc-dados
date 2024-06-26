export function Title({ children }: { children: string }) {
  return (
    <span
      style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'grey',
        display: 'block',
      }}
    >
      {children}
      {' >'}
    </span>
  )
}
