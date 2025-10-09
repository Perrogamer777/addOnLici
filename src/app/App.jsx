import React, { useState, useRef, useCallback } from 'react';
import { mockLicitacionInfo, mockProductosSolicitados, mockCatalogoProductos } from './data/mockData';
import { useClient } from './hooks/useClient';
import { useCatalogFilters } from './hooks/useCatalogFilters';
import { useIframeAutoResize } from './hooks/useIframeAutoResize';

import HeaderInfo from './components/HeaderInfo';
import ProductosSolicitados from './components/ProductosSolicitados';
import TablaProductos from './components/TablaProductos';
import ResumenCotizacion from './components/ResumenCotizacion';

function App() {
  const client = useClient();
  const [itemsCotizacion, setItemsCotizacion] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    filteredProducts,
    selectedRubro, setSelectedRubro,
    selectedLinea, setSelectedLinea,
    selectedFamilia, setSelectedFamilia,
    availableLineas, availableFamilias,
  } = useCatalogFilters(mockCatalogoProductos, searchTerm);

  const mainRef = useRef(null);
  useIframeAutoResize(client, mainRef, [itemsCotizacion, filteredProducts, searchTerm]);

  const handleSugerenciaClick = useCallback((descripcion) => {
    const palabrasClave = descripcion.split(' ').slice(0, 2).join(' ');
    setSearchTerm(palabrasClave);
  }, []);

  const handleAgregarProducto = useCallback((producto, cantidad) => {
    setItemsCotizacion(prev => {
      const existing = prev.find(i => i.sku === producto.sku);
      if (existing) return prev.map(i => i.sku === producto.sku ? { ...i, cantidad: i.cantidad + cantidad } : i);
      return [...prev, { ...producto, cantidad }];
    });
  }, []);

  const handleQuitarProducto = useCallback((sku) => {
    setItemsCotizacion(prev => prev.filter(i => i.sku !== sku));
  }, []);

  return (
    <main ref={mainRef} className="bg-gray-100 p-6 grid grid-cols-3 gap-6 font-sans h-full min-h-0">
      <div className="col-span-2 flex flex-col gap-6 min-h-0">
        <HeaderInfo info={mockLicitacionInfo} />
        <div className="grid gap-6 flex-1 min-h-0" style={{ gridTemplateRows: 'minmax(0,1fr) minmax(0,2fr)' }}>
          <ProductosSolicitados items={mockProductosSolicitados} onSugerenciaClick={handleSugerenciaClick} />
          <TablaProductos
            productos={filteredProducts}
            onAgregar={handleAgregarProducto}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRubro={selectedRubro}
            setSelectedRubro={(val) => { setSelectedRubro(val); setSelectedLinea(''); setSelectedFamilia(''); }}
            selectedLinea={selectedLinea}
            setSelectedLinea={(val) => { setSelectedLinea(val); setSelectedFamilia(''); }}
            selectedFamilia={selectedFamilia}
            setSelectedFamilia={setSelectedFamilia}
            availableLineas={availableLineas}
            availableFamilias={availableFamilias}
          />
        </div>
      </div>
      <div className="col-span-1 min-h-0">
        <ResumenCotizacion items={itemsCotizacion} onRemove={handleQuitarProducto} />
      </div>
    </main>
  );
}

export default App;