const DateRangePicker = ({ value, onChange }) => {
  const handleChange = (event) => {
    const { name, value: inputValue } = event.target
    onChange({ ...value, [name]: inputValue })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col text-sm font-medium text-slate-600">
        <span>Start date</span>
        <input
          type="date"
          name="startDate"
          value={value.startDate}
          onChange={handleChange}
          className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring"
        />
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-600">
        <span>End date</span>
        <input
          type="date"
          name="endDate"
          value={value.endDate}
          onChange={handleChange}
          className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring"
        />
      </label>
    </div>
  )
}

export default DateRangePicker

