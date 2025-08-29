import { useEffect } from "react";

export function ContextMenu({ isOpen, position, onClose, items }) {
    useEffect(() => {
        function handleClickOutside() {
            if (isOpen) onClose()
        }
        if (isOpen) {
            setTimeout(() => {
                window.addEventListener("click", handleClickOutside);
            }, 0)
        }
        return () => window.removeEventListener("click", handleClickOutside)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <ul
            className="context-menu flex"
            style={{ top: position.y, left: position.x }}
            onClick={(ev) => {
                ev.stopPropagation()
            }}
        >
            {items.map((item, idx) => (
                <li
                    key={idx}
                    className={`context-menu-option ${item.label} flex`}
                    onClick={() => {
                        item.onClick()
                        onClose()
                    }}
                >
                    {item.label}
                </li>
            ))}
        </ul>
    )
}
