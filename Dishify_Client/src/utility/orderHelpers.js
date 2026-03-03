import { ORDER_STATUS } from "../store/api/orderApi"

export function getStatusBadgeClass(status) {
  if (!status) return "bg-secondary"
  const s = status.toLowerCase()
  if (s.includes("cancelled")) return "bg-danger"
  if (s.includes("completed")) return "bg-success"
  if (s.includes("ready") || s.includes("pickup")) return "bg-info text-dark"
  if (s.includes("confirmed")) return "bg-warning text-dark"
  return "bg-secondary"
}
