/** Painted closet room — empty room-bg + haze (CSS shelves hidden in painted mode). */
export function ClosetDecor() {
  const art = `${import.meta.env.BASE_URL}art/closet`
  return (
    <div className="cl-decor cl-decor--painted" aria-hidden="true">
      <img className="cl-decor__room-bg" src={`${art}/room-bg.png`} alt="" />
      <div className="cl-decor__haze" />
    </div>
  )
}
