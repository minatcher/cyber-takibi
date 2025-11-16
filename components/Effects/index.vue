<template>
  <section
    class="rain"
    :style="{
      transform: `skewX(${distortAngle}deg)`,
      maxWidth: width + resizeRange + 'px',
      minWidth: width - resizeRange + 'px',
    }"
  >
    <div ref="front" class="front_row"></div>
    <div ref="back" class="back_row"></div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import Rain from './Rain'
import sound1 from '~/static/wind.mp3'
import sound2 from '~/static/rain.mp3'
export default {
  name: 'EffectsIndex',
  props: {
    soundToggle: {
      type: Boolean,
      default: false,
    },
    distortAngle: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      width: undefined,
      minWidth: 600,
      resizeRange: 250,
      windSound: null,
      maxWindVolume: 1.0,
      rainSound: null,
    }
  },
  computed: {
    switchWindSound() {
      if (this.distortAngle !== 0 && this.soundToggle) {
        this.windSound.play()
      } else {
        this.windSound.pause()
      }
      window.console.log(this.windSound.paused)
      return this.windSound.paused
    },
    switchRainSound() {
      if (this.soundToggle) {
        this.rainSound.play()
      } else {
        this.rainSound.pause()
      }
      window.console.log(this.rainSound.paused)
      return this.rainSound.paused
    },
  },
  watch: {
    distortAngle() {
      this.windSoundState = this.switchWindSound
      if (this.windSoundState) {
        this.windSound.currentTime = 0
      } else {
        this.windSound.volume =
          this.maxWindVolume * (Math.abs(this.distortAngle) / 45)
      }
    },
    soundToggle() {
      if (this.weather.rain > 1) {
        this.rainSoundState = this.switchRainSound
      }
    },
  },
  beforeMount() {
    this.width = window.innerWidth
    window.console.log('effect')
  },
  mounted() {
    this.weather = this.getValues()

    this.windSound = new Audio(sound1)
    this.windSound.loop = true
    this.maxWindVolume = Math.min(this.weather.windSpeed * 0.1, 1.0)

    if (this.weather.rain > 1) {
      this.effect = new Rain(
        this.weather.rain,
        this.$refs.front,
        this.$refs.back
      )
      this.rainSound = new Audio(sound2)
      this.rainSound.loop = true
      this.rainSound.volume = Math.min(this.weather.rain * 0.05, 0.5)
    }
  },
  methods: {
    ...mapGetters('weather', ['getValues']),
  },
}
</script>

<style lang="scss" scoped></style>
