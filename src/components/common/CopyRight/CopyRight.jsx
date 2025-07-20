import React from 'react';
import "./style.css"
export default function CopyRight() {
      const currentYear = new Date().getFullYear();

      return (
            <section className="copyright">
                  <p>© {currentYear} شافي. جميع الحقوق محفوظة.</p>
            </section>
      );
}