import Modal from '../common/Modal.jsx'

// Confirmation dialog for destructive actions (e.g. delete post).
function ConfirmDialog({ isOpen, title = 'Are you sure?', message, onConfirm, onCancel }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="mb-4 text-sm text-gray-600">{message}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="rounded border px-3 py-1 text-sm">
          Cancel
        </button>
        <button onClick={onConfirm} className="rounded bg-red-600 px-3 py-1 text-sm text-white">
          Confirm
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
