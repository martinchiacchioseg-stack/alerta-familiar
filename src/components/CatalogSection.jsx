import React, { useState } from 'react';
import { Search, Check, MessageSquare, ArrowRight } from 'lucide-react';

export default function CatalogSection({ catalog, onAskProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(catalog.map((item) => item.category))];

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <section className="catalog-section">
      <div className="catalog-header-bar">
        <div>
          <h3 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-serif)' }}>
            Soluciones & Equipamiento Homologado
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Base de soluciones de Alarmas Chascomús y catálogo indexado de fábrica
          </p>
        </div>

        <div className="search-input-wrapper">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Buscar por marca, modelo o solución..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categorías Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'var(--brand-crimson)' : 'var(--bg-card)',
              color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              padding: '0.45rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat === 'All' ? 'Todas las Soluciones' : cat}
          </button>
        ))}
      </div>

      {/* Grid de Productos e Instalaciones */}
      <div className="products-grid">
        {filteredCatalog.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="product-brand-tag">{product.brand}</span>
                <span style={{ fontSize: '0.72rem', background: 'var(--brand-crimson-light)', color: '#f87171', padding: '0.15rem 0.6rem', borderRadius: '9999px', fontWeight: '600' }}>
                  {product.category}
                </span>
              </div>

              <h4 className="product-title">{product.name}</h4>
              <p className="product-desc">{product.description}</p>

              {product.specs && (
                <ul className="product-specs">
                  {product.specs.slice(0, 4).map((spec, i) => (
                    <li key={i}>
                      <Check size={13} color="var(--brand-crimson)" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="product-card-footer">
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Presupuesto a medida
                </span>
              </div>

              <button
                onClick={() => onAskProduct(product.name)}
                style={{
                  background: 'var(--brand-crimson)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <MessageSquare size={14} />
                <span>Consultar IA</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
