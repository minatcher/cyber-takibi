import * as THREE from 'three'

export default class Common {
  constructor(cvs) {
    this.clock = null
    this.init(cvs)
  }

  init(cvs) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    )
    this.camera.position.z = 2

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({ alpha: true, canvas: cvs })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.clock = new THREE.Clock()
  }

  addScene(fire) {
    this.scene.add(fire.mesh)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}
