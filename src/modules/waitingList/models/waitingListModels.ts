export interface WaitingListCreate {
  clientId: number
  desiredDay: string // YYYY-MM-DD
  desiredTime: string // HH:MM:SS
  guestCount: number
  preferZone: string // Preferred zone name/string
}

export interface WaitingListResponse {
  id: number
  clientId: number
  clientName: string
  clientLastName: string
  clientPhone: string
  desiredDay: string // YYYY-MM-DD
  desiredTime: string // HH:MM:SS
  guestCount: number
  preferZone: string
  status: 'Pendiente' | 'Asignado' | string
}
