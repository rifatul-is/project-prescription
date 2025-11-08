import { request } from '../lib/api'

const listPrescriptions = ({ startDate, endDate } = {}) => {
  const params = new URLSearchParams()
  if (startDate) params.set('startDate', startDate)
  if (endDate) params.set('endDate', endDate)

  const query = params.toString()
  return request(`/api/v1/prescription${query ? `?${query}` : ''}`)
}

const getPrescription = (id) => request(`/api/v1/prescription/${id}`)

const createPrescription = (payload) =>
  request('/api/v1/prescription', {
    method: 'POST',
    body: payload,
  })

const updatePrescription = (id, payload) =>
  request(`/api/v1/prescription/${id}`, {
    method: 'PUT',
    body: payload,
  })

const deletePrescription = (id) =>
  request(`/api/v1/prescription/${id}`, {
    method: 'DELETE',
  })

export {
  listPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription,
}

