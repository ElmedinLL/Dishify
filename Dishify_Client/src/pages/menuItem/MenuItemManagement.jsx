import MenuItemTable from "./MenuItemTable"
import { useGetMenuItemQuery, useCreateMenuItemMutation, useUpdateMenuItemMutation, useDeleteMenuItemMutation } from "../../store/api/menuItemApi"
import MenuItemModel from "./MenuItemModel"
import { useState } from "react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { getErrorMessage } from "../../utility/helperFunc"

const CATEGORIES = ["Appetizer", "Entrée", "Dessert"]
const SPECIAL_TAGS = ["", "Best Seller", "Top Rated", "Chef's Special"]

const initialFormData = {
  name: "",
  description: "",
  specialTag: "",
  category: "",
  price: "",
  image: null,
}

export default function MenuItemManagement() {
  const { data: menuItems = [], error, isLoading } = useGetMenuItemQuery()
  const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemMutation()
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation()
  const [deleteMenuItem] = useDeleteMenuItemMutation()

  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState(initialFormData)

  const isSubmitting = isCreating || isUpdating
  const isEditMode = !!editingItem

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData(initialFormData)
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormData(initialFormData)
    setShowModal(true)
  }

  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name || "",
      description: item.description || "",
      specialTag: item.specialTag || "",
      category: item.category || "",
      price: item.price?.toString() || "",
      image: null,
    })
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: e.target.files?.[0] || null }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const buildFormData = () => {
    const formDataToSend = new FormData()
    formDataToSend.append("Name", formData.name)
    formDataToSend.append("Description", formData.description || "")
    formDataToSend.append("Category", formData.category)
    formDataToSend.append("SpecialTag", formData.specialTag || "")
    formDataToSend.append("Price", formData.price)
    if (formData.image) {
      formDataToSend.append("File", formData.image)
    }
    return formDataToSend
  }

  const handleFormSubmit = async (data) => {
    try {
      const formDataToSend = buildFormData()

      if (isEditMode) {
        formDataToSend.append("Id", editingItem.id.toString())
        await updateMenuItem({ id: editingItem.id, formData: formDataToSend }).unwrap()
        toast.success("Menu item updated successfully!")
        handleCloseModal()
      } else {
        await createMenuItem(formDataToSend).unwrap()
        toast.success("Menu item created successfully!")
        handleCloseModal()
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${item.name}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    })

    if (result.isConfirmed) {
      try {
        await deleteMenuItem(item.id).unwrap()
        toast.success("Menu item deleted successfully!")
      } catch (err) {
        toast.error(getErrorMessage(err))
      }
    }
  }

  return (
    <div>
      <div className="container-fluid p-4 mx-3">
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold" style={{ letterSpacing: "-0.02em" }}>Menu Item Management</h2>
                <p className="text-muted mb-0">
                  Manage your restaurant&apos;s menu items
                </p>
              </div>
              <button className="btn btn-primary px-4" style={{ borderRadius: 12 }} onClick={handleOpenCreate}>
                <i className="bi bi-plus-circle me-2"></i>
                Add Menu Item
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <MenuItemTable
                  menuItems={menuItems}
                  error={error}
                  isLoading={isLoading}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>
        {showModal && (
          <MenuItemModel
            mode={isEditMode ? "edit" : "create"}
            editingItem={editingItem}
            categories={CATEGORIES}
            specialTags={SPECIAL_TAGS}
            onChange={handleInputChange}
            formData={formData}
            onSubmit={handleFormSubmit}
            setFormData={setFormData}
            onClose={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}
