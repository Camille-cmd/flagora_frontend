import {JSX, ReactNode} from "react";

interface CardHeaderProps {
    title: string; // Contenu de l'en-tête
    className?: string; // Classes CSS supplémentaires pour personnalisation
    icon?: ReactNode; // Icône personnalisée
}

export function CardHeader({title, className = "", icon}: CardHeaderProps): JSX.Element {
    return (
        <div className={`flex items-center ${className}`}>
            {icon ? icon : null}
            <h2 className="text-xl font-bold text-secondary dark:text-primary">
                {title}
            </h2>
        </div>

    );
}
