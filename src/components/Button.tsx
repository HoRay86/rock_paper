interface ButtonProps{
    children: string
    onClick: () => void
    disabled?: boolean
}

const Button = ({children, onClick, disabled}: ButtonProps) => {
  return (
    <div className={`m-2 btn btn-info ${disabled ? 'disabled' : ''}`} onClick={onClick}>{children}</div>
  )
}

export default Button