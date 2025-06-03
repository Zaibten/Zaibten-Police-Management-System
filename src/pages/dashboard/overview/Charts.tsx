'use client'
import { useEffect, useState } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveRadar } from '@nivo/radar'
import { ResponsiveAreaBump, AreaBumpSerie } from '@nivo/bump'
import { ResponsiveStream } from '@nivo/stream'
import { ResponsiveFunnel } from '@nivo/funnel'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { ResponsiveSankey } from '@nivo/sankey'
import { ResponsiveTreeMap } from '@nivo/treemap'
import { ResponsiveWaffle } from '@nivo/waffle'
import { ResponsiveChord } from '@nivo/chord'
import { ResponsiveCalendar } from '@nivo/calendar'
import { ResponsiveCirclePacking } from '@nivo/circle-packing'
import { ResponsiveHeatMap } from '@nivo/heatmap'

type MyHeatMapSerie = {
  id: string
  data: MyDatum[]
}

interface RadarDatum {
  taste: string
  [key: string]: string | number // dynamic keys (e.g. status values)
}

type MyDatum = { x: string; y: number }

type FunnelItem = {
  id: string
  value: number
}

type WaffleDatum = {
  id: string
  label: string
  value: number
}

const LoaderSpinner = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: 100,
    }}
  >
    <div
      style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: 30,
        height: 30,
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>
      {`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      `}
    </style>
  </div>
)


export const MyChordChart = () => {
  const [data, setData] = useState<{
    keys: string[]
    matrix: number[][]
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/weaponsUsageChord'
        )
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Failed to load chord data:', err)
      }
    }

    fetchData()
  }, [])

  if (!data) return <LoaderSpinner />

  return (
    <div style={{ height: 400 }}>
      <ResponsiveChord
        data={data.matrix}
        keys={data.keys}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        padAngle={0.02}
        innerRadiusRatio={0.9}
        colors={{ scheme: 'category10' }}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
        animate={true}
        motionConfig='gentle'
      />
       {/* <h3
        style={{
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          marginTop: -10,
          fontWeight: '600',
          fontSize: '1.1rem',
          color: '#333',
        }}
      >
        Police Stations Per District
      </h3> */}
    </div>
  )
}
// 2. Calendar Heatmap
export const MyCalendarHeatmap = () => {
  const [data, setData] = useState([])
  const [dateRange, setDateRange] = useState({ from: '', to: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/dutiesCalendarHeatmap'
        )
        const json = await res.json()

        if (json.length > 0) {
          setData(json)
          setDateRange({
            from: json[0].day,
            to: json[json.length - 1].day,
          })
        }
      } catch (err) {
        console.error('Failed to load calendar heatmap data:', err)
      }
    }

    fetchData()
  }, [])

  if (!data.length) return <LoaderSpinner />

  return (
    <div style={{ height: 150 }}>
      <ResponsiveCalendar
        data={data}
        from={dateRange.from}
        to={dateRange.to}
        emptyColor='#eeeeee'
        colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        yearSpacing={40}
        monthBorderColor='#ffffff'
        dayBorderWidth={2}
        dayBorderColor='#ffffff'
      />
    </div>
  )
}

// 3. Circle Packing
export const MyCirclePackingChart = () => {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/constablesCirclePacking'
        )
        const json = await res.json()
        setChartData(json)
      } catch (err) {
        console.error('Failed to load circle packing data:', err)
      }
    }

    fetchData()
  }, [])

  if (!chartData) return <LoaderSpinner />

  return (
    <div style={{ height: 340 }}>
      <ResponsiveCirclePacking
        data={chartData}
        id='name'
        value='value'
        padding={6}
        colors={{ scheme: 'nivo' }}
        animate={true}
        motionConfig='wobbly'
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
      />
    </div>
  )
}

export const MyBarChart = () => {
  const [barData, setBarData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/policeStationsPerDistrict'
        )
        const json = await res.json()
        setBarData(json)
      } catch (err) {
        console.error('Failed to fetch bar chart data:', err)
      }
    }

    fetchData()
  }, [])

  if (!barData.length) return <LoaderSpinner />

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={barData}
        keys={['value']}
        indexBy='country'
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        animate={true}
        enableLabel={false}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'District',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Stations Count',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        motionConfig='wobbly'
      />
    </div>
  )
}

export const MyLineChart = () => {
  const [lineData, setLineData] = useState([])

  useEffect(() => {
    const fetchLineData = async () => {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/dutiesCountPerMonth'
        )
        const data = await res.json()
        setLineData(data)
      } catch (error) {
        console.error('Error fetching line chart data:', error)
      }
    }

    fetchLineData()
  }, [])

  if (!lineData.length) return <LoaderSpinner />

  return (
    <div style={{ height: 300 }}>
      <ResponsiveLine
        data={lineData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        axisBottom={{
          legend: 'Month',
          legendOffset: 36,
          tickRotation: -30,
          tickSize: 5,
          tickPadding: 5,
        }}
        axisLeft={{
          legend: 'Duties Count',
          legendOffset: -40,
          tickSize: 5,
          tickPadding: 5,
        }}
        colors={{ scheme: 'category10' }}
        pointSize={10}
        pointBorderWidth={2}
        useMesh={true}
        enableGridX={false}
      />
    </div>
  )
}

export const MyPieChart = () => {
  const [pieData, setPieData] = useState([])

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/constablesByGender'
        )
        const data = await res.json()
        setPieData(data)
      } catch (error) {
        console.error('Error fetching pie chart data:', error)
      }
    }

    fetchPieData()
  }, [])

  if (!pieData.length) return <LoaderSpinner />

  return (
    <div style={{ height: 400 }}>
      <ResponsivePie
        data={pieData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'nivo' }}
        enableArcLinkLabels={false}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor='#333333'
      />
    </div>
  )
}

export const MyRadarChart = () => {
  const [radarData, setRadarData] = useState<RadarDatum[]>([])
  const [keys, setKeys] = useState<string[]>([])

  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/constablesByRankAndStatus'
        )
        const data = await res.json()
        setRadarData(data)

        if (data.length > 0) {
          const dynamicKeys = Object.keys(data[0]).filter((k) => k !== 'taste')
          setKeys(dynamicKeys)
        }
      } catch (error) {
        console.error('Error fetching radar chart data:', error)
      }
    }

    fetchRadarData()
  }, [])

  if (!radarData.length || !keys.length) return <LoaderSpinner />

  return (
    <div style={{ height: 300 }}>
      <ResponsiveRadar
        data={radarData}
        keys={keys}
        indexBy='taste'
        margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color' }}
        colors={{ scheme: 'nivo' }}
        dotSize={8}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        motionConfig='wobbly'
      />
    </div>
  )
}

export const MyAreaBumpChart = () => {
  const [bumpData, setBumpData] = useState<AreaBumpSerie<MyDatum, {}>[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://zaibtenpoliceserver.vercel.app/charts/dutiesAreaBump')
        if (!res.ok) throw new Error('Network response was not ok')
        const data: AreaBumpSerie<MyDatum, {}>[] = await res.json()
        setBumpData(data)
      } catch (error) {
        console.error('Failed to fetch area bump data:', error)
      }
    }
    fetchData()
  }, [])

  if (!bumpData.length) return <LoaderSpinner />

  return (
    <div style={{ height: 300 }}>
      <ResponsiveAreaBump
        data={bumpData}
        margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
        spacing={8}
        colors={{ scheme: 'category10' }}
      />
    </div>
  )
}

export const MyHeatMapChart = () => {
  const [heatMapData, setHeatMapData] = useState<MyHeatMapSerie[]>([])

  useEffect(() => {
    async function fetchHeatMapData() {
      try {
        const res = await fetch('https://zaibtenpoliceserver.vercel.app/charts/dutiesHeatmap')
        if (!res.ok) throw new Error('Network error')
        const data: MyHeatMapSerie[] = await res.json()
        setHeatMapData(data)
      } catch (err) {
        console.error('Failed to fetch heatmap data:', err)
      }
    }
    fetchHeatMapData()
  }, [])

  if (!heatMapData.length) return <LoaderSpinner />

  return (
    <div style={{ height: 300 }}>
      <ResponsiveHeatMap
        data={heatMapData}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        axisTop={null}
        axisRight={null}
        axisLeft={{ legend: 'Category', legendOffset: -40 }}
        axisBottom={{ legend: 'Month', legendOffset: 36 }}
        colors={{ type: 'quantize', scheme: 'greens' }}
      />
    </div>
  )
}

// Define your data type for each object in the array
type StreamDataItem = {
  x: string
  [key: string]: number | string // at least x is string, keys are dynamic with number values
}

type ApiResponseItem = {
  id: string
  data: { x: string; y: number }[]
}

export const MyStreamChart = () => {
  // Tell TypeScript the state is an array of StreamDataItem objects
  const [data, setData] = useState<StreamDataItem[]>([])
  const [keys, setKeys] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/constablesJoiningStream'
        )
        const apiData: ApiResponseItem[] = await res.json()

        // Extract all months from first item's data
        const months = apiData[0]?.data.map((d) => d.x) || []

        // Transform to [{ x: month, status1: count, status2: count, ... }, ...]
        const transformedData: StreamDataItem[] = months.map((month) => {
          const obj: StreamDataItem = { x: month }
          apiData.forEach((status) => {
            const found = status.data.find((d) => d.x === month)
            obj[status.id] = found ? found.y : 0
          })
          return obj
        })

        setData(transformedData)
        setKeys(apiData.map((d) => d.id))
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  if (data.length === 0 || keys.length === 0) {
    return <LoaderSpinner />
  }

  return (
    <div style={{ height: 300 }}>
      <ResponsiveStream
        data={data}
        keys={keys}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        axisLeft={{ legend: 'Count', legendOffset: -40 }}
        axisBottom={{ legend: 'Month', legendOffset: 36 }}
        colors={{ scheme: 'category10' }}
      />
    </div>
  )
}

export const MyFunnelChart = () => {
  const [data, setData] = useState<FunnelItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://zaibtenpoliceserver.vercel.app/charts/constablesFunnel')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Error fetching funnel data:', err)
      }
    }

    fetchData()
  }, [])

  if (data.length === 0) {
    return <LoaderSpinner />
  }

  return (
    <div style={{ height: 300 }}>
      <ResponsiveFunnel
        data={data}
        margin={{ top: 40, bottom: 20 }}
        colors={{ scheme: 'nivo' }}
        valueFormat='>-.0f'
      />
    </div>
  )
}

type Point = { x: string | number; y: number }
type ScatterSeries = { id: string; data: Point[] }

export const MyScatterPlot = () => {
  const [scatterData, setScatterData] = useState<ScatterSeries[]>([])

  useEffect(() => {
    const fetchScatterData = async () => {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/constablesJoiningStream'
        )
        const json = await res.json()
        setScatterData(json)
      } catch (error) {
        console.error('Failed to fetch scatter data:', error)
      }
    }

    fetchScatterData()
  }, [])

  if (scatterData.length === 0) {
    return <LoaderSpinner />
  }

  return (
    <div style={{ height: 300, width:500 }}>
      <ResponsiveScatterPlot
        data={scatterData}
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{ type: 'point' }} // because x is month string like '2025-06'
        yScale={{ type: 'linear', min: 0, max: 'auto' }}
        axisBottom={{
          legend: 'Month',
          legendPosition: 'middle',
          legendOffset: 46,
        }}
        axisLeft={{
          legend: 'Count',
          legendPosition: 'middle',
          legendOffset: -60,
        }}
        colors={{ scheme: 'set1' }}
        animate={true}
        motionConfig='wobbly'
      />
    </div>
  )
}

export const MySankeyChart = () => {
  const [sankeyData, setSankeyData] = useState({ nodes: [], links: [] })

  useEffect(() => {
    const fetchSankeyData = async () => {
      try {
        const res = await fetch(
          'https://zaibtenpoliceserver.vercel.app/charts/constableDutyFlow'
        )
        const json = await res.json()
        setSankeyData(json)
      } catch (err) {
        console.error('Failed to fetch sankey data', err)
      }
    }

    fetchSankeyData()
  }, [])

  if (sankeyData.nodes.length === 0) {
    return <LoaderSpinner />
  }

  return (
    <div style={{ height: 400 }}>
      <ResponsiveSankey
        data={sankeyData}
        margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
        colors={{ scheme: 'category10' }}
        animate={true}
        motionConfig='gentle'
        nodeOpacity={1}
        nodeThickness={15}
        nodeInnerPadding={3}
        labelPosition='outside'
        labelOrientation='horizontal'
      />
    </div>
  )
}

export const MyTreeMapChart = () => {
  const [treeData, setTreeData] = useState(null)

  useEffect(() => {
    const fetchTreeMapData = async () => {
      try {
        const response = await fetch('https://zaibtenpoliceserver.vercel.app/api/treemap-data')
        const data = await response.json()
        setTreeData(data)
      } catch (error) {
        console.error('Failed to fetch treemap data:', error)
      }
    }

    fetchTreeMapData()
  }, [])

  return (
    <div style={{ height: 400 }}>
      {treeData ? (
        <ResponsiveTreeMap
          data={treeData}
          identity='name'
          value='value'
          innerPadding={3}
          outerPadding={3}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          colors={{ scheme: 'nivo' }}
          labelSkipSize={12}
          animate={true}
          motionConfig='wobbly'
        />
      ) : (
        <LoaderSpinner />
      )}
    </div>
  )
}

export const MyWaffleChart = () => {
  const [waffleData, setWaffleData] = useState<WaffleDatum[]>([])

  useEffect(() => {
    const fetchWaffleData = async () => {
      try {
        const response = await fetch('https://zaibtenpoliceserver.vercel.app/api/waffle-data')
        const data: WaffleDatum[] = await response.json()
        setWaffleData(data)
      } catch (error) {
        console.error('Failed to fetch waffle chart data:', error)
      }
    }

    fetchWaffleData()
  }, [])

  const total = waffleData.reduce((acc, item) => acc + item.value, 0)

  return (
    <div style={{ height: 300 }}>
      {waffleData.length > 0 ? (
        <ResponsiveWaffle
          data={waffleData}
          total={total}
          rows={10}
          columns={10}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          colors={{ scheme: 'category10' }}
          animate={true}
          motionConfig='wobbly'
          fillDirection='right'
          emptyColor='#cccccc'
        />
      ) : (
        <LoaderSpinner />
      )}
    </div>
  )
}
