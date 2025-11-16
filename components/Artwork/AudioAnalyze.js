export default async function AudioAnalyze() {
  let stream = null
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
  } catch (e) {
    window.console.log(e, 'disable microphone')
  }
  return new Promise((resolve) => {
    if (stream === null) {
      resolve(stream)
    } else {
      try {
        const audioContext = new AudioContext()
        const audioSource = audioContext.createMediaStreamSource(stream)
        const analyzer = audioContext.createAnalyser()
        analyzer.fftSize = 128
        // analyzer.minDecibels = min
        // analyzer.maxDecibels = max
        analyzer.smoothingTimeConstant = 0.1
        audioSource.connect(analyzer)
        const volumes = new Uint8Array(analyzer.frequencyBinCount)

        resolve([analyzer, volumes, stream])
      } catch (e) {
        window.console.log(e)
      }
    }
  })
}

export function GetResult(obj) {
  if (obj) {
    obj[0].getByteFrequencyData(obj[1])
    let volumeSum = 0
    for (const volume of obj[1]) volumeSum += volume
    return volumeSum / obj[1].length
  } else {
    return null
  }
}

// export class NoiseFilter {
//   constructor() {
//     this.alpha = 1.8
//     this.beta = 0.1
//     this.noiseSum = 0
//     // this.noise = null
//   }

//   getNoise(obj) {
//     if (obj) {
//       const analyzer = obj[0]
//       const volumes = obj[1]
//       analyzer.getByteFrequencyData(volumes)

//       const volumeSum = volumes.reduce((a, b) => {
//         return a + b
//       }, 0)
//       if (this.noiseSum === 0) {
//         // this.noise = volumes
//         this.noiseSum = volumeSum
//         return null
//       }
//       const xnr = volumeSum / this.noiseSum
//       if (xnr > this.alpha) return this.noiseSum / volumes.length

//       // for (let i = 0; i < volumes.length; i++) {
//       //   this.noise[i] = (1 - this.beta) * this.noise[i] + this.beta * volumes[i]
//       // }
//       this.noiseSum = (1 - this.beta) * volumeSum + this.beta * this.noiseSum
//       return this.noiseSum / volumes.length
//     }
//     return null
//   }
// }
