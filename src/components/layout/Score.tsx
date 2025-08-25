"use client"

import type React from "react"
import {useEffect, useRef, useState} from "react"
import {Crown, Flame, Sparkles, Star, Trophy, Zap} from "lucide-react"
import {GameModes} from "../../interfaces/gameModes.tsx";

interface ScoreProps {
    score: number,
    gameMode: GameModes,
}

interface ScoreMilestone {
    threshold: number
    color: string
    bgColor: string
    icon: React.ReactNode
    sparkColor: string
}

export default function Score({score, gameMode}: ScoreProps) {
    const isTrainingMode = gameMode.includes("TRAINING")

    const scoreMilestones: ScoreMilestone[] = [
        {
            threshold: 1,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            icon: <Star className="w-5 h-5"/>,
            sparkColor: "text-blue-400",
        },
        {
            threshold: 2,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            icon: <Sparkles className="w-5 h-5"/>,
            sparkColor: "text-green-400",
        },
        {
            threshold: 3,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            icon: <Zap className="w-5 h-5"/>,
            sparkColor: "text-purple-400",
        },
        {
            threshold: 30,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            icon: <Trophy className="w-5 h-5"/>,
            sparkColor: "text-orange-400",
        },
        {
            threshold: 40,
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-900/30",
            icon: <Flame className="w-5 h-5"/>,
            sparkColor: "text-red-400",
        },
        {
            threshold: 50,
            color: "text-pink-600 dark:text-pink-400",
            bgColor: "bg-pink-100 dark:bg-pink-900/30",
            icon: <Crown className="w-5 h-5"/>,
            sparkColor: "text-pink-400",
        },
        {
            threshold: 100,
            color: "text-yellow-600 dark:text-yellow-400",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            icon: <Crown className="w-5 h-5"/>,
            sparkColor: "text-yellow-400",
        },
        {
            threshold: 300,
            color: "text-gradient-to-r from-purple-600 to-pink-600",
            bgColor: "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
            icon: <Crown className="w-6 h-6"/>,
            sparkColor: "text-purple-400",
        },
    ]

    const [currentMilestone, setCurrentMilestone] = useState<ScoreMilestone | null>(null)
    const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])

    // Track previous score internally
    const previousScoreRef = useRef(score)
    const [isFirstRender, setIsFirstRender] = useState(true)

    // Find the current milestone
    const getCurrentMilestone = (currentScore: number) => {
        return [...scoreMilestones].reverse().find((milestone) => currentScore >= milestone.threshold)
    }

    // Check if a new milestone was reached
    useEffect(() => {
        // No score effect on training mode
        if (isTrainingMode) {
            setCurrentMilestone(null)
            return
        }
        
        // Skip celebration on first render to avoid initial animation
        if (isFirstRender) {
            setIsFirstRender(false)
            setCurrentMilestone(null)
            previousScoreRef.current = score
            return
        }

        const newMilestone = getCurrentMilestone(score)
        const previousMilestone = getCurrentMilestone(previousScoreRef.current)

        // Check if we crossed a milestone threshold
        if (newMilestone && newMilestone !== previousMilestone && score > previousScoreRef.current) {
            setCurrentMilestone(newMilestone)
            createSparkles()
        } else {
            setCurrentMilestone(newMilestone ? newMilestone : null)
        }

        // Update previous score reference
        previousScoreRef.current = score
    }, [score, isFirstRender, scoreMilestones])

    const createSparkles = () => {
        const newSparkles = Array.from({length: 5}, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
        }))
        setSparkles(newSparkles)

        // Clear sparkles after animation
        setTimeout(() => {
            setSparkles([])
        }, 1000)
    }

    const milestone = currentMilestone || scoreMilestones[0]

    return (
        <div className="relative border-b-2">
            {/* Sparkles Animation */}
            {sparkles.map((sparkle) => (
                <div
                    key={sparkle.id}
                    className={`absolute pointer-events-none ${milestone.sparkColor} animate-ping`}
                    style={{
                        left: `${sparkle.x}%`,
                        top: `${sparkle.y}%`,
                        animationDelay: `${sparkle.id * 0.2}s`,
                        animationDuration: "2s",
                    }}
                >
                    <Sparkles className="w-3 h-3"/>
                </div>
            ))}

            {/* Score Display */}
            <div className={`relative flex items-center px-2 py-2 rounded-xl transition-all duration-500 ${milestone.bgColor}`}>
                {/* Score */}
                <div className="flex flex-row items-center">
                    {/* Icon */}
                    <div className={`flex items-center justify-center p-1 rounded-full ${milestone.color}`}>
                        {milestone.icon}
                    </div>
                    <div className={`text-xl font-bold transition-all p-1 duration-300 ${milestone.color}`}>
                        {score}
                    </div>
                </div>
            </div>
        </div>
    )
}
