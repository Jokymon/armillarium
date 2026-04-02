import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const DETAIL_VISIBILITY_NEAR = 2.3
const DETAIL_VISIBILITY_FAR = 6.5
const GRID_STEP_DEGREES = 15
const GRID_RADIUS_SCALE = 1.015
const CONTINENT_RADIUS_SCALE = 1.022

type GeoPoint = readonly [latitude: number, longitude: number]

// Simplified coastline-derived points sampled from Natural Earth 110m land geometry.
const CONTINENT_OUTLINES: GeoPoint[][] = [
  // North America
  [
    [8.39, -78.44],
    [9.29, -83.91],
    [13.16, -88.48],
    [19.95, -105.49],
    [31.57, -113.87],
    [22.82, -110.03],
    [33.74, -118.41],
    [48.18, -122.5],
    [60.88, -147.11],
    [54.69, -163.07],
    [60.27, -164.66],
    [66.58, -163.65],
    [69.99, -144.92],
    [68.91, -115.25],
    [69.69, -95.3],
    [66.26, -84.74],
    [53.28, -82.13],
    [58.96, -69.29],
    [50.23, -66.4],
    [45.26, -66.03],
    [40.47, -74.26],
    [33.93, -78.05],
    [29.94, -83.71],
    [27.38, -97.37],
    [21, -90.28],
    [15.86, -88.52],
    [13.57, -83.52],
    [9.25, -78.06],
    [8.39, -78.44],
  ],
  // South America
  [
    [9.25, -78.06],
    [11.31, -74.2],
    [10.97, -71.62],
    [12.16, -69.94],
    [10.64, -64.32],
    [8, -59.1],
    [5.65, -53.62],
    [-0.08, -50.39],
    [-2.87, -39.98],
    [-11.04, -37.05],
    [-20.9, -40.77],
    [-26.62, -48.64],
    [-34.4, -53.81],
    [-36.41, -56.74],
    [-41.17, -63.77],
    [-45.04, -65.57],
    [-50.73, -69.14],
    [-52.84, -73.7],
    [-44.1, -74.35],
    [-37.16, -73.59],
    [-23.63, -70.4],
    [-13.53, -76.26],
    [-4.04, -81.1],
    [0.36, -80.02],
    [3.85, -77.13],
    [8.39, -78.44],
    [9.25, -78.06],
  ],
  // Eurasia
  [
    [31.22, 34.27],
    [42.02, 33.51],
    [45.33, 32.45],
    [39.19, 23.35],
    [45.23, 14.26],
    [39.54, 15.72],
    [36.32, -5],
    [48.68, -4.59],
    [54.98, 9.92],
    [60.42, 26.26],
    [58.08, 7.05],
    [64.33, 37.14],
    [69.23, 64.89],
    [72.83, 74.66],
    [76.22, 113.33],
    [71.03, 157.01],
    [59.79, 166.3],
    [59.76, 154.22],
    [41.6, 129.67],
    [39.55, 125.32],
    [30.14, 121.5],
    [9.53, 106.41],
    [1.97, 102.57],
    [20.67, 92.37],
    [8.93, 78.28],
    [26.48, 54.72],
    [24.15, 53.4],
    [17.23, 55.27],
    [17.08, 42.35],
    [28.71, 32.73],
    [31.22, 34.27],
  ],
  // Africa
  [
    [28.71, 32.73],
    [20.84, 36.97],
    [13, 42.59],
    [10.82, 46.65],
    [11.17, 51.04],
    [0.29, 43.14],
    [-5.91, 38.74],
    [-11.76, 40.44],
    [-19.55, 35.2],
    [-24.48, 35.04],
    [-29.4, 31.33],
    [-33.99, 24.68],
    [-34.14, 18.38],
    [-27.09, 15.21],
    [-17.3, 11.73],
    [-10.37, 13.39],
    [-5.04, 11.92],
    [3.07, 9.8],
    [5.61, 5.03],
    [5.18, -4.01],
    [6.86, -11.71],
    [11.04, -15.13],
    [14.92, -17.19],
    [21.42, -17.02],
    [26.62, -13.77],
    [33.7, -7.65],
    [36.3, 0.5],
    [36.72, 10.18],
    [33.14, 11.49],
    [31.75, 19.82],
    [31.32, 27.46],
    [31.22, 34.27],
    [28.71, 32.73],
  ],
  // Greenland
  [
    [83.52, -27.1],
    [81.15, -23.17],
    [78.75, -19.7],
    [73.82, -20.43],
    [70.66, -21.75],
    [68.13, -30.67],
    [63.48, -41.19],
    [63.63, -51.63],
    [69.57, -52.01],
    [71.41, -55],
    [76.13, -66.06],
    [79.39, -65.71],
    [81.89, -53.04],
    [83.65, -35.09],
    [83.52, -27.1],
  ],
  // Australia
  [
    [-13.76, 143.56],
    [-20.63, 148.72],
    [-29.46, 153.34],
    [-37.81, 148.3],
    [-36.14, 139.57],
    [-33.95, 135.24],
    [-33.91, 122.81],
    [-33.26, 115.71],
    [-25.62, 113.44],
    [-21.07, 115.95],
    [-16.41, 123.01],
    [-14.28, 127.8],
    [-11.38, 133.02],
    [-14.72, 135.43],
    [-14.56, 141.56],
    [-13.4, 143.6],
    [-13.76, 143.56],
  ],
  // Antarctica
  [
    [-64.15, -58.61],
    [-71.09, -61.51],
    [-78.22, -74.77],
    [-82.08, -42.81],
    [-76.36, -26.16],
    [-70.93, -6.87],
    [-70.4, 15.13],
    [-69.52, 37.91],
    [-66.68, 57.26],
    [-72.17, 68.71],
    [-67.15, 86.75],
    [-66.93, 106.18],
    [-66.76, 128.8],
    [-68.13, 147.72],
    [-72.09, 171.09],
    [-80.2, 160.75],
    [-84.33, -176.86],
    [-83.69, -153.59],
    [-76.99, -157.88],
    [-74.3, -132.26],
    [-74.99, -103.37],
    [-73.09, -86.01],
    [-70.11, -68.49],
    [-63.86, -57.6],
    [-64.15, -58.61],
  ],
]

function latLonToLocalPoint(radius: number, latitude: number, longitude: number) {
  const lat = THREE.MathUtils.degToRad(latitude)
  const lon = THREE.MathUtils.degToRad(longitude)
  const cosLat = Math.cos(lat)

  return new THREE.Vector3(
    radius * cosLat * Math.cos(lon),
    radius * cosLat * Math.sin(lon),
    radius * Math.sin(lat),
  )
}

function makeMeridian(radius: number, longitude: number) {
  return Array.from({ length: 73 }, (_, index) => {
    const latitude = -90 + index * 2.5
    return latLonToLocalPoint(radius, latitude, longitude)
  })
}

function makeParallel(radius: number, latitude: number) {
  return Array.from({ length: 97 }, (_, index) => {
    const longitude = -180 + index * 3.75
    return latLonToLocalPoint(radius, latitude, longitude)
  })
}

function makeOutline(radius: number, points: GeoPoint[]) {
  return points.map(([latitude, longitude]) => latLonToLocalPoint(radius, latitude, longitude))
}

export function EarthSurface({
  earthPosition,
  radius,
}: {
  earthPosition: THREE.Vector3
  radius: number
}) {
  const detailGroupRef = useRef<THREE.Group>(null)

  const meridians = useMemo(
    () =>
      Array.from({ length: Math.floor(360 / GRID_STEP_DEGREES) }, (_, index) => {
        const longitude = -180 + index * GRID_STEP_DEGREES
        return makeMeridian(radius * GRID_RADIUS_SCALE, longitude)
      }),
    [radius],
  )
  const parallels = useMemo(
    () =>
      Array.from({ length: 11 }, (_, index) => -75 + index * GRID_STEP_DEGREES)
        .filter((latitude) => latitude !== 0)
        .map((latitude) => makeParallel(radius * GRID_RADIUS_SCALE, latitude)),
    [radius],
  )
  const equator = useMemo(() => makeParallel(radius * GRID_RADIUS_SCALE, 0), [radius])
  const primeMeridian = useMemo(() => makeMeridian(radius * GRID_RADIUS_SCALE, 0), [radius])
  const continents = useMemo(
    () => CONTINENT_OUTLINES.map((outline) => makeOutline(radius * CONTINENT_RADIUS_SCALE, outline)),
    [radius],
  )

  useFrame(({ camera }) => {
    if (!detailGroupRef.current) {
      return
    }

    const distance = camera.position.distanceTo(earthPosition)
    const visibility = THREE.MathUtils.clamp(
      1 - (distance - DETAIL_VISIBILITY_NEAR) / (DETAIL_VISIBILITY_FAR - DETAIL_VISIBILITY_NEAR),
      0,
      1,
    )

    detailGroupRef.current.visible = visibility > 0.02
    detailGroupRef.current.traverse((child) => {
      const material = (child as THREE.Mesh).material
      if (!material) {
        return
      }

      const materials = Array.isArray(material) ? material : [material]
      materials.forEach((entry) => {
        const typedMaterial = entry as THREE.Material & { opacity?: number; userData: Record<string, unknown> }
        if (typeof typedMaterial.userData.baseOpacity !== 'number' && typeof typedMaterial.opacity === 'number') {
          typedMaterial.userData.baseOpacity = typedMaterial.opacity
        }
        const baseOpacity = typeof typedMaterial.userData.baseOpacity === 'number' ? typedMaterial.userData.baseOpacity : 1
        typedMaterial.transparent = true
        if (typeof typedMaterial.opacity === 'number') {
          typedMaterial.opacity = baseOpacity * visibility
        }
      })
    })
  })

  return (
    <group ref={detailGroupRef}>
      {meridians.map((points, index) => (
        <Line
          key={`meridian-${index}`}
          points={points}
          color="#90b6d3"
          lineWidth={0.55}
          transparent
          opacity={0.42}
        />
      ))}
      {parallels.map((points, index) => (
        <Line
          key={`parallel-${index}`}
          points={points}
          color="#90b6d3"
          lineWidth={0.55}
          transparent
          opacity={0.38}
        />
      ))}
      <Line points={equator} color="#f6d179" lineWidth={1.15} transparent opacity={0.82} />
      <Line
        points={primeMeridian}
        color="#ffdba4"
        lineWidth={1.15}
        transparent
        opacity={0.84}
      />
      {continents.map((points, index) => (
        <Line
          key={`continent-${index}`}
          points={points}
          color="#e5c8f0"
          lineWidth={1}
          transparent
          opacity={0.88}
        />
      ))}
    </group>
  )
}
