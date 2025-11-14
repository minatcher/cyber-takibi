const state = () => ({
  current: {
    sunrise: 6,
    sunset: 18,
    rain: 0,
    clouds: 0,
    windSpeed: 0,
    windDeg: 0,
    snow: 0,
    temp: 15,
    city: 'undefined',
    text: '(ramdomly set)',
  },
})

const getters = {
  getValues(state) {
    return state.current
  },
}

const mutations = {
  setValues(state, values) {
    state.current = values
  },
}

const actions = {
  async initWeather({ commit }, pos) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${pos.latitude}&lon=${pos.longitude}&lang=en&appid=023a905ab1d794b1cd2d23d7eb39e4e7`
    )
    const result = await response.json()

    return new Promise((resolve) => {
      if (result) {
        const values = {
          sunrise: result.sys.sunrise,
          sunset: result.sys.sunset,
          rain: 'rain' in result ? result.rain['1h'] : 0,
          clouds: result.clouds.all,
          windSpeed: result.wind.speed,
          windDeg: result.wind.deg,
          snow: 'snow' in result ? result.snow['1h'] : 0,
          temp: Math.round(result.main.temp - 273.15),
          city: result.name,
          text: result.weather[0].description,
        }
        window.console.log('apply current weather', values)
        commit('setValues', values)
      }
      resolve(true)
    })
  },
  defineWeather({ commit }, val) {
    return new Promise((resolve) => {
      window.console.log('apply defined weather', val)
      commit('setValues', val)
      resolve(true)
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
