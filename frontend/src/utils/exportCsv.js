export function exportToCsv(filename, headers, rows) {
  if (!rows || !rows.length) return

  const csvContent = [
    headers.join(';'),
    ...rows.map(row =>
      row.map(val => {
        const escaped = (val === null || val === undefined ? '' : String(val)).replace(/"/g, '""')
        return `"${escaped}"`
      }).join(';')
    )
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
