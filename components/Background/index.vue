<template>
  <section>
    <img
      id="bg_img"
      :style="{
        filter: brightness,
        maxWidth: width + resizeRange + 'px',
        minWidth: width - resizeRange + 'px',
      }"
      src="https://images.unsplash.com/photo-1589411407928-2c3398d3e80c"
    />
    <canvas ref="cnv" class="sky"></canvas>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import Sky from './Sky'
export default {
  name: 'BackgroundIndex',
  data() {
    return {
      width: undefined,
      minWidth: 600,
      resizeRange: 250,
      brightness: 'brightness(80%)',
    }
  },
  beforeMount() {
    window.console.log('background')
    this.width = window.innerWidth
  },
  mounted() {
    this.weather = this.getValues()
    window.console.log(this.weather)
    if (this.weather.clouds > 50)
      this.brightness = `brightness(${130 - this.weather.clouds}%)`

    this.sky = new Sky(this.$refs.cnv, this.weather)
    this.sky.run()
    // this.sky.runDemo(0.06)
  },
  methods: {
    ...mapGetters('weather', ['getValues']),
  },
}
</script>

<style lang="scss" scoped>
#bg_img {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 50%;
  object-fit: fill;
  transform: translateX(-50%);
  user-select: none;
}
.sky {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  mix-blend-mode: multiply;
}
</style>
