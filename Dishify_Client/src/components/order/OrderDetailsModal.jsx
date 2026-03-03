import { useGetOrderByIdQuery } from "../../store/api/orderApi"
import { useUpdateOrderDetailMutation } from "../../store/api/orderDetailsApi"
import { getImageUrl } from "../../utility/constants"
import { ORDER_STATUS } from "../../store/api/orderApi"
import { getStatusBadgeClass } from "../../utility/orderHelpers"
import Rating from "../Rating"
import { toast } from "react-toastify"
import { getErrorMessage } from "../../utility/helperFunc"

export default function OrderDetailsModal({ orderId, onClose, onUpdateStatus, isAdmin, currentUserId, onRatingChange }) {
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  })
  const [updateOrderDetail] = useUpdateOrderDetailMutation()

  const orderUserId = order?.applicationUserId
  const orderReadyForRating = order?.status === ORDER_STATUS.READY_FOR_PICKUP || order?.status === ORDER_STATUS.COMPLETED
  const canRate = orderReadyForRating &&
    currentUserId &&
    orderUserId &&
    String(orderUserId) === String(currentUserId) &&
    !isAdmin

  const handleRatingChange = async (orderDetailId, rating) => {
    try {
      await updateOrderDetail({ orderDetailId, rating }).unwrap()
      toast.success("Thanks for your rating!")
      onRatingChange?.()
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to save rating")
    }
  }

  const getNextStatusOptions = () => {
    if (!order?.status) return []
    const status = order.status
    if (status === ORDER_STATUS.CONFIRMED) return [ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.CANCELLED]
    if (status === ORDER_STATUS.READY_FOR_PICKUP) return [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED]
    if (status === ORDER_STATUS.COMPLETED || status === ORDER_STATUS.CANCELLED) return []
    return [ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED]
  }

  const nextOptions = getNextStatusOptions()

  if (!orderId) return null

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order #{orderId}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : !order ? (
                <p className="text-muted">Order not found.</p>
              ) : (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Pickup Name:</strong> {order.pickUpName}</p>
                      <p className="mb-1"><strong>Email:</strong> {order.pickUpEmail}</p>
                      <p className="mb-1"><strong>Phone:</strong> {order.pickUpPhoneNumber}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Total Items:</strong> {order.totalItems}</p>
                      <p className="mb-1"><strong>Order Total:</strong> ${order.orderTotal?.toFixed(2)}</p>
                      <p className="mb-1">
                        <strong>Status:</strong>{" "}
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {canRate && (
                    <div
                      className="mb-4 p-3 rounded-3 d-flex align-items-center gap-3"
                      style={{ background: "linear-gradient(135deg, rgba(224,122,95,0.08), rgba(129,178,154,0.06))", border: "1px solid rgba(224,122,95,0.2)" }}
                    >
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: "rgba(224,122,95,0.15)" }}>
                        <i className="bi bi-star-fill text-primary" />
                      </div>
                      <div>
                        <strong className="d-block">Rate your order</strong>
                        <small className="text-muted">Tap the stars below to rate each item. Your feedback helps us improve!</small>
                      </div>
                    </div>
                  )}

                  <h6 className="mt-4 mb-2">Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th className="text-center">Qty</th>
                          <th className="text-end">Price</th>
                          <th className="text-end">Total</th>
                          {canRate && <th className="text-center">Rating</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderDetails?.map((detail) => (
                          <tr key={detail.orderDetailId}>
                            <td>
                              {detail.menuItem ? (
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={getImageUrl(detail.menuItem.image)}
                                    alt=""
                                    className="rounded"
                                    style={{ width: 44, height: 44, objectFit: "cover" }}
                                    onError={(e) => { e.target.src = "https://placehold.co/50" }}
                                  />
                                  <span className="fw-medium">{detail.itemName}</span>
                                </div>
                              ) : (
                                detail.itemName
                              )}
                            </td>
                            <td className="text-center">{detail.quantity}</td>
                            <td className="text-end">${detail.price?.toFixed(2)}</td>
                            <td className="text-end fw-semibold">${((detail.price || 0) * (detail.quantity || 0)).toFixed(2)}</td>
                            {canRate && (
                              <td className="text-center">
                                {detail.rating ? (
                                  <div className="d-flex align-items-center justify-content-center gap-2">
                                    <Rating value={detail.rating} readonly size="1rem" />
                                    <span className="badge small" style={{ background: "rgba(34,197,94,0.15)", color: "#16a34a" }}>Rated</span>
                                  </div>
                                ) : (
                                  <div className="d-flex flex-column align-items-center gap-1">
                                    <span className="small text-muted">Rate this item</span>
                                    <Rating
                                      value={0}
                                      onRatingChange={(r) => handleRatingChange(detail.orderDetailId, r)}
                                      size="1.1rem"
                                    />
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {isAdmin && nextOptions.length > 0 && (
                    <div className="mt-4 pt-3 border-top">
                      <h6 className="mb-2">Update Status</h6>
                      <div className="d-flex gap-2 flex-wrap">
                        {nextOptions.map((status) => (
                          <button
                            key={status}
                            className={`btn btn-sm ${status === ORDER_STATUS.CANCELLED ? "btn-outline-danger" : "btn-outline-primary"}`}
                            onClick={() => onUpdateStatus(orderId, status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
