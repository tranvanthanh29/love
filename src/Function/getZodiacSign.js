const zodiacSigns = [
    { sign: 'Bạch Dương', icon: '♈', start: '03-21', end: '04-19' },
    { sign: 'Kim Ngưu', icon: '♉', start: '04-20', end: '05-20' },
    { sign: 'Song Tử', icon: '♊', start: '05-21', end: '06-20' },
    { sign: 'Cự Giải', icon: '♋', start: '06-21', end: '07-22' },
    { sign: 'Sư Tử', icon: '♌', start: '07-23', end: '08-22' },
    { sign: 'Xử Nữ', icon: '♍', start: '08-23', end: '09-22' },
    { sign: 'Thiên Bình', icon: '♎', start: '09-23', end: '10-22' },
    { sign: 'Bọ Cạp', icon: '♏', start: '10-23', end: '11-21' },
    { sign: 'Nhân Mã', icon: '♐', start: '11-22', end: '12-21' },
    { sign: 'Ma Kết', icon: '♑', start: '12-22', end: '01-19' },
    { sign: 'Bảo Bình', icon: '♒', start: '01-20', end: '02-18' },
    { sign: 'Song Ngư', icon: '♓', start: '02-19', end: '03-20' }
  ]
  
  export function getZodiacSign(dateBirthday) {
    if (typeof dateBirthday !== 'string') {
      throw new Error('Date must be a string in the format "MM-DD"')
    }
  
    const date = new Date(dateBirthday)
    const day = date.getUTCDate()
    const month = date.getUTCMonth() + 1
  
    if (isNaN(day) || isNaN(month)) {
      throw new Error('Invalid date format. Expected format is "MM-DD"')
    }
  
    for (const zodiac of zodiacSigns) {
      const [startMonth, startDay] = zodiac.start.split('-').map(Number)
      const [endMonth, endDay] = zodiac.end.split('-').map(Number)
  
      const startDate = new Date(2024, startMonth - 1, startDay)
      const endDate = new Date(2024, endMonth - 1, endDay)
      const currentDate = new Date(2024, month - 1, day)
  
      if (
        (currentDate >= startDate && currentDate <= endDate) ||
        (startMonth === 12 && endMonth === 1 && (currentDate >= startDate || currentDate <= endDate))
      ) {
        return zodiac.icon
      }
    }
    return ''
  }