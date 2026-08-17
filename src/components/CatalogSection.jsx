import React, { useState } from 'react';
import { MessageSquare, Shield, CheckCircle, ArrowLeft, Filter, Sparkles } from 'lucide-react';

export default function CatalogSection({ catalog, onAskProduct, onBackHome }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...new Set(catalog.map(item => item.category))];

  const filteredCatalog = selectedCategory === 'Todas' 
    ? catalog 
    : catalog.filter(item => item.category === selectedCategory);

  return (
    <section id="catalogo" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        {onBackHome && (
          <button 
            onClick={onBackHome}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} />
            <span>Volver al Inicio</span>
          </button>
        )}

        {/* Filtro por Categorías */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--brand-crimson)' : 'var(--bg-card)',
                color: 'white',
                border: '1px solid var(--border-color)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="section-head">
        <h2>Catálogo de Equipamiento Homologado</h2>
        <p>
          Equipamiento oficial de primeras marcas para instalaciones de seguridad a medida en Chascomús y la región.
        </p>
      </div>

      <div className="products-grid">
        {filteredCatalog.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="product-brand-badge">{item.brand}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {item.category}
                </span>
              </div>

              <h4>{item.name}</h4>
              <p>{item.description}</p>

              {item.specs && item.specs.length > 0 && (
                <ul className="product-specs">
                  {item.specs.slice(0, 3).map((spec, i) => (
                    <li key={i}>
                      <CheckCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="product-card-footer">
              <span style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: '700' }}>
                Cotización a Medida
              </span>

              <button 
                className="btn-primary" 
                onClick={() => onAskProduct(item.name)}
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem' }}
              >
                <MessageSquare size={14} />
                <span>Consultar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
