import { request } from '../lib/api'

const dayWiseReport = ({ startDate, endDate } = {}) => {
  const params = new URLSearchParams()
  if (startDate) params.set('startDate', startDate)
  if (endDate) params.set('endDate', endDate)

  const query = params.toString()
  return request(`/api/v1/report/day-wise${query ? `?${query}` : ''}`)
}

export { dayWiseReport }

