import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
  createPrescription,
  deletePrescription,
  listPrescriptions,
  updatePrescription,
} from '../services/prescriptions'
import DateRangePicker from '../components/DateRangePicker'
import PrescriptionForm from '../components/PrescriptionForm'
import { ApiError } from '../lib/api'

const formatDisplayDate = (value) => (value ? dayjs(value).format('MMM D, YYYY') : '—')

const buildDefaultRange = () => {
  const now = dayjs()
  return {
    startDate: now.startOf('month').format('YYYY-MM-DD'),
    endDate: now.endOf('month').format('YYYY-MM-DD'),
  }
}

const PrescriptionsPage = () => {
  const [range, setRange] = useState(buildDefaultRange)
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const loadPrescriptions = useCallback(
    async (nextRange = range) => {
      setLoading(true)
      setError(null)
      try {
        const data = await listPrescriptions(nextRange)
        setPrescriptions(Array.isArray(data) ? data : [])
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to load prescriptions'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [range],
  )

  useEffect(() => {
    loadPrescriptions(range)
  }, [range, loadPrescriptions])

  const openCreateForm = () => {
    setFormErrors(null)
    setSelectedPrescription(null)
    setFormMode('create')
    setShowForm(true)
  }

  const openEditForm = (prescription) => {
    setFormErrors(null)
    setSelectedPrescription(prescription)
    setFormMode('edit')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setFormSubmitting(false)
  }

  const handleFormSubmit = async (values) => {
    setFormSubmitting(true)
    setFormErrors(null)
    setFeedback(null)

    try {
      if (formMode === 'edit' && selectedPrescription) {
        await updatePrescription(selectedPrescription.id, values)
        setFeedback('Prescription updated successfully')
      } else {
        await createPrescription(values)
        setFeedback('Prescription created successfully')
      }
      closeForm()
      await loadPrescriptions()
    } catch (err) {
      if (err instanceof ApiError) {
        setFormErrors(err.details?.errors || null)
        setFeedback(err.message)
      } else {
        setFeedback('Unexpected error occurred')
      }
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (prescription) => {
    const confirmed = window.confirm(
      `Delete prescription for ${prescription.patientName} dated ${prescription.prescriptionDate}?`,
    )
    if (!confirmed) return

    setFeedback(null)
    try {
      await deletePrescription(prescription.id)
      setFeedback('Prescription deleted successfully')
      await loadPrescriptions()
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete prescription'
      setFeedback(message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Prescriptions</h1>
          <p className="text-sm text-slate-500">
            View, add, and manage patient prescriptions for a selected date range.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          New prescription
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <DateRangePicker value={range} onChange={setRange} />
          <button
            type="button"
            onClick={() => loadPrescriptions(range)}
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            Refresh
          </button>
        </div>

        {feedback ? (
          <p className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            {feedback}
          </p>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Age</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Diagnosis</th>
                <th className="px-4 py-3 text-left">Medicines</th>
                <th className="px-4 py-3 text-left">Next visit</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                    Loading prescriptions…
                  </td>
                </tr>
              ) : prescriptions.length ? (
                prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="border-b border-slate-200">
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {formatDisplayDate(prescription.prescriptionDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{prescription.patientName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{prescription.patientAge}</td>
                    <td className="px-4 py-3 text-sm capitalize text-slate-600">{prescription.patientGender}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{prescription.diagnosis || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{prescription.medicines || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDisplayDate(prescription.nextVisitDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(prescription)}
                          className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(prescription)}
                          className="rounded-md border border-transparent px-3 py-1 text-xs font-semibold text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                    No prescriptions found for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {formMode === 'edit' ? 'Edit prescription' : 'New prescription'}
                </h2>
                <p className="text-sm text-slate-500">Fill in the patient details below.</p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-md border border-transparent px-3 py-1 text-sm font-medium text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            {feedback && formMode === 'create' ? (
              <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                {feedback}
              </p>
            ) : null}

            <div className="mt-6">
              <PrescriptionForm
                initialValues={selectedPrescription}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
                submitting={formSubmitting}
                errorMap={formErrors}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PrescriptionsPage

