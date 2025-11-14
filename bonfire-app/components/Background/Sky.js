export default class Sky {
  constructor(canvas, weatherVal) {
    this.cnv = canvas
    this.weather = weatherVal
    this.init()
  }

  init() {
    this.cnv.width = window.innerWidth
    this.cnv.height = window.innerHeight
    this.ctx = this.cnv.getContext('2d')
    this.grad = this.ctx.createLinearGradient(0, 0, 0, this.cnv.height)
    this.grad.addColorStop(0, '#ffffff')
    this.grad.addColorStop(0.75, '#fffbee')
    this.grad.addColorStop(1, '#ffe599')
    this.ctx.shadowColor = '#ffffff'
    this.skyImg = new Image()
    this.skyImg.src = require('@/assets/images/bg-sun-01.png')

    this.vertR = Math.min(this.cnv.height, this.cnv.width) * 0.6
    this.horitR = Math.max(this.cnv.height, this.cnv.width) * 0.7
    this.arcX = this.cnv.width / 2
    this.arcY = this.vertR + 100
    const sunriseUTC = new Date(this.weather.sunrise * 1000)
    const sunsetUTC = new Date(this.weather.sunset * 1000)
    this.sunrise =
      sunriseUTC.getHours() + '.' + Math.round(sunriseUTC.getMinutes() * 1.66)
    this.sunset =
      sunsetUTC.getHours() + '.' + Math.round(sunsetUTC.getMinutes() * 1.66)
    this.clock = 0
    this.time = null
    this.horit = null
    this.vert = null
  }

  calcPosition() {
    this.time = (this.clock - this.sunrise) / (this.sunset - this.sunrise)
    const angle = (Math.PI / 5) * 6 + (Math.PI / 5) * 4 * this.time
    this.horit = this.arcX + this.horitR * Math.cos(angle)
    this.vert = this.arcY + this.vertR * Math.sin(angle)
  }

  generateSky() {
    const timeDomain = Math.max(0, Math.min(1, this.time))
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height)
    this.ctx.drawImage(
      this.skyImg,
      this.skyImg.width * timeDomain +
        ((timeDomain < 0.5 ? 1 : -1) * 120 * 24) / (this.sunset - this.sunrise),
      0,
      3,
      this.skyImg.height,
      0,
      0,
      this.cnv.width,
      this.cnv.height
    )
  }

  generateSun() {
    this.ctx.fillStyle = this.grad
    this.ctx.shadowBlur = 50
    this.ctx.beginPath()
    this.ctx.moveTo(this.horit, this.vert)
    this.ctx.arc(this.horit, this.vert, 40, 0, 2 * Math.PI)
    this.ctx.fill()
  }

  run() {
    this.skyImg.onload = () => {
      const date = new Date()
      this.clock = Number(
        date.getHours() + '.' + Math.round(date.getMinutes() * 1.66)
      )
      this.calcPosition()
      this.generateSky()
      if (this.vert < this.cnv.height / 2 && this.weather.clouds < 50) {
        window.console.log(this.vert, this.horit)
        this.generateSun()
      }
    }
  }

  runDemo(stepUnit) {
    // window.console.log(this.clock)
    this.clock += stepUnit
    if (this.clock > 23.59) this.clock = 0
    this.calcPosition()
    this.generateSky()
    if (this.vert < this.cnv.height / 2) this.generateSun()
    requestAnimationFrame(this.runDemo.bind(this, stepUnit))
  }
}
