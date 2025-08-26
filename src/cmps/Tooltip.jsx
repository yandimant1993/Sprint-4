export function Tooltip({ children, text }) {
    return (
        <div className="tooltip-wrapper">
            {children}
            <div className="tooltip-text">{text}</div>
        </div>
    )
}