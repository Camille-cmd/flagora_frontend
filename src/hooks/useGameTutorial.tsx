"use client"

import {useState, useEffect} from "react"
import {GameModes} from "../interfaces/gameModes.tsx";
import {TooltipPreferences, User} from "../interfaces/apiResponse.tsx";


/*
 * Custom hook to check if the user should see the game tutorial tooltip.
 *
 * @param {User | null} user - The user object from the authentication context.
 * @param {boolean} loadingUser - Whether the user is currently loading.
 * @param {GameModes} gameMode - The game mode for which the tutorial should be shown.
 * @returns {Object} An object containing the following properties:
 *   - shouldShowTutorial: A boolean indicating whether the tutorial should be shown.
 *   - isLoading: A boolean indicating whether the tutorial status is currently being checked.
 *   - markTutorialAsShown: A function to mark the tutorial as shown.
 */
export function useGameTutorial(user: User | null, loadingUser: boolean, gameMode: GameModes) {
    const [shouldShowTutorial, setShouldShowTutorial] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        if (loadingUser) return; // don't check until /me call is done
        checkTutorialStatus(user)
    }, [user, loadingUser])

    const checkTutorialStatus = async (user: User | null) => {
        try {

            // Check localStorage first
            const localTutorialShown = localStorage.getItem(`flagora_tutorial_shown_${gameMode}`)

            if (localTutorialShown === "true") {
                setShouldShowTutorial(false)
                setIsLoading(false)
                return
            }

            try {
                const preference: TooltipPreferences | undefined = user?.tooltipPreferences.find((preference) => preference.gameMode === gameMode)
                if (preference?.showTips === false) {
                    // Sync with localStorage
                    localStorage.setItem(`flagora_tutorial_shown_${gameMode}`, "true")
                    setShouldShowTutorial(false)
                } else {
                    setShouldShowTutorial(true)
                }
            } catch (error) {
                // If backend fails, default to showing tutorial for new users
                setShouldShowTutorial(true)
            }
        } catch (error) {
            console.error("Error checking tutorial status:", error)
            setShouldShowTutorial(true)
        } finally {
            setIsLoading(false)
        }
    }

    const markTutorialAsShown = () => {
        setShouldShowTutorial(false)
    }

    return {
        shouldShowTutorial,
        isLoading,
        markTutorialAsShown,
    }
}
