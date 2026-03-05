import Link from 'next/link'

type PathNavigatorType = {
  productCategory?: string
  productName?: string
}

export const PathNavigator = ({
  productCategory,
  productName,
}: PathNavigatorType) => {
  return (
    <p className="text-text-second text-sm tracking-wider uppercase">
      <span aria-hidden="true">{'//'}</span>
      Root
      <span aria-hidden="true">{'/'}</span>
      <Link href={'/categories'} className="text-hover">
        Hardware
        <span aria-hidden="true">{'/'}</span>
      </Link>
      {productCategory && (
        <>
          <Link href={`/products/${productCategory}`} className="text-hover">
            {productCategory}
            <span aria-hidden="true">{'/'}</span>
          </Link>
        </>
      )}
      {productName && (
        <>
          <span aria-hidden="true" className="opacity-50">
            /
          </span>
          <span className="">{productName}</span>
        </>
      )}
    </p>
  )
}
