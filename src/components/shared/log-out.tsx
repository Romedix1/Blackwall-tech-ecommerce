export const LogOutButton = () => {
  return (
    <button className="text-error-text focus:border-error-text hover:border-error-text hover:animate-glitch focus:animate-glitch w-fit cursor-pointer border border-transparent px-2 text-left uppercase outline-none motion-reduce:animate-none motion-reduce:hover:animate-none motion-reduce:focus:animate-none">
      <span className="sr-only">Log out (sever connection)</span>
      <span aria-hidden="true">[ sever_connection ]</span>
    </button>
  )
}
