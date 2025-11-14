<template>
  <div id="introduction">
    <h2>Bonfire App</h2>
    <p>
      This app uses weather information, so please set your location access
      permissions to get started.
    </p>
    <p>If you deny access, the weather information is set randomly.</p>
    <p>
      If you also allow microphone input, you will enjoy an Interactive Mode
      that lets you control the scale of the bonfire.
    </p>
  </div>
</template>

<script>
export default {
  name: 'EnterPage',
}
</script>

<style lang="scss" scoped>
#introduction {
  width: 85%;
  max-width: 680px;
  line-height: 200%;
  z-index: 1;
  h2 {
    text-align: center;
  }
}
</style>
