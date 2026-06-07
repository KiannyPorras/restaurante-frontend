export interface TableLockCreate {
  tableId: number
  from: string // YYYY-MM-DDTHH:MM:SS or YYYY-MM-DD
  to: string // YYYY-MM-DDTHH:MM:SS or YYYY-MM-DD
  reason: string
}

export interface TableLockResponse {
  id: number
  tableId: number
  tableNumber: string
  from: string
  to: string
  reason: string
}
