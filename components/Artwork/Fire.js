import * as THREE from 'three'
import _vertexShader from './fireshader.vert'
import _fragmentShader from './fireshader.frag'

export default class Fire {
  constructor(args, minWidth) {
    this.mesh = null
    this.init(args, minWidth)
  }

  init(args, minWidth) {
    const _defines = {
      ITERATIONS: '20',
      OCTIVES: '3',
    }

    const loader = new THREE.TextureLoader()
    loader.crossOrigin = ''
    const _uniforms = {
      fireTex: {
        type: 't',
        value: loader.load(require('@/assets/images/Fire.png')),
      },
      color: { type: 'c', value: new THREE.Color(0xeeeeee) },
      time: { type: 'f', value: 0.0 },
      seed: { type: 'f', value: Math.random() * 19.19 },
      invModelMatrix: { type: 'm4', value: new THREE.Matrix4() },
      scale: { type: 'v3', value: new THREE.Vector3(1, 1, 1) },

      noiseScale: { type: 'v4', value: new THREE.Vector4(1, 2, 1, 0.4) },
      magnitude: { type: 'f', value: 1.3 },
      lacunarity: { type: 'f', value: 2.0 },
      gain: { type: 'f', value: 0.5 },
    }

    const fireMaterial = new THREE.ShaderMaterial({
      defines: _defines,
      uniforms: _uniforms,
      vertexShader: _vertexShader,
      fragmentShader: _fragmentShader,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      depthTest: false,
    })

    const fireTex = _uniforms.fireTex
    fireTex.magFilter = fireTex.minFilter = THREE.LinearFilter
    fireTex.wrapS = fireTex.wrapT = THREE.ClampToEdgeWrapping
    fireMaterial.uniforms.noiseScale.value = args.noiseScale
    fireMaterial.uniforms.magnitude.value = args.magnitude
    fireMaterial.uniforms.gain.value = args.gain

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 1.0, 1.0),
      fireMaterial
    )
    this.mesh.position.set(0, 0.15, 1.0)
    if (window.innerWidth <= minWidth) {
      const n = 1 - Math.pow(window.innerWidth / minWidth, 3)
      this.mesh.scale.set(n, n, n)
    }
  }

  update(clock, args) {
    const invModelMatrix = this.mesh.material.uniforms.invModelMatrix.value
    this.mesh.updateMatrixWorld(true)
    // invModelMatrix.getInverse(this.mesh.matrixWorld)
    invModelMatrix.copy(this.mesh.matrixWorld).invert()
    if (clock !== undefined) {
      this.mesh.material.uniforms.time.value = clock.getElapsedTime()
    }

    if (args !== undefined) {
      this.mesh.material.uniforms.magnitude.value = args.magnitude
      this.mesh.material.uniforms.gain.value = args.gain
      this.mesh.material.uniforms.noiseScale.value = args.noiseScale
    }

    this.mesh.material.uniforms.invModelMatrix.value = invModelMatrix

    this.mesh.material.uniforms.scale.value = this.mesh.scale
  }
}
