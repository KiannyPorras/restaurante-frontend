import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTables,
  getTablesBySection,
  createTable,
  updateTable,
  activateTable,
  deactivateTable,
  deleteTable,
} from '../services/tableService'
import type { TableCreate } from '../models/tableModels'

export function useTablesQuery(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['tables', page, pageSize],
    queryFn: () => getTables(page, pageSize),
  })
}

export function useTablesBySectionQuery(sectionId: number) {
  return useQuery({
    queryKey: ['tables', 'section', sectionId],
    queryFn: () => getTablesBySection(sectionId),
    enabled: !!sectionId,
  })
}

export function useCreateTableMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (table: TableCreate) => createTable(table),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

export function useUpdateTableMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, table }: { id: number; table: TableCreate }) => updateTable(id, table),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

export function useToggleTableActivationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      active ? activateTable(id) : deactivateTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

export function useDeleteTableMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}
