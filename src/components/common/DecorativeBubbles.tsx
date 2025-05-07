import {JSX} from "react";

interface DecorativeBubblesProps {
  color1?: string
  color2?: string
}

/*
    * DecorativeBubbles component
    * This component is used to create decorative bubbles in the background of a card.
    * ⚠️ The parent component should have a relative position for this to work.
    *
    * @param {string} color1 - The first color for the bubble.
    * @param {string} color2 - The second color for the bubble.
 */
export function DecorativeBubbles({ color1 = "blue", color2 = "yellow" }: DecorativeBubblesProps): JSX.Element {
  // Map color names to Tailwind classes
  const colorMap: Record<string, { light: string; dark: string }> = {
    blue: { light: "bg-blue-200", dark: "dark:bg-blue-700/70" },
    green: { light: "bg-green-200", dark: "dark:bg-green-700/70" },
    yellow: { light: "bg-yellow-200", dark: "dark:bg-yellow-300/70" },
    red: { light: "bg-red-200", dark: "dark:bg-red-700/70" },
    purple: { light: "bg-purple-200", dark: "dark:bg-purple-700/70" },
    pink: { light: "bg-pink-200", dark: "dark:bg-pink-700/70" },
    raspberry: { light: "bg-raspberry-200", dark: "dark:bg-raspberry-700/70" },
  }

  const color1Classes = colorMap[color1] || colorMap.blue
  const color2Classes = colorMap[color2] || colorMap.yellow

  return (
    <>
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${color1Classes.light} ${color1Classes.dark} rounded-full -mr-16 -mt-16 opacity-70`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-24 h-24 ${color2Classes.light} ${color2Classes.dark} rounded-full -ml-12 -mb-12 opacity-70`}
      ></div>
    </>
  )
}
