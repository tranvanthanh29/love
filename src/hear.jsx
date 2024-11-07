import { useEffect, useRef } from 'react'
import { getZodiacSign } from './Function/getZodiacSign.js'
import { CountingLoveDays } from './Function/CountingLoveDays.js'
import { formatDate } from './Function/formatDate.js'

const HeartCanvas = ({ user }) => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const settings = {
      particles: {
        length: 500,
        duration: 2,
        velocity: 100,
        effect: -0.75,
        size: 30
      }
    }

    class Point {
      constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
      }

      clone() {
        return new Point(this.x, this.y)
      }

      length(length) {
        if (length === undefined) {
          return Math.sqrt(this.x * this.x + this.y * this.y)
        }
        this.normalize()
        this.x *= length
        this.y *= length
        return this
      }

      normalize() {
        const length = this.length()
        this.x /= length
        this.y /= length
        return this
      }
    }

    class Particle {
      constructor() {
        this.position = new Point()
        this.velocity = new Point()
        this.acceleration = new Point()
        this.age = 0
      }

      initialize(x, y, dx, dy) {
        this.position.x = x
        this.position.y = y
        this.velocity.x = dx
        this.velocity.y = dy
        this.acceleration.x = dx * settings.particles.effect
        this.acceleration.y = dy * settings.particles.effect
        this.age = 0
      }

      update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime
        this.position.y += this.velocity.y * deltaTime
        this.velocity.x += this.acceleration.x * deltaTime
        this.velocity.y += this.acceleration.y * deltaTime
        this.age += deltaTime
      }

      draw(context, image) {
        function ease(t) {
          return (--t) * t * t + 1
        }
        const size = image.width * ease(this.age / settings.particles.duration)
        context.globalAlpha = 1 - this.age / settings.particles.duration
        context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size)
      }
    }

    class ParticlePool {
      constructor(length) {
        this.particles = Array.from({ length }, () => new Particle())
        this.firstActive = 0
        this.firstFree = 0
        this.duration = settings.particles.duration
      }

      add(x, y, dx, dy) {
        this.particles[this.firstFree].initialize(x, y, dx, dy)

        this.firstFree++
        if (this.firstFree === this.particles.length) this.firstFree = 0
        if (this.firstActive === this.firstFree) this.firstActive++
        if (this.firstActive === this.particles.length) this.firstActive = 0
      }

      update(deltaTime) {
        let i

        if (this.firstActive < this.firstFree) {
for (i = this.firstActive; i < this.firstFree; i++) {
            this.particles[i].update(deltaTime)
          }
        } else {
          for (i = this.firstActive; i < this.particles.length; i++) {
            this.particles[i].update(deltaTime)
          }
          for (i = 0; i < this.firstFree; i++) {
            this.particles[i].update(deltaTime)
          }
        }

        while (this.particles[this.firstActive].age >= this.duration && this.firstActive !== this.firstFree) {
          this.firstActive++
          if (this.firstActive === this.particles.length) this.firstActive = 0
        }
      }

      draw(context, image) {
        let i

        if (this.firstActive < this.firstFree) {
          for (i = this.firstActive; i < this.firstFree; i++) {
            this.particles[i].draw(context, image)
          }
        } else {
          for (i = this.firstActive; i < this.particles.length; i++) {
            this.particles[i].draw(context, image)
          }
          for (i = 0; i < this.firstFree; i++) {
            this.particles[i].draw(context, image)
          }
        }
      }
    }

    function pointOnHeart(t) {
      return new Point(
        150 * Math.pow(Math.sin(t), 3),
        110 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
      )
    }

    const createImage = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = settings.particles.size
      canvas.height = settings.particles.size

      function to(t) {
        const point = pointOnHeart(t)
        point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350
        point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350
        return point
      }

      context.beginPath()
      let t = -Math.PI
      let point = to(t)
      context.moveTo(point.x, point.y)
      while (t < Math.PI) {
        t += 0.01
        point = to(t)
        context.lineTo(point.x, point.y)
      }
      context.closePath()
      // Màu trái tim
      context.fillStyle = '#ea80b0'
      context.fill()

      const image = new Image()
      image.src = canvas.toDataURL()
      return image
    }

    const image = createImage()
    const particles = new ParticlePool(settings.particles.length)
    const particleRate = settings.particles.length / settings.particles.duration

    const avatar1 = new Image()
    const avatar2 = new Image()

    // Ảnh đại diện
    avatar1.src = user.avatar
    avatar2.src = user.pending_request_to.avatar

    let time

    function render() {
      requestAnimationFrame(render)

      const newTime = new Date().getTime() / 1000
      const deltaTime = newTime - (time || newTime)
      time = newTime

      context.clearRect(0, 0, canvas.width, canvas.height)

      const amount = particleRate * deltaTime
      for (let i = 0; i < amount; i++) {
const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random())
        const dir = pos.clone().length(settings.particles.velocity)
        particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y)
      }

      particles.update(deltaTime)
      particles.draw(context, image)

      // Draw names on each side of the heart
      context.font = 'bold 20px "Roboto", sans-serif'
      context.fillStyle = '#C0C0C0'
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      const leftX = canvas.width / 2 - 120
      const rightX = canvas.width / 2 + 120
      const y = canvas.height / 2 - 80

      function wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ')
        let line = ''

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' '
          const testWidth = context.measureText(testLine).width

          if (testWidth > maxWidth) {
            context.fillText(line, x, y)
            line = words[n] + ' '
            y += lineHeight
          } else {
            line = testLine
          }
        }
        context.fillText(line, x, y)
      }

      // Tên người dùng
      wrapText(`${user.fullName}`, leftX, y, 120, 30)
      wrapText(`${user.pending_request_to.fullName}`, rightX, y, 120, 30)
      wrapText('Đang yêu', canvas.width / 2, canvas.height / 2 - 10)
      wrapText('ngày', canvas.width / 2, canvas.height / 2 + 60)

      // Draw the center text
      context.font = 'bold 36px "Roboto", sans-serif'
      context.fillStyle = '#FF69B4'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(`${CountingLoveDays(user.loveDay)}`, canvas.width / 2, canvas.height / 2 + 30)

      // Draw avatars
      const avatarSize = 60 // Kích thước ảnh đại diện
      const borderWidth = 4 // Độ dày viền

      function drawAvatar(x, y, image) {
        context.beginPath()
        context.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
        context.clip()
        context.drawImage(image, x, y, avatarSize, avatarSize)
        context.restore()

        // Draw border
        context.lineWidth = borderWidth
        context.strokeStyle = '#FF69B4' // Màu của viền
        context.stroke()
      }

      if (avatar1.complete) {
        context.save()
        drawAvatar(canvas.width / 2 - 175, canvas.height / 2 + 140, avatar1)
        // Draw birthdate, gender symbol, and zodiac sign below the first avatar
        context.font = '16px "Roboto", sans-serif'
        context.fillStyle = '#C0C0C0'
        context.textAlign = 'center'
        context.textBaseline = 'top'
        context.fillText(`${formatDate(user.dateBirth)}`, canvas.width / 2 - 170 + avatarSize / 2, canvas.height / 2 + 140 + avatarSize + 10)
context.fillText(`${user.gender === 'Nam' ? '♂' : '♀'} ${getZodiacSign(user.dateBirth)}`, canvas.width / 2 - 180 + avatarSize / 2, canvas.height / 2 + 140 + avatarSize + 30)
      }

      if (avatar2.complete) {
        context.save()
        drawAvatar(canvas.width / 2 + 110, canvas.height / 2 + 140, avatar2)
        // Draw birthdate, gender symbol, and zodiac sign below the second avatar
        context.font = '16px "Roboto", sans-serif'
        context.fillStyle = '#C0C0C0'
        context.textAlign = 'center'
        context.textBaseline = 'top'
        context.fillText(`${formatDate(user.pending_request_to.dateBirth)}`, canvas.width / 2 + 110 + avatarSize / 2, canvas.height / 2 + 140 + avatarSize + 10)
        context.fillText(`${user.pending_request_to.gender === 'Nam'? '♂' : '♀'} ${getZodiacSign(user.pending_request_to.dateBirth)}`, canvas.width / 2 + 110 + avatarSize / 2, canvas.height / 2 + 140 + avatarSize + 30)
      }
    }

    function onResize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', onResize)
    onResize()
    render()

    return () => {
      window.removeEventListener('resize', onResize)
    }
  })

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  )
}

export default HeartCanvas