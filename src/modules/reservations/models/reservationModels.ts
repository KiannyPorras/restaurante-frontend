export interface ClientCreate {
  name: string
  lastName: string
  phone: string
}

export interface ClientResponse {
  id: number
  name: string
  lastName: string
  phone: string
}

export interface ReservationCreate {
  clientId: number
  tableId: number
  date: string // YYYY-MM-DD
  reservationTime: string // HH:MM:SS
  guestCount: number
}

export interface ReservationResponse {
  id: number
  clientId: number
  clientName: string
  clientLastName: string
  clientPhone: string
  tableId: number
  tableNumber: string
  zoneName: string
  date: string // YYYY-MM-DD
  reservationTime: string // HH:MM:SS
  guestCount: number
  status: 'Pendiente' | 'Atendido' | 'Cancelado' | string
  turnName?: string
}

export interface ReservationHistoryResponse {
  id: number
  reservationId: number
  status: string
  changeDate: string // YYYY-MM-DDTHH:MM:SS
  details: string
}

export interface AvailableTableResponse {
  id: number
  number: string
  capacity: number
  sectionId: number
  sectionName: string
  zoneId: number
  zoneName: string
}
