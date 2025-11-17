import React from 'react';
import "./style.css";
import Logo from '../../components/common/Logo/Logo';

export default function Loading() {
  return (
    <section className="loading">
      <div className="loading-logo">
        <Logo />
      </div>
    </section>
  );
}
