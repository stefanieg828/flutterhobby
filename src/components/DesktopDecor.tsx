/** Painted desktop room — empty room-bg + haze (CSS shelves hidden in painted mode). */
export function DesktopDecor() {
  const art = `${import.meta.env.BASE_URL}art/desktop`
  return (
    <div className="dk-decor dk-decor--painted" aria-hidden="true">
      <img className="dk-decor__room-bg" src={`${art}/room-bg.png`} alt="" />
      <div className="dk-decor__haze" />
    </div>
  )
}
