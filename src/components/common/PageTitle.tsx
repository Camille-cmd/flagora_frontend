interface PageTitleProps {
    title: string
}

export function PageTitle({title}: PageTitleProps) {
    return (
        <h1 className="text-4xl mb-8 font-rubik font-bold text-secondary dark:text-primary relative">
            {title}
            {/* Decorative underline */}
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded-full"></span>
        </h1>
    )
}
