// src/components/ui/ConfirmModal.jsx
import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function ConfirmModal({
  open,
  title,
  desc,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
  icon,
  showCloseButton = true,
  size = "sm", // sm, md, lg
  confirmVariant = "primary",
}) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27 && !loading) {
        onCancel?.();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg"
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-800 hover:from-amber-600 hover:to-amber-900 focus:ring-amber-200",
    danger: "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 focus:ring-rose-200",
    success: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 focus:ring-emerald-200"
  };

  const getDefaultIcon = () => {
    if (icon) return icon;
    if (danger) {
      return (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mb-4">
          <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          if (!loading) onCancel?.();
        }}
      />
      
      {/* Modal Card */}
      <div 
        className={`relative z-[101] w-full ${sizeClasses[size]} transform transition-all duration-300 scale-100 opacity-100`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4">
            {showCloseButton && (
              <button
                type="button"
                disabled={loading}
                onClick={onCancel}
                className="absolute top-4 right-4 inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            
            {/* Icon */}
            {getDefaultIcon()}
            
            {/* Title & Description */}
            <div className="text-center">
              <h3 
                id="modal-title"
                className="text-lg font-bold text-gray-900 mb-2"
              >
                {title}
              </h3>
              
              {desc && (
                <p 
                  id="modal-description"
                  className="text-gray-600 leading-relaxed"
                >
                  {desc}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={onCancel}
                className="inline-flex items-center justify-center px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 transition-all duration-200 flex-1"
              >
                {cancelLabel || "إلغاء"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={onConfirm}
                className={`inline-flex items-center justify-center px-4 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 transition-all duration-200 transform hover:-translate-y-0.5 flex-1 ${variantClasses[confirmVariant]}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري المعالجة...
                  </>
                ) : (
                  confirmLabel || "تأكيد"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Usage examples:
/*
// Basic confirmation
<ConfirmModal
  open={deleteModalOpen}
  title="حذف العرض"
  desc="هل أنت متأكد من رغبتك في حذف هذا العرض؟ لا يمكن التراجع عن هذا الإجراء."
  confirmLabel="حذف"
  cancelLabel="إلغاء"
  onConfirm={handleDelete}
  onCancel={handleCancel}
  danger={true}
/>

// Success confirmation
<ConfirmModal
  open={successModalOpen}
  title="تم بنجاح!"
  desc="تم إنشاء العرض بنجاح وسيظهر للعملاء فوراً."
  confirmLabel="حسناً"
  cancelLabel={null}
  onConfirm={handleClose}
  confirmVariant="success"
  showCloseButton={false}
/>

// Custom icon
<ConfirmModal
  open={customModalOpen}
  title="عرض خاص"
  desc="هذا العرض متاح لمدة محدودة فقط."
  icon={
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mb-4">
      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    </div>
  }
  confirmLabel="موافق"
  onConfirm={handleConfirm}
  size="md"
/>
*/
