import { getImageUrl } from "../../utility/constants"
import { toast } from "react-toastify"

export default function MenuItemModel({
  mode = "create",
  editingItem,
  categories = [],
  specialTags = [],
  onClose,
  isSubmitting,
  formData,
  onSubmit,
  onChange,
}) {
  const isEditMode = mode === "edit"

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      toast.error("Name is required")
      return
    }
    if (!formData.category?.trim()) {
      toast.error("Category is required")
      return
    }
    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0 || price >= 1000) {
      toast.error("Price must be between 0.01 and 1000")
      return
    }
    if (!isEditMode && !formData.image) {
      toast.error("Image is required")
      return
    }

    onSubmit(formData)
  }

  return (
    <div>
      <>
        <div className="modal-backdrop fade show" />

        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className={`modal-dialog modal-lg`} role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Menu Item" : "Add New Menu Item"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onClose}
                />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name || ""}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Category *</label>
                        <select
                          className="form-select"
                          name="category"
                          value={formData.category || ""}
                          onChange={onChange}
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat || "(None)"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description || ""}
                      onChange={onChange}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Price * ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          step="0.01"
                          min="0.01"
                          max="999.99"
                          value={formData.price || ""}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Special Tag</label>
                        <select
                          className="form-select"
                          name="specialTag"
                          value={formData.specialTag || ""}
                          onChange={onChange}
                        >
                          {specialTags.map((tag) => (
                            <option key={tag} value={tag}>
                              {tag || "(None)"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Image {!isEditMode && "*"}
                    </label>
                    {isEditMode && editingItem?.image && (
                      <div className="mb-2">
                        <span className="text-muted small">Current image: </span>
                        <img
                          src={getImageUrl(editingItem.image)}
                          alt="Current"
                          className="rounded ms-2"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/100"
                          }}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={onChange}
                    />
                    <div className="form-text">
                      {isEditMode
                        ? "Leave empty to keep current image"
                        : "Upload an image for the menu item"}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm me-2" />
                      ) : (
                        <span>
                          {isEditMode ? "Update Menu Item" : "Create Menu Item"}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  )
}
