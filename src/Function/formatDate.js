export function formatDate(dateBirth) {
    const date = new Date(dateBirth)
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');// Tháng bắt đầu từ 0
    const year = date.getUTCFullYear()
  
    const formattedDate = `${day}/${month}/${year}`
    return formattedDate
  }