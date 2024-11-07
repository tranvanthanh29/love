export function CountingLoveDays(dates) {
    const loveDate = new Date(dates)
    const dateLoveString = `${loveDate.getDay()}-${loveDate.getMonth()+1}-${loveDate.getFullYear()}`
  
    const [day, month, year] = dateLoveString.split('-').map(Number) // Tách chuỗi và chuyển đổi thành số
    const dateLove = new Date(year, month - 1, day) // Tạo đối tượng Date (tháng tính từ 0)
  
    const date = new Date()
    // Chuyển đổi cả hai ngày sang UTC để tránh vấn đề về múi giờ
    const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    const dateLoveUTC = Date.UTC(dateLove.getFullYear(), dateLove.getMonth(), dateLove.getDate())
    const period = dateUTC - dateLoveUTC
    // Chuyển đổi miligiây thành giây
    const dateLoveSeconds = Math.floor(period / 1000)
    // Tính số ngày
    const dateLoveDays = Math.floor(dateLoveSeconds / (24 * 3600))
    return dateLoveDays
  }