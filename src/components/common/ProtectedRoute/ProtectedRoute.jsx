import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
            // لو مفيش مستخدم، يروح للّوجين
            return <Navigate to="/login" replace />;
      }

      // لو موجود المستخدم، يعرض الصفحة المطلوبة
      return children;
}
