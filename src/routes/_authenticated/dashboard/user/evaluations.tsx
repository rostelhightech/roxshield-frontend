import UserEvaluationsPage from '@/app/dashboard/user/evaluations/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/user/evaluations',
)({
  component: UserEvaluationsPage,
})

 
