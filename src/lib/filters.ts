import { Prisma } from '../../generated/prisma'

export function mapUrlParamsToPrismaFilters(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const { search: _, ...attributeParams } = searchParams

  return Object.entries(attributeParams)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => ({
      specification: {
        array_contains: [
          {
            attributes: [{ key: key, value: value as Prisma.InputJsonValue }],
          },
        ],
      },
    }))
}
