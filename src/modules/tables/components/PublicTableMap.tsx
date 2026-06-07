import { useState, useMemo } from 'react'
import { useAllZonesQuery } from '@/modules/zones/hooks/useZones'
import { useAllSectionsQuery } from '@/modules/sections/hooks/useSections'
import { useTablesQuery } from '../hooks/useTables'
import type { TableResponse } from '../models/tableModels'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Map,
  Layers,
  Users,
  AlertTriangle,
  Grid,
  CheckCircle2
} from 'lucide-react'

interface PublicTableMapProps {
  availableTables: any[]
  selectedTable: any | null
  onSelectTable: (table: any) => void
}

interface TablePosition {
  x: number // percentage (0-100)
  y: number // percentage (0-100)
}

interface TablePositionsMap {
  [tableId: number]: TablePosition
}

// Helper to determine chair positions based on capacity and table shape
function getChairPositions(capacity: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  if (capacity === 1) {
    positions.push({ x: 50, y: 12 }) // Top
  } else if (capacity === 2) {
    positions.push({ x: 50, y: 12 })
    positions.push({ x: 50, y: 88 })
  } else if (capacity === 3) {
    positions.push({ x: 50, y: 12 })
    positions.push({ x: 50, y: 88 })
    positions.push({ x: 12, y: 50 })
  } else if (capacity === 4) {
    positions.push({ x: 50, y: 12 })   // Top
    positions.push({ x: 50, y: 88 })   // Bottom
    positions.push({ x: 12, y: 50 })   // Left
    positions.push({ x: 88, y: 50 })   // Right
  } else if (capacity <= 6) {
    positions.push({ x: 25, y: 12 })
    positions.push({ x: 50, y: 12 })
    positions.push({ x: 75, y: 12 })
    positions.push({ x: 25, y: 88 })
    positions.push({ x: 50, y: 88 })
    positions.push({ x: 75, y: 88 })
  } else {
    const topBottomCount = Math.floor((capacity - 2) / 2)
    for (let i = 0; i <= topBottomCount; i++) {
      const x = 20 + (60 * i) / topBottomCount
      positions.push({ x, y: 12 })
    }
    for (let i = 0; i <= topBottomCount; i++) {
      const x = 20 + (60 * i) / topBottomCount
      positions.push({ x, y: 88 })
    }
    positions.push({ x: 10, y: 50 })
    positions.push({ x: 90, y: 50 })
  }
  return positions
}

export function PublicTableMap({ availableTables, selectedTable, onSelectTable }: PublicTableMapProps) {
  // Queries
  const { data: zones = [], isLoading: isLoadingZones, isError: isErrorZones } = useAllZonesQuery()
  const { data: sections = [], isLoading: isLoadingSections, isError: isErrorSections } = useAllSectionsQuery()
  const { data: pagedTables, isLoading: isLoadingTables, isError: isErrorTables } = useTablesQuery(1, 100)

  // Selected Zone ID state
  const [selectedZoneStateId, setSelectedZoneStateId] = useState<number | null>(null)

  // Resolve active zone ID (defaults to the first zone with available tables, or first zone overall)
  const selectedZoneId = useMemo(() => {
    if (selectedZoneStateId !== null) return selectedZoneStateId
    if (zones.length === 0) return null
    // Prefer first zone that has at least one available table
    const zoneWithAvailable = zones.find(z => availableTables.some(at => at.zoneId === z.id))
    return zoneWithAvailable ? zoneWithAvailable.id : zones[0].id
  }, [zones, availableTables, selectedZoneStateId])

  // Local coordinates state (loaded from localStorage & merged with defaults)
  const [positions] = useState<TablePositionsMap>(() => {
    try {
      const stored = localStorage.getItem('chefstack_table_layout_positions')
      return stored ? JSON.parse(stored) : {}
    } catch (e) {
      console.error('Error reading table positions from localStorage', e)
      return {}
    }
  })

  // Filter sections by selected zone
  const activeSections = useMemo(() => {
    if (selectedZoneId === null) return []
    return sections.filter((s) => s.zoneId === selectedZoneId)
  }, [sections, selectedZoneId])

  // Get active tables list
  const tables = useMemo(() => pagedTables?.data ?? [], [pagedTables?.data])

  // Auto-arrange tables in a grid when positions are missing
  const getTablePosition = (table: TableResponse, index: number, sectionTablesCount: number): TablePosition => {
    if (positions[table.id]) {
      return positions[table.id]
    }

    const cols = Math.ceil(Math.sqrt(sectionTablesCount))
    const rows = Math.ceil(sectionTablesCount / cols)
    const colIndex = index % cols
    const rowIndex = Math.floor(index / cols)

    const x = cols > 1 ? 15 + (70 * colIndex) / (cols - 1) : 50
    const y = rows > 1 ? 20 + (60 * rowIndex) / (rows - 1) : 50

    return { x, y }
  }

  // Count available tables per zone
  const getAvailableCountInZone = (zoneId: number) => {
    return availableTables.filter(t => t.zoneId === zoneId).length
  }

  const isLoading = isLoadingZones || isLoadingSections || isLoadingTables
  const isError = isErrorZones || isErrorSections || isErrorTables

  if (isLoading) {
    return (
      <div className="space-y-6 bg-[#112128] border border-[rgba(196,154,84,0.2)] rounded-lg p-6">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 bg-[#0B1519]" />
          <Skeleton className="h-9 w-28 bg-[#0B1519]" />
        </div>
        <div className="h-64 w-full bg-[#0B1519] rounded-lg animate-pulse" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="bg-[#112128] border-red-900/50 text-red-200">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-[#C49A54] text-xs font-semibold">Error al cargar el plano</AlertTitle>
        <AlertDescription className="text-xs text-[#9D9A91] mt-1">
          No pudimos cargar la distribución física de las mesas.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Legend and Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0B1519] p-3 rounded-lg border border-[rgba(196,154,84,0.1)] text-xs">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-[#1E3E4B] to-[#12262E] border border-[#C49A54] shadow-[0_0_6px_rgba(196,154,84,0.15)]" />
            <span className="text-white text-[10px]">Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-[#C49A54] border border-[#C49A54]" />
            <span className="text-[#C49A54] text-[10px] font-semibold">Seleccionada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-[#14181B] border border-red-900/20" />
            <span className="text-white/40 text-[10px]">No Disponible</span>
          </div>
        </div>
        <div className="text-[10px] text-[#9CA3AF]">
          Haz clic en una mesa disponible para seleccionarla
        </div>
      </div>

      {/* Selector de Zonas */}
      <div className="flex flex-wrap gap-2 border-b border-[rgba(196,154,84,0.15)] pb-4">
        {zones.map((zone) => {
          const availCount = getAvailableCountInZone(zone.id)
          const isSelected = selectedZoneId === zone.id

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => setSelectedZoneStateId(zone.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#C49A54] border-none text-[#0E1B21] shadow-lg shadow-[#C49A54]/10 font-bold'
                  : 'bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{zone.name}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isSelected
                    ? 'bg-[#0E1B21] text-[#C49A54]'
                    : availCount > 0
                    ? 'bg-[#C49A54]/10 text-[#C49A54] border border-[#C49A54]/20'
                    : 'bg-red-950/20 text-red-400 border border-red-950/30'
                }`}
              >
                {availCount} {availCount === 1 ? 'libre' : 'libres'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Canvas del Croquis por Secciones */}
      {activeSections.length === 0 ? (
        <div className="py-12 text-center space-y-4 bg-[#112128] border border-[rgba(196,154,84,0.15)] rounded-xl">
          <Layers className="h-8 w-8 text-[#C49A54] mx-auto stroke-[1.5]" />
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-[#C49A54]">Esta zona aún no tiene secciones</h3>
            <p className="text-[10px] text-[#9D9A91] max-w-xs mx-auto">
              No hay plano de mesas disponible para esta zona.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeSections.map((section) => {
            // Filter only active tables inside this section
            const sectionTables = tables.filter((t) => t.sectionId === section.id && t.isActive)

            return (
              <div
                key={section.id}
                className="bg-[#112128] border border-[rgba(196,154,84,0.20)] rounded-xl overflow-hidden shadow-lg flex flex-col"
              >
                {/* Cabecera de la Sección */}
                <div className="bg-[#0B1519] px-4 py-2 border-b border-[rgba(196,154,84,0.15)] flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#C49A54]" />
                    <span className="text-[10px] font-bold text-white tracking-wide uppercase">
                      {section.name}
                    </span>
                  </div>
                  <span className="text-[9px] bg-[#112128] px-2 py-0.5 rounded border border-[rgba(196,154,84,0.1)] text-[#C49A54] font-mono">
                    {sectionTables.length} mesas en total
                  </span>
                </div>

                {/* Plano / Área de Mesas */}
                <div className="h-64 relative overflow-hidden bg-[#0E1B21]">
                  {sectionTables.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <Grid className="w-6 h-6 text-[#9D9A91]/30 mb-1 stroke-[1.5]" />
                      <p className="text-[10px] text-[#9D9A91]">No hay mesas activas en esta sección.</p>
                    </div>
                  ) : (
                    sectionTables.map((table, idx) => {
                      const pos = getTablePosition(table, idx, sectionTables.length)
                      const isSquare = table.capacity <= 4
                      const chairPositions = getChairPositions(table.capacity)

                      // Check if this table is available for the current query
                      const matchingAvailableTable = availableTables.find(at => at.id === table.id)
                      const isAvailable = !!matchingAvailableTable

                      // Check if this table is currently selected by the user
                      const isSelected = selectedTable?.id === table.id

                      return (
                        <div
                          key={table.id}
                          style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                          }}
                          className={`absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 select-none z-10 hover:z-20`}
                        >
                          {/* SILLAS */}
                          {chairPositions.map((chairPos, chairIdx) => (
                            <div
                              key={chairIdx}
                              style={{
                                left: `${chairPos.x}%`,
                                top: `${chairPos.y}%`,
                              }}
                              className={`absolute w-2.5 h-2.5 rounded-md -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 border ${
                                isSelected
                                  ? 'bg-[#C49A54]/40 border-[#C49A54]'
                                  : isAvailable
                                  ? 'bg-[#C49A54]/10 border-[#C49A54]/40'
                                  : 'bg-red-950/10 border-red-950/20'
                              }`}
                            />
                          ))}

                          {/* MESA (Centro) */}
                          <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => {
                              if (isAvailable && matchingAvailableTable) {
                                onSelectTable(matchingAvailableTable)
                              }
                            }}
                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 flex flex-col items-center justify-center rounded-lg ${
                              isSquare ? 'w-10 h-10' : 'w-16 h-8'
                            } ${
                              isSelected
                                ? 'bg-[#C49A54] border-2 border-[#C49A54] text-[#0E1B21] shadow-[0_0_14px_rgba(196,154,84,0.4)] font-bold scale-105'
                                : isAvailable
                                ? 'bg-gradient-to-br from-[#1E3E4B] to-[#12262E] border-2 border-[#C49A54] text-white shadow-[0_0_8px_rgba(196,154,84,0.15)] cursor-pointer hover:scale-105 hover:border-[#E5B869] hover:shadow-[0_0_12px_rgba(196,154,84,0.25)]'
                                : 'bg-[#14181B] border-2 border-red-900/10 text-gray-600 cursor-not-allowed opacity-40'
                            }`}
                          >
                            <span className="text-[9px] tracking-tight">
                              M-{table.number}
                            </span>
                            <div className="flex items-center text-[7px] opacity-80 mt-0.5">
                              <Users className="w-2 h-2 mr-0.5 shrink-0" />
                              <span>{table.capacity}</span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 absolute -top-1.5 -right-1.5 text-[#0E1B21] bg-[#C49A54] rounded-full stroke-[2.5]" />
                            )}
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
