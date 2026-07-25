export const ItemSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="skeleton-loading border-b">
          <td colSpan={6}>
            <div className="h-30 w-full" />
          </td>
        </tr>
      ))}
    </>
  )
}
