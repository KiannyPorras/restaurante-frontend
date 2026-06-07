export interface SectionResponse {
  id: number
  name: string
  zoneId: number
  zoneName: string
}

export interface SectionCreate {
  name: string
  zoneId: number
}
