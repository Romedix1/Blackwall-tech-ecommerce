export const LogOutButton = () => {
  return (
    <button className="text-error-text hover:animate-glitch focus:animate-glitch px-2 text-left uppercase motion-reduce:animate-none motion-reduce:hover:animate-none motion-reduce:focus:animate-none">
      <span className="sr-only">Log out (sever connection)</span>
      <span aria-hidden="true">[ sever_connection ]</span>
    </button>
  )
}
