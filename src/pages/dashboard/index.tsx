import { Layout } from '@/components/custom/layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RecentSales } from './components/recent-sales'
import { Overview } from './components/overview'
import { Charts } from './components/analytics'
import { ReportPage } from './components/reports'
import CustomerReviews from './components/CustomerReviews'
import InventoryManagement from './components/InventoryManagement'
import MarketingCampaigns from './components/MarketingCampaigns'
import StoreLocations from './components/StoreLocations'
import SupplierManagement from './components/SupplierManagement'

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



