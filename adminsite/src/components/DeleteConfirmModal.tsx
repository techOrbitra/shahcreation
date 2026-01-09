"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-full">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🗑️</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">{message}</p>
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <span>⚠️</span>
                <span>This action cannot be undone.</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              style={{
                backgroundColor: "white",
                color: "#374151",
                border: "1px solid #D1D5DB",
              }}
              className="px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              style={{
                backgroundColor: "#DC2626",
                color: "white",
                opacity: isDeleting ? 0.7 : 1,
              }}
              className="px-6 py-2.5 rounded-lg hover:opacity-90 transition-all disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm"
            >
              {isDeleting ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full animate-spin"
                    style={{
                      border: "2px solid white",
                      borderTopColor: "transparent",
                    }}
                  />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
