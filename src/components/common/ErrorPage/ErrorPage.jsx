import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
      const error = useRouteError();
      console.error(error);

      return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                  <h1 className="text-4xl font-bold mb-4 text-red-600">حدث خطأ!</h1>
                  <p className="text-lg mb-2">
                        {error.status === 404
                              ? "الصفحة غير موجودة."
                              : "عذرًا، حدث خطأ غير متوقع."}
                  </p>
                  <p className="text-gray-500 mb-6">
                        {error.statusText || error.message}
                  </p>
                  <a href="/" className="text-blue-500 hover:underline">
                        العودة إلى الصفحة الرئيسية
                  </a>
            </div>
      );
}
