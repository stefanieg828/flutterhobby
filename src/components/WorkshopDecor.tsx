/** Painted workshop room — empty room-bg + haze (CSS shelves hidden in painted mode). */
export function WorkshopDecor() {
  const art = `${import.meta.env.BASE_URL}art/workshop`
  return (
    <div className="ws-decor ws-decor--painted" aria-hidden="true">
      <img className="ws-decor__room-bg" src={`${art}/room-bg.png`} alt="" />
      <div className="ws-decor__haze" />
    </div>
  )
}
