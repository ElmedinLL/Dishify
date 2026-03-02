import { useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { useGetOrdersQuery, useUpdateOrderMutation, ORDER_STATUS } from "../../store/api/orderApi"
import { selectUser } from "../../store/slices/authSlice"
import { getStoredUser } from "../../utility/jwtHelper"
import OrderDetailsModal from "../../components/order/OrderDetailsModal"
import { getStatusBadgeClass } from "../../utility/orderHelpers"
import { toast } from "react-toastify"
import { getErrorMessage } from "../../utility/helperFunc"

const STATUS_OPTIONS = [
  { value: "All", label: "All Orders" },
  { value: ORDER_STATUS.CONFIRMED, label: ORDER_STATUS.CONFIRMED },
  { value: ORDER_STATUS.READY_FOR_PICKUP, label: ORDER_STATUS.READY_FOR_PICKUP },
  { value: ORDER_STATUS.COMPLETED, label: ORDER_STATUS.COMPLETED },
  { value: ORDER_STATUS.CANCELLED, label: ORDER_STATUS.CANCELLED },
]

function formatOrderDate(dateStr) {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function OrderManagement() {
  const user = useSelector(selectUser) || getStoredUser()
  const isAdmin = user?.role?.toLowerCase() === "admin"
  const userId = isAdmin ? "" : user?.id || ""

  const { data: orders = [], error, isLoading } = useGetOrdersQuery(userId)
  const [updateOrder] = useUpdateOrderMutation()

  const [statusFilter, setStatusFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const filteredOrders = useMemo(() => {
    let list = orders
    if (statusFilter !== "All") {
      list = list.filter((o) => o.status?.toLowerCase() === statusFilter.toLowerCase())
    }
    if (searchTerm?.trim()) {
      const term = searchTerm.toLowerCase()
      list = list.filter(
        (o) =>
          o.pickUpName?.toLowerCase().includes(term) ||
          o.pickUpEmail?.toLowerCase().includes(term) ||
          o.pickUpPhoneNumber?.includes(term)
      )
    }
    return list
  }, [orders, statusFilter, searchTerm])

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrder({
        orderId,
        data: { orderHeaderId: orderId, status: newStatus },
      }).unwrap()
      toast.success("Order status updated!")
      setSelectedOrderId(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="rounded-3 p-3" style={{ background: "rgba(224,122,95,0.1)" }}>
            <i className="bi bi-receipt-cutoff text-primary" style={{ fontSize: "1.75rem" }} />
          </div>
          <div>
            <div className="placeholder-glow">
              <span className="placeholder col-4" style={{ height: 28 }} />
            </div>
            <div className="placeholder-glow">
              <span className="placeholder col-6" style={{ height: 18, marginTop: 4 }} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body py-5">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <div className="spinner-border text-primary" role="status" style={{ width: "2rem", height: "2rem" }} />
              <span className="text-muted">Loading orders...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center gap-3" style={{ borderRadius: 12 }}>
          <i className="bi bi-exclamation-triangle-fill fs-4" />
          <div>
            <h5 className="alert-heading mb-1">Error Loading Orders</h5>
            <p className="mb-0">Unable to load orders. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalAmount = filteredOrders.reduce((sum, o) => sum + (o.orderTotal || 0), 0)

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: 48, height: 48, background: "linear-gradient(135deg, rgba(224,122,95,0.15), rgba(129,178,154,0.1))" }}
          >
            <i className="bi bi-receipt-cutoff text-primary" style={{ fontSize: "1.5rem" }} />
          </div>
          <div>
            <h2 className="mb-0 fw-bold" style={{ letterSpacing: "-0.02em", fontSize: "1.5rem" }}>
              {isAdmin ? "Order Management" : "My Orders"}
            </h2>
            <p className="text-muted mb-0 small">
              {isAdmin ? "Manage your restaurant's orders" : "View and track your orders"}
            </p>
          </div>
        </div>
        {filteredOrders.length > 0 && (
          <div className="d-flex gap-3">
            <div className="px-3 py-2 rounded-3" style={{ background: "rgba(0,0,0,0.04)" }}>
              <span className="text-muted small d-block">Orders</span>
              <span className="fw-bold">{filteredOrders.length}</span>
            </div>
            <div className="px-3 py-2 rounded-3" style={{ background: "rgba(224,122,95,0.08)" }}>
              <span className="text-muted small d-block">Total</span>
              <span className="fw-bold text-primary">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-4" style={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="card-body py-3">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-6 col-lg-5">
              <label className="form-label small text-uppercase fw-semibold text-muted mb-1">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0" style={{ borderRadius: "10px 0 0 10px" }}>
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: "0 10px 10px 0", paddingLeft: 0 }}
                />
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3">
              <label className="form-label small text-uppercase fw-semibold text-muted mb-1">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ borderRadius: 10 }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {!filteredOrders.length ? (
        <div className="card" style={{ borderRadius: 16, border: "1px dashed rgba(0,0,0,0.12)" }}>
          <div className="card-body text-center py-5 px-4">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 80, height: 80, background: "rgba(0,0,0,0.04)" }}
            >
              <i className="bi bi-inbox text-muted" style={{ fontSize: "2.5rem" }} />
            </div>
            <h4 className="fw-semibold mb-2">No orders found</h4>
            <p className="text-muted mb-0" style={{ maxWidth: 360, margin: "0 auto" }}>
              {statusFilter !== "All" || searchTerm
                ? "Try adjusting your search or filter to see more results."
                : "Your orders will appear here once you place an order."}
            </p>
          </div>
        </div>
      ) : (
        <div className="card orders-table" style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th className="text-center">Items</th>
                  <th className="text-end">Total</th>
                  <th>Status</th>
                  <th style={{ width: 56 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderHeaderId}>
                    <td>
                      <span className="order-id">#{order.orderHeaderId}</span>
                    </td>
                    <td>
                      <span className="text-body">{formatOrderDate(order.orderDate)}</span>
                    </td>
                    <td>
                      <div className="fw-medium">{order.pickUpName}</div>
                      <div className="small text-muted" style={{ fontSize: "0.8125rem" }}>
                        {order.pickUpEmail}
                      </div>
                      <div className="small text-muted" style={{ fontSize: "0.8125rem" }}>
                        {order.pickUpPhoneNumber}
                      </div>
                    </td>
                    <td className="order-items">{order.totalItems}</td>
                    <td className="order-total">${order.orderTotal?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-link order-action-btn text-body"
                        onClick={() => setSelectedOrderId(order.orderHeaderId)}
                        title="View order details"
                        aria-label="View order details"
                      >
                        <i className="bi bi-eye" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="orders-table-footer">
            Showing <strong>1</strong> to <strong>{filteredOrders.length}</strong> of <strong>{filteredOrders.length}</strong> orders
          </div>
        </div>
      )}

      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onUpdateStatus={handleUpdateStatus}
          isAdmin={isAdmin}
          currentUserId={user?.id}
        />
      )}
    </div>
  )
}
