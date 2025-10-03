/**
 * Manages game tokens for session tracking across different game modes.
 * Uses sessionStorage for tab-specific tokens that persist through screen locks
 * but clear on tab close or navigation away from the game.
 */
export class GameTokenManager {
    private static instance: GameTokenManager;
    private gameToken: string | null = null;
    private gameMode: string | null = null;

    private constructor() {
    }

    public static getInstance(): GameTokenManager {
        if (!GameTokenManager.instance) {
            GameTokenManager.instance = new GameTokenManager();
        }
        return GameTokenManager.instance;
    }

    /**
     * Generates a new game token for the specified game mode.
     * Each tab gets a unique token, allowing multiple concurrent game sessions.
     */
    public startNewGame(gameMode: string): string {
        // Generate a unique token for this tab
        this.gameToken = crypto.randomUUID();
        this.gameMode = gameMode;

        // Store in sessionStorage (tab-specific, not shared across tabs)
        sessionStorage.setItem('gameToken', this.gameToken);
        sessionStorage.setItem('gameMode', gameMode);
        sessionStorage.setItem('gameTokenTimestamp', Date.now().toString());

        return this.gameToken;
    }

    /**
     * Gets the current token for this tab.
     */
    public getCurrentToken(): string | null {
        if (!this.gameToken) {
            this.gameToken = sessionStorage.getItem('gameToken');
        }

        return this.gameToken;
    }

    /**
     * Gets the current game mode.
     * Unused for now, but may be useful for future features.
     */
    public getCurrentGameMode(): string | null {
        if (!this.gameMode) {
            this.gameMode = sessionStorage.getItem('gameMode');
        }
        return this.gameMode;
    }

    /**
     * Clears the current game token and mode.
     * Called when the user navigates away from the game or closes a tab.
     */
    public clearToken(): void {
        this.gameToken = null;
        this.gameMode = null;
        sessionStorage.removeItem('gameToken');
        sessionStorage.removeItem('gameMode');
        sessionStorage.removeItem('gameTokenTimestamp');
    }

}
