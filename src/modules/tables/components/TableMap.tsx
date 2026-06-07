import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useAllZonesQuery } from '@/modules/zones/hooks/useZones'
import { useAllSectionsQuery } from '@/modules/sections/hooks/useSections'
import { useTablesQuery, useToggleTableActivationMutation } from '../hooks/useTables'
import type { TableResponse } from '../models/tableModels'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import {
  Map,
  Layers,
  Power,
  Edit2,
  Trash2,
  Users,
  Move,
  RotateCcw,
  Check,
  AlertTriangle,
  Grid,
} from 'lucide-react'

interface TableMapProps {
  onEditClick: (table: TableResponse) => void
  onDeleteClick: (table: TableResponse) => void
  onCreateClick: () => void
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
    // 1 on top, 1 on bottom
    positions.push({ x: 50, y: 12 })
    positions.push({ x: 50, y: 88 })
  } else if (capacity === 3) {
    // 1 on top, 1 on bottom, 1 on left
    positions.push({ x: 50, y: 12 })
    positions.push({ x: 50, y: 88 })
    positions.push({ x: 12, y: 50 })
  } else if (capacity === 4) {
    // 1 on each of the 4 sides
    positions.push({ x: 50, y: 12 })   // Top
    positions.push({ x: 50, y: 88 })   // Bottom
    positions.push({ x: 12, y: 50 })   // Left
    positions.push({ x: 88, y: 50 })   // Right
  } else if (capacity <= 6) {
    // 3 on top, 3 on bottom
    positions.push({ x: 25, y: 12 })
    positions.push({ x: 50, y: 12 })
    positions.push({ x: 75, y: 12 })
    positions.push({ x: 25, y: 88 })
    positions.push({ x: 50, y: 88 })
    positions.push({ x: 75, y: 88 })
  } else {
    // N > 6: distribute along perimeter
    const topBottomCount = Math.floor((capacity - 2) / 2)
    // Top chairs
    for (let i = 0; i <= topBottomCount; i++) {
      const x = 20 + (60 * i) / topBottomCount
      positions.push({ x, y: 12 })
    }
    // Bottom chairs
    for (let i = 0; i <= topBottomCount; i++) {
      const x = 20 + (60 * i) / topBottomCount
      positions.push({ x, y: 88 })
    }
    // Left and right ends
    positions.push({ x: 10, y: 50 })
    positions.push({ x: 90, y: 50 })
  }
  return positions
}

export function TableMap({ onEditClick, onDeleteClick, onCreateClick }: TableMapProps) {
  // Queries
  const { data: zones = [], isLoading: isLoadingZones, isError: isErrorZones } = useAllZonesQuery()
  const { data: sections = [], isLoading: isLoadingSections, isError: isErrorSections } = useAllSectionsQuery()
  // Fetch a large page size to get all tables (max allowed by API is 100)
  const { data: pagedTables, isLoading: isLoadingTables, isError: isErrorTables } = useTablesQuery(1, 100)
  const toggleMutation = useToggleTableActivationMutation()

  // Selected Zone ID state
  const [selectedZoneStateId, setSelectedZoneStateId] = useState<number | null>(null)

  // Resolve active zone ID (defaults to the first zone if not manually selected)
  const selectedZoneId = selectedZoneStateId ?? (zones.length > 0 ? zones[0].id : null)

  // Layout Design Mode state
  const [isDesignMode, setIsDesignMode] = useState(false)

  // Track the table currently being dragged
  const [draggedTableId, setDraggedTableId] = useState<number | null>(null)
  
  // Track selected table for floating menu (popover)
  const [activeMenuTableId, setActiveMenuTableId] = useState<number | null>(null)

  // Local coordinates state (loaded from localStorage & merged with defaults)
  const [positions, setPositions] = useState<TablePositionsMap>(() => {
    try {
      const stored = localStorage.getItem('chefstack_table_layout_positions')
      return stored ? JSON.parse(stored) : {}
    } catch (e) {
      console.error('Error reading table positions from localStorage', e)
      return {}
    }
  })

  // Section canvas DOM references
  const sectionRefs = useRef<{ [id: number]: HTMLDivElement | null }>({})

  // Filter sections by selected zone
  const activeSections = useMemo(() => {
    if (selectedZoneId === null) return []
    return sections.filter((s) => s.zoneId === selectedZoneId)
  }, [sections, selectedZoneId])

  // Filter tables by section
  const tables = useMemo(() => pagedTables?.data ?? [], [pagedTables?.data])

  // Auto-arrange tables in a grid when positions are missing
  const getTablePosition = (table: TableResponse, index: number, sectionTablesCount: number): TablePosition => {
    // If a saved position exists, return it
    if (positions[table.id]) {
      return positions[table.id]
    }

    // Default Grid Math
    const cols = Math.ceil(Math.sqrt(sectionTablesCount))
    const rows = Math.ceil(sectionTablesCount / cols)
    const colIndex = index % cols
    const rowIndex = Math.floor(index / cols)

    // Calculate nice spaced coordinates inside the container
    const x = cols > 1 ? 15 + (70 * colIndex) / (cols - 1) : 50
    const y = rows > 1 ? 20 + (60 * rowIndex) / (rows - 1) : 50

    return { x, y }
  }

  // Handle Drag Start
  const handleMouseDown = (e: React.MouseEvent, tableId: number) => {
    if (!isDesignMode) return
    e.preventDefault()
    setDraggedTableId(tableId)
    setActiveMenuTableId(null) // Hide menu while dragging
  }

  // Handle Drag Move (Global Window Listener for smooth dragging)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedTableId === null) return

      // Find which section this table belongs to
      const table = tables.find((t) => t.id === draggedTableId)
      if (!table) return

      const sectionId = table.sectionId
      const container = sectionRefs.current[sectionId]
      if (!container) return

      const rect = container.getBoundingClientRect()
      
      // Calculate coordinates relative to the section container in pixels
      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top

      // Convert to percentages
      let x = (clientX / rect.width) * 100
      let y = (clientY / rect.height) * 100

      // Keep inside bounds (8% to 92% to avoid table wrapper clipping)
      x = Math.max(8, Math.min(92, x))
      y = Math.max(8, Math.min(92, y))

      // Update local state in real-time
      setPositions((prev) => ({
        ...prev,
        [draggedTableId]: { x, y },
      }))
    };

    const handleMouseUp = () => {
      if (draggedTableId !== null) {
        // Save current positions to localStorage
        localStorage.setItem('chefstack_table_layout_positions', JSON.stringify(positions))
        setDraggedTableId(null)
      }
    };

    if (draggedTableId !== null) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggedTableId, positions, tables])

  // Reset design layout for the current zone sections
  const handleResetLayout = () => {
    if (!window.confirm('¿Estás seguro de que deseas restablecer el diseño de esta zona? Se perderán las posiciones personalizadas.')) {
      return
    }

    const updatedPositions = { ...positions }
    activeSections.forEach((section) => {
      const sectionTables = tables.filter((t) => t.sectionId === section.id)
      sectionTables.forEach((table) => {
        delete updatedPositions[table.id]
      })
    })

    setPositions(updatedPositions)
    localStorage.setItem('chefstack_table_layout_positions', JSON.stringify(updatedPositions))
  }

  // Toggle Table Activation from map
  const handleToggleTable = async (table: TableResponse) => {
    try {
      await toggleMutation.mutateAsync({
        id: table.id,
        active: !table.isActive,
      })
      setActiveMenuTableId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const isLoading = isLoadingZones || isLoadingSections || isLoadingTables
  const isError = isErrorZones || isErrorSections || isErrorTables

  if (isLoading) {
    return (
      <div className="space-y-6 bg-[#112128] border border-[rgba(196,154,84,0.2)] rounded-lg p-6">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 bg-[#0B1519]" />
          <Skeleton className="h-9 w-28 bg-[#0B1519]" />
          <Skeleton className="h-9 w-28 bg-[#0B1519]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-80 w-full bg-[#0B1519]" />
          <Skeleton className="h-80 w-full bg-[#0B1519]" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="bg-[#112128] border-red-900/50 text-red-200">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-[#C49A54] text-xs font-semibold">Error al cargar datos del mapa</AlertTitle>
        <AlertDescription className="text-xs text-[#9D9A91] mt-1">
          No pudimos obtener la configuración de zonas, secciones y mesas.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Selector de Zonas Premium */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(196,154,84,0.15)] pb-4">
        {/* Pestañas de Zonas */}
        <div className="flex flex-wrap gap-2">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => {
                setSelectedZoneStateId(zone.id)
                setActiveMenuTableId(null)
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedZoneId === zone.id
                  ? 'bg-[#C49A54] border-none text-[#0E1B21] shadow-lg shadow-[#C49A54]/10'
                  : 'bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              {zone.name}
            </button>
          ))}
        </div>

        {/* Controles de Diseño */}
        <div className="flex gap-2">
          {isDesignMode ? (
            <>
              <Button
                onClick={handleResetLayout}
                variant="outline"
                size="sm"
                className="bg-[#0B1519] border-red-900/30 text-red-400 hover:bg-red-950/20 hover:text-red-300 text-xs h-9 cursor-pointer gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer Diseño
              </Button>
              <Button
                onClick={() => setIsDesignMode(false)}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-[#0E1B21] font-semibold text-xs h-9 cursor-pointer gap-1.5 border-none"
              >
                <Check className="w-3.5 h-3.5" />
                Guardar Diseño
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsDesignMode(true)}
              variant="outline"
              size="sm"
              className="bg-[#0B1519] border-[rgba(196,154,84,0.20)] text-white hover:bg-[#112128] hover:text-[#C49A54] text-xs h-9 cursor-pointer gap-1.5"
            >
              <Move className="w-3.5 h-3.5 text-[#C49A54]" />
              Ajustar Croquis
            </Button>
          )}
        </div>
      </div>

      {/* Canvas del Croquis por Secciones */}
      {activeSections.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-[#112128] border border-[rgba(196,154,84,0.15)] rounded-xl">
          <Layers className="h-10 w-10 text-[#C49A54] mx-auto stroke-[1.5]" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#C49A54]">Esta zona aún no tiene secciones</h3>
            <p className="text-xs text-[#9D9A91] max-w-xs mx-auto">
              Crea secciones en la configuración de secciones para poder distribuir las mesas.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {activeSections.map((section) => {
            const sectionTables = tables.filter((t) => t.sectionId === section.id)

            return (
              <div
                key={section.id}
                className="bg-[#112128] border border-[rgba(196,154,84,0.20)] rounded-xl overflow-hidden shadow-lg flex flex-col"
              >
                {/* Cabecera de la Sección */}
                <div className="bg-[#0B1519] px-5 py-3 border-b border-[rgba(196,154,84,0.15)] flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C49A54]" />
                    <span className="text-xs font-bold text-white tracking-wide uppercase">
                      {section.name}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#112128] px-2 py-0.5 rounded border border-[rgba(196,154,84,0.1)] text-[#C49A54] font-mono">
                    {sectionTables.length} mesas
                  </span>
                </div>

                {/* Plano / Área de Mesas */}
                <div
                  ref={(el) => {
                    sectionRefs.current[section.id] = el
                  }}
                  className={`h-80 relative overflow-hidden transition-all duration-300 ${
                    isDesignMode
                      ? 'cursor-crosshair bg-[#0d1c22] bg-[radial-gradient(rgba(196,154,84,0.15)_1px,transparent_1px)] bg-[size:16px_16px]'
                      : 'bg-[#0E1B21]'
                  }`}
                  onClick={() => setActiveMenuTableId(null)} // Click outside closes popup
                >
                  {sectionTables.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <Grid className="w-8 h-8 text-[#9D9A91]/40 mb-2 stroke-[1.5]" />
                      <p className="text-xs text-[#9D9A91]">No hay mesas en esta sección.</p>
                      {!isDesignMode && (
                        <Button
                          onClick={onCreateClick}
                          variant="link"
                          className="text-xs text-[#C49A54] mt-1 h-auto p-0 hover:text-[#A98245] font-semibold"
                        >
                          + Agregar Mesa
                        </Button>
                      )}
                    </div>
                  ) : (
                    sectionTables.map((table, idx) => {
                      const pos = getTablePosition(table, idx, sectionTables.length)
                      const isSquare = table.capacity <= 4
                      const chairPositions = getChairPositions(table.capacity)
                      const isDragged = draggedTableId === table.id

                      return (
                        <div
                          key={table.id}
                          style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                          }}
                          className={`absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 select-none z-10 transition-shadow ${
                            isDesignMode ? 'hover:z-30' : 'hover:z-20'
                          }`}
                        >
                          {/* SILLAS (Alrededor de la mesa) */}
                          {chairPositions.map((chairPos, chairIdx) => (
                            <div
                              key={chairIdx}
                              style={{
                                left: `${chairPos.x}%`,
                                top: `${chairPos.y}%`,
                              }}
                              className={`absolute w-3 h-3 rounded-md -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 border ${
                                table.isActive
                                  ? 'bg-[#C49A54]/20 border-[#C49A54]/50'
                                  : 'bg-red-950/20 border-red-900/30'
                              }`}
                            />
                          ))}

                          {/* MESA (Centro) */}
                          <div
                            onMouseDown={(e) => handleMouseDown(e, table.id)}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!isDesignMode) {
                                setActiveMenuTableId(
                                  activeMenuTableId === table.id ? null : table.id
                                )
                              }
                            }}
                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 flex flex-col items-center justify-center rounded-lg ${
                              isSquare ? 'w-12 h-12' : 'w-18 h-10'
                            } ${
                              table.isActive
                                ? 'bg-gradient-to-br from-[#1E3E4B] to-[#12262E] border-2 border-[#C49A54] text-white shadow-[0_0_12px_rgba(196,154,84,0.15)]'
                                : 'bg-gradient-to-br from-[#1E2529] to-[#14181B] border-2 border-red-900/40 text-gray-500'
                            } ${
                              isDesignMode
                                ? isDragged
                                  ? 'cursor-grabbing scale-105 border-dashed border-sky-400 bg-sky-950/20'
                                  : 'cursor-grab hover:scale-105 hover:border-sky-400'
                                : 'cursor-pointer hover:scale-105 hover:border-[#E5B869] hover:shadow-[0_0_16px_rgba(196,154,84,0.3)]'
                            }`}
                          >
                            <span className="text-[10px] font-bold tracking-tight">
                              M-{table.number}
                            </span>
                            <div className="flex items-center text-[8px] opacity-80 mt-0.5">
                              <Users className="w-2.5 h-2.5 mr-0.5 shrink-0" />
                              <span>{table.capacity}</span>
                            </div>
                          </div>

                          {/* MENU DE ACCIONES FLOTANTE */}
                          {activeMenuTableId === table.id && !isDesignMode && (
                            <div 
                              className={`absolute z-50 bg-[#112128] border border-[rgba(196,154,84,0.4)] rounded-lg shadow-2xl p-1.5 flex items-center gap-1 whitespace-nowrap ${
                                pos.y < 35 
                                  ? 'top-full mt-3' 
                                  : 'bottom-full mb-3'
                              } ${
                                pos.x < 20
                                  ? 'left-0 translate-x-0'
                                  : pos.x > 80
                                  ? 'right-0 left-auto translate-x-0'
                                  : 'left-1/2 -translate-x-1/2'
                              }`}
                            >
                              {/* Botón de Activación Rápida */}
                              <Button
                                onClick={() => handleToggleTable(table)}
                                size="icon"
                                variant="ghost"
                                disabled={toggleMutation.isPending}
                                className={`h-7 w-7 rounded cursor-pointer ${
                                  table.isActive
                                    ? 'text-red-400 hover:text-red-300 hover:bg-red-950/20'
                                    : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20'
                                }`}
                                title={table.isActive ? 'Desactivar mesa' : 'Activar mesa'}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </Button>

                              {/* Botón de Editar */}
                              <Button
                                onClick={() => {
                                  onEditClick(table)
                                  setActiveMenuTableId(null)
                                }}
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-[#C49A54] hover:text-[#E5B869] hover:bg-[#0B1519] rounded cursor-pointer"
                                title="Editar mesa"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>

                              {/* Botón de Borrar */}
                              <Button
                                onClick={() => {
                                  onDeleteClick(table)
                                  setActiveMenuTableId(null)
                                }}
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-[#0B1519] rounded cursor-pointer"
                                title="Eliminar mesa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
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
