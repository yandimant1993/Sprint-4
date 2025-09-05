export function useStationBackground(stationImgUrl) {
  const [bgColor, setBgColor] = useState([40, 40, 40])

  useEffect(() => {
    if (!stationImgUrl) {
      setBgColor([40, 40, 40])
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = stationImgUrl

    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const color = colorThief.getColor(img)
        setBgColor(color)
      } catch (err) {
        console.warn('Color extraction failed:', err)
        setBgColor([40, 40, 40])
      }
    }
  }, [stationImgUrl])

  const brightGradient = {
    background: `linear-gradient(
      to bottom,
      rgba(${bgColor.join(',')}, 0.3),
      rgba(0, 0, 0, 0.75)
    )`
  }

  const darkGradient = {
    background: `linear-gradient(
      to bottom,
      rgba(${bgColor.join(',')}, 0.6),
      rgba(0, 0, 0, 0.85)
    )`
  }

  return { bgColor, brightGradient, darkGradient }
}
