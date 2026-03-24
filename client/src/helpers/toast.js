import Toastify from "toastify-js"
import "toastify-js/src/toastify.css"

export function successToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
  }).showToast()
}

export function errorToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
  }).showToast()
}