import { Routes, Route } from "react-router"
import HomePage from "./views/HomePage"
import DetailPage from "./views/DetailPage"
import LoginPage from "./views/LoginPage"
import RegisterPage from "./views/RegisterPage"
import CartPage from "./views/CartPage"
import CheckoutPage from "./views/CheckoutPage"
import PaymentPage from "./views/PaymentPage"
import MyOrdersPage from "./views/MyOrdersPage"
import AdminProductsPage from "./views/AdminProductsPage"
import AdminProductFormPage from "./views/AdminProductFormPage"
import AdminUploadImagePage from "./views/AdminUploadImagePage"
import AdminOrdersPage from "./views/AdminOrdersPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products/:id" element={<DetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment/:id" element={<PaymentPage />} />
      <Route path="/orders" element={<MyOrdersPage />} />

      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/products/add" element={<AdminProductFormPage />} />
      <Route path="/admin/products/edit/:id" element={<AdminProductFormPage />} />
      <Route path="/admin/products/:id/upload-image" element={<AdminUploadImagePage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
    </Routes>
  )
}