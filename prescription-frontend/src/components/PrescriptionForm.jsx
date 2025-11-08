import { useEffect, useState } from 'react'

const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
]

const defaultValues = {
  prescriptionDate: '',
  patientName: '',
  patientAge: '',
  patientGender: 'MALE',
  diagnosis: '',
  medicines: '',
  nextVisitDate: '',
}

const PrescriptionForm = ({ initialValues = defaultValues, onSubmit, onCancel, submitting, errorMap }) => {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues })

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues })
  }, [initialValues])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      ...values,
      patientAge: Number(values.patientAge),
    }
    onSubmit(payload)
  }

  const renderFieldError = (field) =>
    errorMap?.[field] ? <p className="mt-1 text-xs text-red-600">{errorMap[field]}</p> : null

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Prescription date
          <input
            type="date"
            name="prescriptionDate"
            required
            value={values.prescriptionDate}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring"
          />
          {renderFieldError('prescriptionDate')}
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Patient name
          <input
            type="text"
            name="patientName"
            required
            value={values.patientName}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring"
          />
          {renderFieldError('patientName')}
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Patient age
          <input
            type="number"
            name="patientAge"
            min={0}
            max={150}
            required
            value={values.patientAge}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring"
          />
          {renderFieldError('patientAge')}
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Patient gender
          <select
            name="patientGender"
            value={values.patientGender}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring"
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {renderFieldError('patientGender')}
        </label>
      </div>
      <label className="flex flex-col text-sm font-medium text-slate-600">
        Diagnosis
        <textarea
          name="diagnosis"
          rows={3}
          value={values.diagnosis}
          onChange={handleChange}
          className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring"
        />
        {renderFieldError('diagnosis')}
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-600">
        Medicines
        <textarea
          name="medicines"
          rows={3}
          value={values.medicines}
          onChange={handleChange}
          className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring"
        />
        {renderFieldError('medicines')}
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-600">
        Next visit date
        <input
          type="date"
          name="nextVisitDate"
          value={values.nextVisitDate}
          onChange={handleChange}
          className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring"
        />
        {renderFieldError('nextVisitDate')}
      </label>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save prescription'}
        </button>
      </div>
    </form>
  )
}

export default PrescriptionForm

