import {JSX, ReactNode} from "react";
import {DecorativeBubbles} from "../DecorativeBubbles.tsx";

interface CardProps {
    children: ReactNode; // Contient tous les sous-composants (CardHeader, CardBody, CardFooter, etc.)
    className?: string; // Permet d’ajouter des classes personnalisées
    color1?: string; // Couleur personnalisée pour le premier élément
    color2?: string; // Couleur personnalisée pour le deuxième élément
}

export default function Card({children, className = "", color1, color2}: CardProps): JSX.Element {
    color1 = color1 || "blue";
    color2 = color2 || "yellow";

    return (
        <>
            <div
                className={`relative overflow-hidden bg-neutral-50 dark:bg-darkblue-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}
            >
                <DecorativeBubbles color1={color1} color2={color2}/>
                <div className="relative p-8">
                    {children}
                </div>
            </div>
        </>
    );
}
