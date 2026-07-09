import { ProductForm } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/product-form'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('Product form', () => {
  it('Should render all base inputs with initial data', () => {
    const productMock = {
      name: 'AMD Ryzen 9 PRO 7945',
      slug: 'amd-ryzen-9-pro-7945',
      badge: null,
      price: 579,
      quantity: 3,
      id: 'test-product-id',
      categoryId: 'test-category-id',
      createdAt: new Date(),
      createdById: 'test-user-id',
      technical: {},
      specification: [],
      performance: [],
    }

    render(
      <ProductForm
        mode="edit"
        productCategory="motheboards"
        initialData={productMock}
        techKeyOptions={[]}
        techValueOptions={[]}
        specLabelOptions={[]}
        specKeyOptions={[]}
        specValueOptions={[]}
        categories={['gpu', 'motherboards']}
      />,
    )

    expect(screen.getByDisplayValue('AMD Ryzen 9 PRO 7945')).toBeInTheDocument()
    expect(screen.getByDisplayValue('579')).toBeInTheDocument()
    expect(screen.getByDisplayValue('3')).toBeInTheDocument()
  })

  it('Should render performance section if product category is CPU or GPU', () => {
    const productMock = {
      name: 'AMD Ryzen 9 PRO 7945',
      slug: 'amd-ryzen-9-pro-7945',
      badge: null,
      price: 579,
      quantity: 3,
      id: 'test-product-id',
      categoryId: 'test-category-id',
      category: { slug: 'gpu' },
      createdAt: new Date(),
      createdById: 'test-user-id',
      technical: {},
      specification: [],
      performance: [
        {
          gameName: 'Cyberpunk',
          fps: 140,
          settings: 'Ultra',
        },
      ],
    }

    render(
      <ProductForm
        mode="edit"
        initialData={productMock}
        productCategory={productMock.category.slug}
        techKeyOptions={[]}
        techValueOptions={[]}
        specLabelOptions={[]}
        specKeyOptions={[]}
        specValueOptions={[]}
        categories={['cpu', 'gpu']}
      />,
    )

    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Cyberpunk')).toBeInTheDocument()
    expect(screen.getByDisplayValue(140)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Ultra')).toBeInTheDocument()
  })
})
