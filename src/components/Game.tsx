
export default function FlagsGame() {
  return (
    <div className="bg-background flex flex-col">

      {/* Game - Quiz View (Flags) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">

          <div className="bg-card text-card-foreground border border-border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-foreground mb-4">Quel est ce pays?</h2>

            <div className="flex justify-center mb-6">
              <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden">
                <img
                  src="https://via.placeholder.com/300x200?text=Flag"
                  alt="Drapeau"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <form className="space-y-4 flex flex-row">
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full p-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Entrez le nom du pays"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
              >
                Valider
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
