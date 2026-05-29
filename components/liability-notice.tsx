import { ShieldAlert } from 'lucide-react'

/**
 * Listing-level due-diligence notice. The outfitter — not the platform — is solely
 * responsible for the legality of the hunt. Emphasized for dangerous-game species,
 * where permits, CITES paperwork, and trophy import rules are more involved.
 */
export function LiabilityNotice({ dangerousGame = false }: { dangerousGame?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 flex gap-3 ${
        dangerousGame ? 'border-wht-blaze/40 bg-wht-blaze/5' : 'border-wht-bone-2 bg-wht-paper'
      }`}
    >
      <ShieldAlert className={`h-5 w-5 flex-shrink-0 mt-0.5 ${dangerousGame ? 'text-wht-blaze' : 'text-wht-stone'}`} />
      <div className="text-xs text-wht-stone leading-relaxed font-body">
        {dangerousGame && (
          <p className="font-semibold text-wht-ink mb-1">Dangerous game — additional regulations apply.</p>
        )}
        <p>
          The outfitter is solely responsible for the legality of this hunt, including all licenses,
          tags, permits, CITES documentation, and trophy import requirements
          {dangerousGame ? ' — which are extensive for dangerous game' : ''}. Worldwide Hunting Trips
          is a listing platform and is not a party to any hunt. Confirm all legal and import details
          directly with the outfitter and the relevant authorities before booking.
        </p>
      </div>
    </div>
  )
}
