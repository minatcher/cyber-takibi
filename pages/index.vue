<template>
  <section class="weather-info">
    <div class="condition">
      <div class="condition-icon" :class="condition"></div>
      <p class="condition-temperature">{{ weather.temp }}</p>
      <p class="unit">°C</p>
    </div>
    <p class="description">
      {{ weather.text }}
    </p>
    <div class="details">
      <div class="icon location"></div>
      <p class="value">{{ weather.city }}</p>
    </div>
    <div class="details">
      <div class="icon wind"></div>
      <p class="value">{{ windDir }}<br />{{ weather.windSpeed }} m/s</p>
    </div>
    <div class="details">
      <div class="icon sun"></div>
      <p class="value">sunrise {{ sunrise }}<br />sunset {{ sunset }}</p>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'IndexPage',
  data() {
    return {
      weather: null,
      condition: 'sunny',
      windDir: '',
      sunrise: '',
      sunset: '',
      toggle: false,
      fireSound: this.soundElem,
    }
  },
  beforeMount() {
    window.console.log('page')
    this.weather = this.getValues()
  },
  mounted() {
    this.classifyCondition()
    this.classifyWindDir()
    this.calcSunTime()
    window.console.log(this.soundElem)
  },
  methods: {
    ...mapGetters('weather', ['getValues']),

    classifyCondition() {
      if (this.weather.snow > 0) {
        this.condition = 'snowy'
      } else if (this.weather.rain > 0) {
        this.condition = 'rainy'
      } else if (this.weather.clouds > 90) {
        this.condition = 'cloudy'
      } else if (this.weather.clouds > 30) {
        this.condition = 'sunny-cloudy'
      } else {
        this.condition = 'sunny'
      }
    },

    classifyWindDir() {
      if (this.weather.windDeg > 337.5) {
        this.windDir = 'Northerly'
      } else if (this.weather.windDeg > 292.5) {
        this.windDir = 'North Westerly'
      } else if (this.weather.windDeg > 247.5) {
        this.windDir = 'Westerly'
      } else if (this.weather.windDeg > 202.5) {
        this.windDir = 'South Westerly'
      } else if (this.weather.windDeg > 157.5) {
        this.windDir = 'Southerly'
      } else if (this.weather.windDeg > 122.5) {
        this.windDir = 'South Easterly'
      } else if (this.weather.windDeg > 67.5) {
        this.windDir = 'Easterly'
      } else if (this.weather.windDeg > 22.5) {
        this.windDir = 'North Easterly'
      } else {
        this.windDir = 'Northerly'
      }
    },

    calcSunTime() {
      const sunriseUTC = new Date(this.weather.sunrise * 1000)
      const sunsetUTC = new Date(this.weather.sunset * 1000)
      this.sunrise = sunriseUTC.getHours() + ':' + sunriseUTC.getMinutes()
      this.sunset = sunsetUTC.getHours() + ':' + sunsetUTC.getMinutes()
    },
  },
}
</script>

<style lang="scss" scoped>
.weather-info {
  display: flex;
  position: absolute;
  width: 160px;
  height: auto;
  right: 0;
  top: 0;
  padding-top: 30px;
  padding-right: 1vw;
  justify-content: center;
  flex-direction: column;
  p {
    margin: 0;
  }
  .condition {
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    &-icon {
      width: 33px;
      height: 33px;
      margin-right: 15px;
      background-repeat: no-repeat;
      background-position: center;
      &.sunny {
        background-image: url('~@/assets/images/icons/sunny.svg');
      }
      &.sunny-cloudy {
        background-image: url('~@/assets/images/icons/sunny-cloud.svg');
      }
      &.cloudy {
        background-image: url('~@/assets/images/icons/cloudy.svg');
      }
      &.rainy {
        background-image: url('~@/assets/images/icons/rainy.svg');
      }
      &.snowy {
        background-image: url('~@/assets/images/icons/snowy.svg');
      }
    }
    &-temperature {
      font-size: 25px;
    }
    .unit {
      padding-top: 5px;
      font-size: 20px;
    }
  }
  .description {
    font-size: 15px;
    margin: 15px 0;
    text-align: center;
  }

  .details {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 5px 0;
    .icon {
      width: 20px;
      height: 20px;
      margin: 0 10px;
      background-repeat: no-repeat;
      background-position: center;
      &.location {
        background-size: auto 80%;
        background-image: url('~@/assets/images/icons/location.svg');
      }
      &.wind {
        background-image: url('~@/assets/images/icons/wind.svg');
      }
      &.sun {
        background-image: url('~@/assets/images/icons/sun.svg');
      }
    }
    .value {
      width: 100px;
      font-size: 10px;
      font-weight: 300;
      line-height: 150%;
    }
  }
}
</style>
