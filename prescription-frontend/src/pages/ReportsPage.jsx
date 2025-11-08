import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import DateRangePicker from '../components/DateRangePicker'
import { dayWiseReport } from '../services/reports'
import { ApiError } from '../lib/api'

const defaultRange = () => {
  const now = dayjs()
  return {
    startDate: now.startOf('month').format('YYYY-MM-DD'),
    endDate: now.endOf('month').format('YYYY-MM-DD'),
  }
}

const ReportsPage = () => {
  const [range, setRange] = useState(defaultRange)
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadReport = useCallback(
    async (currentRange = range) => {
      setLoading(true)
      setError(null)
      try {
        const data = await dayWiseReport(currentRange)
        setReport(Array.isArray(data) ? data : [])
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to load report'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [range],
  )

  useEffect(() => {
    loadReport(range)
  }, [range, loadReport])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Day-wise report</h1>
        <p className="text-sm text-slate-500">
          Track how many prescriptions were generated each day within a chosen period.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <DateRangePicker value={range} onChange={setRange} />
          <button
            type="button"
            onClick={() => loadReport(range)}
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Day</th>
                <th className="px-4 py-3 text-right">Prescription count</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                    Loading report…
                  </td>
                </tr>
              ) : report.length ? (
                report.map((row) => (
                  <tr key={row.day} className="border-b border-slate-200">
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {dayjs(row.day).format('MMM D, YYYY')}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600">
                      {row.prescriptionCount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                    No data for the selected range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ReportsPage

