export type TechnicalType = Record<string, string | number | boolean | string[]>

export type SpecAttribute = {
  key: string
  value: string
}

export type SpecSection = {
  id: string
  label: string
  attributes: SpecAttribute[]
}

export type PerformanceType = {
  fps: number | ''
  gameName: string
  settings: string
}
