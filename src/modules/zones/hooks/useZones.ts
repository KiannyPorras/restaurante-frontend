import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getZones,
  createZone,
  updateZone,
  deleteZone,
  getAllZonesList,
} from '../services/zoneService'
import type { ZoneCreate } from '../models/zoneModels'

export function useZonesQuery(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['zones', page, pageSize],
    queryFn: () => getZones(page, pageSize),
  })
}

export function useAllZonesQuery() {
  return useQuery({
    queryKey: ['zones', 'all-list'],
    queryFn: () => getAllZonesList(),
  })
}

export function useCreateZoneMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (zone: ZoneCreate) => createZone(zone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] })
    },
  })
}

export function useUpdateZoneMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, zone }: { id: number; zone: ZoneCreate }) => updateZone(id, zone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] })
    },
  })
}

export function useDeleteZoneMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] })
    },
  })
}
