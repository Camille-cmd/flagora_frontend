import {JSX, ReactNode} from "react";
import {DecorativeBubbles} from "../DecorativeBubbles.tsx";

interface CardProps {
    children: ReactNode; // Contient tous les sous-composants (CardHeader, CardBody, CardFooter, etc.)
    className?: string; // Permet d’ajouter des classes personnalisées
    childrenClassName?: string; // Permet d’ajouter des classes personnalisées à l'intérieur de la card
    bgClassName?: string;
    color1?: string; // Couleur personnalisée pour le premier élément
    color2?: string; // Couleur personnalisée pour le deuxième élément
}

export default function Card({
                                 children,
                                 className = "",
                                 childrenClassName = "",
                                 bgClassName = "",
                                 color1,
                                 color2
                             }: CardProps): JSX.Element {
    color1 = color1 || "blue";
    color2 = color2 || "yellow";
    childrenClassName = childrenClassName || "p-8";
    bgClassName = bgClassName || "bg-neutral-50 dark:bg-darkblue-700";

    return (
        <>
            <div
                className={`card relative ${bgClassName} rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}
            >
                {/* Only this wrapper clips the bubbles */}
                <div className="absolute inset-0 pointer-events-none z-0 rounded-xl overflow-hidden">
                    <DecorativeBubbles color1={color1} color2={color2}/>
                </div>
                <div className={`relative ${childrenClassName}`}>
                    {children}
                </div>
            </div>
        </>
    );
}
