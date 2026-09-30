import { useMemo } from "react"

interface CompanyLogoProps {
    name?: string
    size?: 'sm' | 'md' | 'lg'
}

const CompanyLogo = ({ name, size = 'md' }: CompanyLogoProps) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-11 h-11 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-25 h-25 text-3xl',
    }

    const colors = [
        "#3a5a8a",
        "#2a6e3f",
        "#7a3a6e",
        "#b05a20",
        "#6a3a2a",
        "#3a6a9a",
        "#8a2a5a",
        "#5a7a2a",
        "#3a3a7a",
        "#4a2a7a",
        "#7a5a2a",
        "#7a4a3a"

    ]

    const randomColor = useMemo(() => {
        return colors[Math.floor(Math.random() * colors.length)]
    }, [])

    return (
        <>
            {name ?
                <div style={{ backgroundColor: randomColor }} className={`rounded-lg flex items-center justify-center font-bold text-primary-foreground shrink-0 self-start uppercase ${sizeClasses[size]}`}>
                    {name.slice(0, 2)}
                </div>
                : <></>}
        </>
    )
}

export default CompanyLogo