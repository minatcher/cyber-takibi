<template>
  <section
    class="artwork"
    :style="{
      transform: `skewX(${
        distortDeg.current
      }deg) translateX(${-distortDeg.distX}px)`,
    }"
  >
    <canvas
      ref="canvas"
      class="artwork__canvas"
      :style="{
        maxWidth: width + resizeRange + 'px',
        minWidth: width - resizeRange + 'px',
      }"
    ></canvas>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import Common from './Common'
import Fire from './Fire'
import AudioAnalyze, { GetResult } from './AudioAnalyze'
import sound from '~/static/bonfire.mp3'
export default {
  name: 'ArtworkIndex',
  props: {
    soundToggle: {
      type: Boolean,
      default: false,
    },
    micToggle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      width: undefined,
      height: undefined,
      minWidth: 600,
      resizeRange: 250,
      weather: null,
      uniforms: {
        noiseScale: null,
        magnitude: 1.14,
        gain: 0.7,
      },
      distortDeg: {
        val: 0,
        current: 0,
        max: 0,
        delta: 0,
        distX: 0,
      },
      initThree: null,
      fire: null,
      audioAnalyze: null,
      audioData: 0,
      fireSound: null,
      // filter: null,
    }
  },
  computed: {
    switchSound() {
      if (this.soundToggle) {
        this.fireSound.play()
      } else {
        this.fireSound.pause()
      }
      window.console.log(this.fireSound.paused)
      return this.fireSound.paused
    },

    switchMic() {
      if (this.audioAnalyze === null) {
        if (this.micToggle) {
          this.setAudioData()
        } else {
          this.setDefaultVal()
        }
      } else {
        this.audioAnalyze[2].getAudioTracks()[0].enabled = this.micToggle
        if (!this.micToggle) {
          this.setDefaultVal()
        }
      }
      window.console.log('toggle mic', this.micToggle)
      return this.micToggle
    },
  },
  watch: {
    audioData(newValue, oldValue) {
      if (newValue) {
        if (newValue >= 8 && newValue < 20 && newValue - oldValue > 4) {
          window.console.log('audio', newValue)
          this.uniforms.gain = Math.min(
            1 - 0.036 * newValue,
            this.uniforms.gain
          )
          this.uniforms.noiseScale.x = Math.max(
            0.085 * newValue,
            this.uniforms.noiseScale.x
          )
          this.uniforms.noiseScale.y = Math.max(
            0.085 * newValue,
            this.uniforms.noiseScale.y
          )
          this.setSoundVolume()
          // window.console.log(this.uniforms.gain)
        } else if (newValue < 3 && Math.abs(newValue - oldValue) < 0.01) {
          this.uniforms.gain = Math.min(this.uniforms.gain + 0.005, 0.95)
          this.uniforms.noiseScale.x = Math.max(
            this.uniforms.noiseScale.x - 0.008,
            0.6
          )
          this.uniforms.noiseScale.y = Math.max(
            this.uniforms.noiseScale.y - 0.008,
            0.6
          )
          this.setSoundVolume()
          // window.console.log(this.uniforms.gain)
        }
      }
    },
  },
  beforeMount() {
    window.console.log('artwork')
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.fireSound = new Audio(sound)
    this.fireSound.loop = true
    this.fireSound.volume = 0.7
  },
  mounted() {
    this.setAudioData()
    // this.filter = new NoiseFilter()
    this.weather = this.getValues()
    this.init()
    this.loop()

    addEventListener('devicechange', (e) => {
      this.setAudioData()
    })
  },
  methods: {
    ...mapGetters('weather', ['getValues']),

    init() {
      this.uniforms.noiseScale = new this.$THREE.Vector4(0.9, 1.6, 1, 0.4)
      this.setDefaultVal()

      this.distortDeg.max = Math.min(
        -3 * Math.sin(this.weather.windDeg) * this.weather.windSpeed,
        45
      )
      window.console.log('max canvas distortion: ', this.distortDeg.max)

      this.initThree = new Common(this.$refs.canvas)
      this.fire = new Fire(this.uniforms, this.minWidth)
      this.initThree.addScene(this.fire)
    },

    loop() {
      this.applyWind()
      this.mic = this.switchMic
      // this.audioData = this.filter.getNoise(this.audioAnalyze)
      this.audioData = GetResult(this.audioAnalyze)
      this.fire.update(this.initThree.clock, this.uniforms)
      this.initThree.render()
      this.state = this.switchSound
      requestAnimationFrame(this.loop)
    },

    setDefaultVal() {
      this.uniforms.noiseScale.x =
        1.14 - (this.weather.rain >= 2 ? this.weather.rain * 0.04 : 0)
      this.uniforms.noiseScale.y =
        1.14 - (this.weather.rain >= 2 ? this.weather.rain * 0.04 : 0)
      this.uniforms.gain =
        0.7 + (this.weather.rain >= 2 ? this.weather.rain * 0.025 : 0)
    },

    setSoundVolume() {
      if (this.uniforms.gain < 0.4) {
        this.fireSound.volume = 1.0
      } else if (this.uniforms.gain < 0.7) {
        this.fireSound.volume = 0.65
      } else {
        this.fireSound.volume = 0.3
      }
      window.console.log('volume', this.fireSound.volume)
    },

    async setAudioData() {
      this.audioAnalyze = await AudioAnalyze()
      if (this.audioAnalyze) {
        this.$emit('micAccess', true)
      }
    },

    applyWind() {
      if (this.distortDeg.delta === 0) {
        const num = Math.round(Math.random() * (400 - 1 + 1) + 1)
        if (num === 1 && this.distortDeg.val < this.distortDeg.max / 2) {
          this.distortDeg.delta = 0.1
        } else if (num === 1) {
          this.distortDeg.delta = -0.1
        }
      } else {
        const deg = this.distortDeg.val + this.distortDeg.delta
        if (
          (this.distortDeg.max < 0 && (deg < this.distortDeg.max || deg > 0)) ||
          (this.distortDeg.max > 0 && (deg > this.distortDeg.max || deg < 0))
        ) {
          this.distortDeg.delta = 0
        } else {
          if (this.distortDeg.current !== Math.round(deg)) {
            this.distortDeg.current = Math.round(deg)
            this.distortDeg.distX =
              (this.height / 2) *
              Math.tan(this.distortDeg.current * (Math.PI / 180))

            this.$emit('distortDeg', -this.distortDeg.current)
          }
          this.distortDeg.val = deg
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.artwork {
  width: 100vw;
  height: 100vh;
  transition: all 0.4s;
  &__canvas {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100vw;
    height: auto;
    transform: translate(-50%, -50%);
    opacity: 0.95;
    // width: 100vw;
  }
}
</style>
