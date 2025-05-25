import { Layout } from '@/components/custom/layout'
import { Tabs,} from '@/components/ui/tabs'

export default function Dashboard() {
  return (
    <Layout fixed>
       {/* <Layout> */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}



