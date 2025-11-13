import React, { useState, useEffect, useMemo } from 'react';
import { useStockSucursalData } from '../hooks/useStockSucursalData';

const Modal = ({ children, isOpen, onClose, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg', 
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(2px)'
            }}
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default function ModalGestionarCantidades({ 
    isOpen, 
    onClose, 
    producto,
    onUpdateCantidades,
    onOpenStockModal,
    itemsCotizacion = []
}) {
    const [cantidades, setCantidades] = useState({});
    const [totalCantidad, setTotalCantidad] = useState(0);

    // Obtener stock por sucursales
    const { stockSucursales, loading, error } = useStockSucursalData(producto?.sku);

    // Calcular cuánto stock ya fue agregado de este producto por sucursal
    const stockYaAgregado = useMemo(() => {
        if (!producto?.sku) return {};
        
        const stockPorSucursal = {};
        
        itemsCotizacion.forEach(item => {
            if (item.sku === producto.sku && item.detallesSucursales) {
                item.detallesSucursales.forEach(detalle => {
                    if (!stockPorSucursal[detalle.nombreSucursal]) {
                        stockPorSucursal[detalle.nombreSucursal] = 0;
                    }
                    stockPorSucursal[detalle.nombreSucursal] += detalle.cantidad;
                });
            }
        });
        
        return stockPorSucursal;
    }, [producto?.sku, itemsCotizacion]);

    useEffect(() => {
        if (isOpen && producto) {
            // Inicializar cantidades basándose en los detalles de sucursales existentes
            const cantidadesIniciales = {};
            let total = 0;

            if (producto.detallesSucursales && producto.detallesSucursales.length > 0) {
                producto.detallesSucursales.forEach(detalle => {
                    cantidadesIniciales[detalle.nombreSucursal] = detalle.cantidad;
                    total += detalle.cantidad;
                });
            }

            setCantidades(cantidadesIniciales);
            setTotalCantidad(total);
        }
    }, [isOpen, producto]);

    const handleCantidadChange = (sucursal, nuevaCantidad, stockDisponible) => {
        // Limitar la cantidad al stock disponible
        const cantidad = Math.max(0, Math.min(parseInt(nuevaCantidad) || 0, stockDisponible));
        const nuevasCantidades = {
            ...cantidades,
            [sucursal]: cantidad
        };
        setCantidades(nuevasCantidades);
        
        // Calcular total
        const nuevoTotal = Object.values(nuevasCantidades).reduce((sum, cant) => sum + cant, 0);
        setTotalCantidad(nuevoTotal);
    };

    const handleAgregarSucursal = () => {
        if (onOpenStockModal && producto) {
            // Limpiar el nombre del producto si tiene sucursal
            const nombreLimpio = producto.nombre.replace(/\s*\(Suc\.\s+[^)]+\)\s*$/, '');
            onOpenStockModal({
                id: producto.sku,
                nombreCobol: nombreLimpio,
                marca: producto.marca,
                categoria: producto.categoria,
                precioUnitario: producto.precioTienda || producto.precioUnitario
            });
        }
    };

    const handleEliminarSucursal = (sucursal) => {
        const nuevasCantidades = { ...cantidades };
        delete nuevasCantidades[sucursal];
        setCantidades(nuevasCantidades);
        
        const nuevoTotal = Object.values(nuevasCantidades).reduce((sum, cant) => sum + cant, 0);
        setTotalCantidad(nuevoTotal);
    };

    const handleGuardar = () => {
        if (onUpdateCantidades && producto) {
            // Convertir las cantidades en formato de detalles de sucursales
            const detallesSucursales = Object.entries(cantidades)
                .filter(([_, cantidad]) => cantidad > 0)
                .map(([sucursal, cantidad]) => ({
                    nombreSucursal: sucursal,
                    cantidad: cantidad
                }));

            onUpdateCantidades(producto.id, totalCantidad, detallesSucursales);
        }
        onClose();
    };

    if (!producto) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Gestionar Cantidades
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {producto.nombre} (SKU: {producto.sku})
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-4">
                        {/* Resumen del producto */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Precio unitario:</span>
                                    <span className="ml-2">${(producto.precioTienda || producto.precioUnitario || 0).toLocaleString('es-CL')}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Total cantidad:</span>
                                    <span className="ml-2 font-bold">{totalCantidad}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de stock por sucursales */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-medium text-gray-900">Stock disponible por tienda</h3>
                            </div>

                            {/* Tabla de stock */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 max-h-80 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium text-gray-900">Sucursal</th>
                                            <th className="px-4 py-2 text-right font-medium text-gray-900">Stock Disp.</th>
                                            <th className="px-4 py-2 text-center font-medium text-gray-900">Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {loading && (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                                                    Cargando stock...
                                                </td>
                                            </tr>
                                        )}

                                        {error && (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-3 text-center text-red-500">
                                                    Error al cargar el stock.
                                                </td>
                                            </tr>
                                        )}

                                        {!loading && !error && stockSucursales.length > 0 && (
                                            stockSucursales.map((sucursal) => {
                                                const cantidadSeleccionada = cantidades[sucursal.nombreSucursal] || 0;
                                                const stockYaUsado = stockYaAgregado[sucursal.nombreSucursal] || 0;
                                                const stockDisponibleReal = sucursal.stock - stockYaUsado;
                                                const stockDisponible = Math.max(0, stockDisponibleReal);
                                                
                                                return (
                                                    <tr key={sucursal.nombreSucursal} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-gray-900">{sucursal.nombreSucursal}</td>
                                                        <td className="px-4 py-2 text-right">
                                                            <div className="flex flex-col items-end">
                                                                <span className={`font-medium ${stockDisponible > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {stockDisponible}
                                                                </span>
                                                                {stockYaUsado > 0 && (
                                                                    <span className="text-xs text-gray-500">
                                                                        ({stockYaUsado} ya agregado)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCantidadChange(sucursal.nombreSucursal, cantidadSeleccionada - 1, stockDisponible)}
                                                                    disabled={cantidadSeleccionada <= 0}
                                                                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
                                                                >
                                                                    −
                                                                </button>
                                                                
                                                                <input
                                                                    max={stockDisponible}
                                                                    value={cantidadSeleccionada}
                                                                    onChange={(e) => {
                                                                        const val = parseInt(e.target.value) || 0;
                                                                        handleCantidadChange(sucursal.nombreSucursal, val, stockDisponible);
                                                                    }}
                                                                    className={`w-16 text-center border rounded px-2 py-1 text-sm ${
                                                                        cantidadSeleccionada >= stockDisponible && stockDisponible > 0
                                                                            ? 'border-orange-400 bg-orange-50' 
                                                                            : 'border-gray-300'
                                                                    }`}
                                                                    title={cantidadSeleccionada >= stockDisponible && stockDisponible > 0 ? 'Stock máximo alcanzado' : ''}
                                                                />
                                                                
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCantidadChange(sucursal.nombreSucursal, cantidadSeleccionada + 1, stockDisponible)}
                                                                    disabled={cantidadSeleccionada >= stockDisponible}
                                                                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                        
                                        {!loading && !error && stockSucursales.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                                                    <div className="py-4">
                                                        <p>No hay información de stock disponible</p>
                                                        <button
                                                            onClick={handleAgregarSucursal}
                                                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            Ver todas las sucursales
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Subtotal */}
                        {totalCantidad > 0 && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-700">Subtotal del producto:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        ${(totalCantidad * (producto.precioFinal || producto.precioTienda || producto.precioUnitario || 0)).toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardar}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </Modal>
    );
}