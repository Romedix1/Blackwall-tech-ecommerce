type NotFoundProps = {
  type: 'order' | 'user'
}

export const NotFound = ({ type }: NotFoundProps) => {
  return (
    <div className="container mx-auto mt-8 flex flex-col items-center gap-4">
      <h1 className="text-error-text text-2xl font-bold">
        {type === 'order' ? 'Directive' : 'Operative'} Not Found
      </h1>
      <p className="text-text-second">This {type} does not exist</p>
    </div>
  )
}
