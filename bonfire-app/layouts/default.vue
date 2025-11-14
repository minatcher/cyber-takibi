<template>
  <div id="main">
    <EnterPage />
    <div v-if="render" id="render">
      <Background />
      <Artwork
        :sound-toggle.sync="toggleSound"
        :mic-toggle.sync="toggleMic"
        @micAccess="mic = $event"
        @distortDeg="deg = $event"
      />
      <Effects :sound-toggle.sync="toggleSound" :distort-angle.sync="deg" />
      <nuxt />
      <div class="control-btns">
        <div class="toggleButton">
          <p>Sound Play</p>
          <toggle-button
            v-model="toggleSound"
            :color="{
              ckecked: 'rgba(255, 255, 255, 0.8)',
              unchecked: 'rgba(255, 255, 255, 0.4)',
            }"
            :width="44"
            :height="20"
          />
        </div>
        <div class="toggleButton" :style="{ opacity: mic ? 1 : 0.3 }">
          <p>Interactive Mode<br />(microphone inputs)</p>
          <toggle-button
            v-model="toggleMic"
            :color="{
              ckecked: 'rgba(255, 255, 255, 0.8)',
              unchecked: 'rgba(255, 255, 255, 0.4)',
            }"
            :width="44"
            :height="20"
          />
        </div>
        <p v-if="!mic" class="alert">
          Interactive Mode requires permission to access microphone.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      render: false,
      values: {
        sunrise: 1674942215,
        sunset: 1674979419,
        rain: 9,
        clouds: 70,
        windSpeed: 0.5,
        windDeg: 0,
        snow: 0,
        temp: 15,
        city: 'undefined',
        text: '(ramdomly set)',
      },
      toggleSound: false,
      toggleMic: false,
      mic: false,
      deg: 0,
    }
  },
  // render components after setting weather data
  async beforeMount() {
    const position = await this.getPosition()
    if (position !== null) {
      // fetch weather data
      this.render = await this.initWeather(position.coords)
    } else {
      // use defined weather
      this.setRndVal()
      this.render = await this.defineWeather(this.values)
    }
    window.console.log('default')
  },
  destroyed() {
    this.render = false
  },
  methods: {
    ...mapActions('weather', ['initWeather', 'defineWeather']),

    setRndVal() {
      this.values.rain = Math.round(this.generateRndVal(0, 8))
      if (this.values.rain <= 4) {
        this.values.rain = 0
        this.values.clouds = Math.round(this.generateRndVal(0, 50))
      } else {
        this.values.clouds = Math.round(this.generateRndVal(50, 100))
      }
      this.values.windSpeed = Math.round(this.generateRndVal(0, 700)) / 100
      this.values.windDeg = Math.round(this.generateRndVal(0, 360))
    },

    getPosition() {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(resolve, (e) => {
          window.console.log(e)
          resolve(null)
        })
      })
    },

    generateRndVal(min, max) {
      return Math.random() * (max - min + 1) + min
    },
  },
}
</script>

<style lang="scss" scoped>
#main {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  #render {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2;
    .control-btns {
      position: absolute;
      bottom: 30px;
      right: 3vw;
      .toggleButton {
        display: flex;
        margin: 10px 0;
        flex-direction: row;
        justify-content: right;
        align-items: center;
        p {
          margin: 0 15px;
          font-size: 11px;
          text-align: right;
          line-height: 150%;
        }
      }
      .alert {
        margin: 0;
        font-size: 10px;
        text-align: right;
        color: crimson;
      }
    }
  }
}
</style>
