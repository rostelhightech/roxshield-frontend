import { createFileRoute } from '@tanstack/react-router'
import { Demos } from '@/app/dashboard/superadmin/demos/demos'
import { DashboardTopbar } from '@/components/layout/topbar'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_authenticated/dashboard/demos')({
  component: DemosPage,
})

function DemosPage() {
     
    const { t } = useTranslation()
   
  return   <div>
 <DashboardTopbar
                title={t('nav.topbar.demos_title')}
                description={t('nav.topbar.demos_desc')}
              />
              <Demos />
     </div>

}
