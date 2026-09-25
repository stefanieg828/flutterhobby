/** Painted basement room — empty room-bg + haze (CSS shelves hidden in painted mode). */
export function BasementDecor() {
  const art = `${import.meta.env.BASE_URL}art/basement`
  return (
    <div className="bm-decor bm-decor--painted" aria-hidden="true">
      <img className="bm-decor__room-bg" src={`${art}/room-bg.png`} alt="" />
      <div className="bm-decor__haze" />
    </div>
  )
}
