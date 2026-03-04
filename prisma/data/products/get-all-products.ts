import { getGraphicsCards } from './graphics-cards'
import { getMemory } from './memory'
import { getProcessors } from './processors'

export const getAllProducts = (categoryIds: Record<string, string>) => [
  ...getGraphicsCards(categoryIds),
  ...getProcessors(categoryIds),
  ...getMemory(categoryIds),
]
