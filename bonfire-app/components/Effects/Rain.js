export default class drawRain {
  constructor(value, el1, el2) {
    this.rain = value
    this.elFront = el1
    this.elBack = el2
    this.init()
  }

  init() {
    this.num = Math.min(Math.round((window.innerWidth / 200) * this.rain), 100)
    this.fragFront = document.createDocumentFragment()
    this.fragBack = document.createDocumentFragment()

    for (let i = 0; i < this.num; i++) {
      this.createElm()
    }

    this.elFront.appendChild(this.fragFront)
    this.elBack.appendChild(this.fragBack)
  }

  createElm() {
    const frontDrop = document.createElement('div')
    const backDrop = document.createElement('div')
    frontDrop.className = backDrop.className = 'drop'
    frontDrop.style.left = `${this.getRndVal(99, 0)}%`
    backDrop.style.right = `${this.getRndVal(99, 0)}%`
    frontDrop.style.bottom = backDrop.style.bottom = `${this.getRndVal(
      100,
      110
    )}%`

    const stem = document.createElement('div')
    stem.className = 'stem'
    frontDrop.style.animationDelay =
      backDrop.style.animationDelay =
      stem.style.animationDelay =
        `0.${this.getRndVal(99, 50)}s`
    frontDrop.style.animationDuration =
      backDrop.style.animationDuration =
      stem.style.animationDuration =
        `0.${this.getRndVal(70, 50)}s`

    frontDrop.appendChild(stem)
    backDrop.appendChild(stem)
    this.fragFront.appendChild(frontDrop)
    this.fragBack.appendChild(backDrop)
  }

  getRndVal(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
