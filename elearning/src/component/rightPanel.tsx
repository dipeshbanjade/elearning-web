import type { RightPanelProps } from "../propsInterface/Interface";

export default function RightPanel({
  isOpen,
  onClose,
  title,
  width = 600,
  children,
}: RightPanelProps) {
  return (
    <>
      <div
        className={`right-panel-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div
        className={`right-panel-drawer ${isOpen ? "open" : ""}`}
        style={{ width }}
      >
        <div className="right-panel-head">
          {title && <h2 className="right-panel-title">{title}</h2>}
          <button
            type="button"
            className="right-panel-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="right-panel-body">{children}</div>
      </div>
    </>
  );
}
