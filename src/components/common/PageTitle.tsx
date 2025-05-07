interface PageTitleProps {
    title: string
}

export function PageTitle({title}: PageTitleProps) {
    return (
        <h1 className="text-4xl mb-8 font-rubik font-bold text-secondary dark:text-primary relative underline decoration-4 decoration-yellow-400">
            {title}
        </h1>
    )
}
