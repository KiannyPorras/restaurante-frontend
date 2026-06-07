import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSections,
  getSectionsByZone,
  createSection,
  updateSection,
  deleteSection,
  getAllSectionsList,
} from '../services/sectionService'
import type { SectionCreate } from '../models/sectionModels'

export function useSectionsQuery(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['sections', page, pageSize],
    queryFn: () => getSections(page, pageSize),
  })
}

export function useAllSectionsQuery() {
  return useQuery({
    queryKey: ['sections', 'all-list'],
    queryFn: () => getAllSectionsList(),
  })
}

export function useSectionsByZoneQuery(zoneId: number) {
  return useQuery({
    queryKey: ['sections', 'zone', zoneId],
    queryFn: () => getSectionsByZone(zoneId),
    enabled: !!zoneId,
  })
}

export function useCreateSectionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (section: SectionCreate) => createSection(section),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    },
  })
}

export function useUpdateSectionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, section }: { id: number; section: SectionCreate }) => updateSection(id, section),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    },
  })
}

export function useDeleteSectionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    },
  })
}
