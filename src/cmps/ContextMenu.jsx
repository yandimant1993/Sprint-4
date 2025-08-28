import { useEffect } from "react";

export function ContextMenu({ isOpen, position, onClose, children }) {
    useEffect(() => {
        function handleKeyDown(ev) {
            if (ev.key === "Escape") onClose();
        }
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50"
            onClick={onClose}
        >
            <div
                className="absolute bg-white border rounded shadow-md z-50"
                style={{ top: position.y, left: position.x, minWidth: "160px" }}
                onClick={(ev) => ev.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
