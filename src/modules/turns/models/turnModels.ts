export interface TurnResponse {
  id: number
  name: string
  startTime: string // Representación de TimeSpan (ej. "12:00:00")
  endTime: string // Representación de TimeSpan (ej. "16:00:00")
  isActive: boolean
}

export interface TurnCreate {
  name: string
  startTime: string
  endTime: string
}
