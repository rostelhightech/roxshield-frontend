import { createFileRoute } from '@tanstack/react-router'
import { Demos } from '@/app/dashboard/superadmin/demos/demos'
import { DashboardTopbar } from '@/components/layout/topbar'

export const Route = createFileRoute('/_authenticated/dashboard/demos')({
  component: DemosPage,
})

function DemosPage() {
     
   
  return   <div>
 <DashboardTopbar
                title="Demandes de démo"
                description="Gérez les demandes de démonstration"
              />
              <Demos />
     </div>

}
