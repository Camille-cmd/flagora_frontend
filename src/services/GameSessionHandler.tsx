import {GameTokenManager} from './GameTokenManager';

/**
 * Handles game session lifecycle events, including token clearing
 * when users navigate away from the game or close tabs.
 */
export class GameSessionHandler {
    private static instance: GameSessionHandler;
    private tokenManager: GameTokenManager;
    private isSetup = false;

    private constructor() {
        this.tokenManager = GameTokenManager.getInstance();
    }

    public static getInstance(): GameSessionHandler {
        if (!GameSessionHandler.instance) {
            GameSessionHandler.instance = new GameSessionHandler();
        }
        return GameSessionHandler.instance;
    }

    /**
     * Sets up event listeners for token clearing.
     * Should be called once when the game component mounts.
     */
    public setupTokenClearing(): void {
        if (this.isSetup) return;

        // Clear token on tab close/browser close
        window.addEventListener('beforeunload', this.handleTokenClear);

        // Backup handler for mobile Safari and other edge cases
        window.addEventListener('pagehide', this.handleTokenClear);

        this.isSetup = true;
    }

    /**
     * Cleans up event listeners.
     * Should be called when the game component unmounts.
     */
    public cleanup(): void {
        window.removeEventListener('beforeunload', this.handleTokenClear);
        window.removeEventListener('pagehide', this.handleTokenClear);
        this.isSetup = false;

        this.handleTokenClear();
    }

    /**
     * Handles token clearing when user exits the game.
     */
    private handleTokenClear = (): void => {
        this.tokenManager.clearToken();
    };
}
