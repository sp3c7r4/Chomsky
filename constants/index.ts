const colors = {
  light: {
    primary: "#32B582",
    black: "#000",
    overlay_white: "#F9F9F9",
    background_white: "#F0F1F3",
    background_black: "#121212",
    grey: "rgba(1,1,1,0.5)"
  }
}

const fontsizes = {
  heading1: 30,
  heading2: 26,
  heading3: 15,
  paragraph1: 15,
  button: 18,
}

const speechSet = {
  greeting: require('@/assets/audio/greeting.mp3'),
  nanSpeech: require('@/assets/audio/nanSpeech.mp3'),
}

const mastra = {
  url: "https://mainly-destined-marmot.ngrok-free.app"
}
export { colors, fontsizes, speechSet, mastra };