export interface TableResponse {
  id: number
  number: string
  capacity: number
  isActive: boolean
  sectionId: number
  sectionName: string
  zoneName: string
}

export interface TableCreate {
  number: string
  capacity: number
  sectionId: number
}
