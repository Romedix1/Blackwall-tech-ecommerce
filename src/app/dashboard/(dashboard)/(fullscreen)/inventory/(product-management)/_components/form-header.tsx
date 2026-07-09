import { ReactNode } from 'react'

type FormHeaderType = {
  children: ReactNode
}

export const FormHeader = ({ children }: FormHeaderType) => {
  return (
    <h3 className="text-accent mb-4 text-xl font-bold uppercase">{children}</h3>
  )
}
