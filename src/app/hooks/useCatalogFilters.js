import { useMemo, useState } from 'react';
import { rubros, linea, familia } from '../data/mockData';

const categoryToFamiliaId = {
  Taladros: 'taladros',
  Esmeriles: 'esmeriles',
  Sierras: 'sierras',
  'Paneles LED': 'paneles-led',
  Tomacorrientes: 'tomacorrientes',
};

export function useCatalogFilters(catalogo, searchTerm) {
  const [selectedRubro, setSelectedRubro] = useState('');
  const [selectedLinea, setSelectedLinea] = useState('');
  const [selectedFamilia, setSelectedFamilia] = useState('');

  const withMeta = useMemo(() => {
    return catalogo.map(p => {
      const famId = categoryToFamiliaId[p.categoria] || '';
      const fam = familia.find(f => f.id === famId);
      const lin = fam ? linea.find(l => l.id === fam.lineaId) : null;
      const rub = lin ? rubros.find(r => r.id === lin.rubroId) : null;
      return { ...p, familiaId: fam?.id || '', lineaId: lin?.id || '', rubroId: rub?.id || '' };
    });
  }, [catalogo]);

  const availableLineas = useMemo(
    () => (selectedRubro ? linea.filter(l => l.rubroId === selectedRubro) : []),
    [selectedRubro]
  );
  const availableFamilias = useMemo(
    () => (selectedLinea ? familia.filter(f => f.lineaId === selectedLinea) : []),
    [selectedLinea]
  );

  const filteredProducts = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    let result = withMeta.filter(p =>
      !lower || p.nombre.toLowerCase().includes(lower) || p.sku.toLowerCase().includes(lower)
    );
    if (selectedRubro) result = result.filter(p => p.rubroId === selectedRubro);
    if (selectedLinea) result = result.filter(p => p.lineaId === selectedLinea);
    if (selectedFamilia) result = result.filter(p => p.familiaId === selectedFamilia);
    return result;
  }, [withMeta, searchTerm, selectedRubro, selectedLinea, selectedFamilia]);

  return {
    filteredProducts,
    selectedRubro, setSelectedRubro,
    selectedLinea, setSelectedLinea,
    selectedFamilia, setSelectedFamilia,
    availableLineas, availableFamilias,
  };
}