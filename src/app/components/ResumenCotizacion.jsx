import React, { useState } from 'react';
import { generarPdf } from '../services/generarPdf';
import { generarExcelResumen } from '../services/generarExcelResumen';
import ModalGestionarCantidades from './ModalGestionarCantidades';

const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const PDFIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const ExcelIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* Carpeta/hoja */}
        <rect x="3" y="4" width="14" height="16" rx="2" ry="2" strokeWidth="2"></rect>
        {/* X de Excel */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.5 9.5l5 5M12.5 9.5l-5 5"></path>
        {/* Separador para estilo de hoja */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7v10"></path>
    </svg>
);

export default function ResumenCotizacion({ 
    items = [], 
    onRemove, 
    onSave, 
    onUpdateCantidad, 
    onUpdatePrecioFinal,
    onOpenModalGenerarCotizacion, 
    isMobile,
    productAddedToast,
    lastAddedProduct,
    onReasignarSucursal,
    onDestacarProducto,
    infoLicitacion,
    onRemoveAll,
    onOpenStockModal
}) {
    const [saveState, setSaveState] = useState('idle'); 
    const [confirmarEliminarTodos, setConfirmarEliminarTodos] = useState(false);
    const [modalGestionarOpen, setModalGestionarOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    
    // Calcular neto usando precioFinal si está definido, si no, usar precio de tienda
    const neto = items.reduce((acc, item) => {
        const unit = (item.precioFinal ?? item.precioTienda ?? item.precioUnitario ?? 0);
        return acc + unit * item.cantidad;
    }, 0);
    const total = neto;
    const iva = total / 1.19;

    const handleCantidadChange = (itemId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            onRemove(itemId);
        } else {
            onUpdateCantidad(itemId, nuevaCantidad);
        }
    };

    const handleGestionarCantidades = (producto) => {
        setProductoSeleccionado(producto);
        setModalGestionarOpen(true);
    };

    const handleUpdateCantidades = (itemId, totalCantidad, detallesSucursales) => {
        if (totalCantidad <= 0) {
            onRemove(itemId);
        } else {
            // Actualizar cantidad total y detalles de sucursales
            onUpdateCantidad(itemId, totalCantidad, detallesSucursales);
        }
    };

    const handleGenerarCotizacion = () => {
        if (items.length === 0) {
            console.warn('Agrega al menos un producto para generar la cotización');
            return;
        }
        onOpenModalGenerarCotizacion();
    };

    const handleGenerarPDF = () => {
        if (items.length === 0) {
            alert('Agrega al menos un producto para generar el PDF');
            return;
        }
        
        const totales = { neto, iva, total };
        const doc = generarPdf.generarCotizacion(items, infoLicitacion, totales);
        
        // Descargar directamente
        const fecha = new Date();
        const fechaFormateada = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}_${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
        const nombreArchivo = `cotizacion_${infoLicitacion?.idLicitacion || 'sin-id'}_${fechaFormateada}.pdf`;
        generarPdf.descargarPDF(doc, nombreArchivo);
    };

    const handleEliminarTodos = () => {
        if (items.length === 0) return;
        if (!confirmarEliminarTodos) {
            setConfirmarEliminarTodos(true);
            // cancelar confirmación después de 4s
            setTimeout(() => setConfirmarEliminarTodos(false), 4000);
            return;
        }
        if (onRemoveAll) onRemoveAll();
        setConfirmarEliminarTodos(false);
    };

    return (
        <aside className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Resumen de Cotización</h3>
                </div>

                <div className="flex gap-2">
                 {/* Botón Generar PDF */}
                    <button
                        type="button"
                        onClick={handleGenerarPDF}
                        className="px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
                        title="Generar PDF"
                    >
                        <PDFIcon />
                        Exportar a PDF
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            console.log('Botón Excel clickeado. Items:', items);
                            generarExcelResumen(items, infoLicitacion);
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                        title="Exportar a Excel"
                    >
                        <ExcelIcon />
                        Exportar a Excel
                    </button>

                    {/* Botón Eliminar Todos */}
                                        {items.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleEliminarTodos}
                                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-2 ${
                                                            confirmarEliminarTodos ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
                                                        } text-white`}
                                                        title={confirmarEliminarTodos ? 'Haz clic para confirmar' : 'Eliminar todos los productos'}
                                                    >
                                                        <TrashIcon />
                                                        {confirmarEliminarTodos ? 'Confirmar eliminar' : 'Eliminar todos'}
                                                    </button>
                                                    {confirmarEliminarTodos && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmarEliminarTodos(false)}
                                                            className="px-2 py-1 text-xs font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    )}
                                                </div>
                                        )}
           
                </div>

                <button
                    type="button"
                    onClick={async () => {
                        if (saveState === 'saving') return;
                        try {
                            setSaveState('saving');
                            const ok = await (onSave ? onSave() : Promise.resolve(false));
                            setSaveState(ok ? 'success' : 'error');
                        } catch (e) {
                            setSaveState('error');
                        } finally {
                            setTimeout(() => setSaveState('idle'), 2000);
                        }
                    }}
                    disabled={saveState === 'saving'}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-2
                        ${saveState === 'success' ? 'bg-green-600 text-white hover:bg-green-600' : ''}
                        ${saveState === 'error' ? 'bg-red-600 text-white hover:bg-red-600' : ''}
                        ${saveState === 'saving' ? 'bg-blue-400 text-white cursor-wait' : ''}
                        ${saveState === 'idle' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                    `}
                >
                    {saveState === 'saving' && (
                        <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    )}
                    {saveState === 'idle' && 'Guardar'}
                    {saveState === 'saving' && 'Guardando…'}
                    {saveState === 'success' && (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            Guardado
                        </>
                    )}
                    {saveState === 'error' && 'Error al guardar'}
                </button>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 max-h-96">
                {items.length === 0 && (
                    <p className="text-sm text-gray-400 text-center mt-8">
                        Agrega productos del catálogo para comenzar a cotizar.
                    </p>
                )}
                
                {items.map(item => (
                    <div 
                        key={item.itemId || item.id} 
                        className="bg-gray-50 p-3 rounded-lg border-2 border-blue-300"
                    >
                        {/* Header del producto */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                {/* Badge de referencia al SKU solicitado */}
                                {item.originalSolicitadoSku && (
                                    <div className="flex items-center gap-1 mb-1 flex-wrap">
                                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                        </svg>
                                        <button
                                            type="button"
                                            onClick={() => onDestacarProducto && onDestacarProducto(item.originalSolicitadoSku)}
                                            className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full hover:bg-blue-200 hover:text-blue-900 transition-colors cursor-pointer"
                                            title="Haz clic para destacar el producto solicitado"
                                        >
                                            Ref: {item.originalSolicitadoSku}
                                        </button>
                                        {item.originalSolicitadoNombre && (
                                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                                {item.originalSolicitadoNombre}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {item.descripcion && (
                                    <div className="flex items-center gap-1 mb-1">
                                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                        </svg>
                                        <button
                                            type="button"
                                            onClick={() => onDestacarProducto && onDestacarProducto(item.descripcion)}
                                            className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full hover:bg-blue-200 hover:text-blue-900 transition-colors cursor-pointer"
                                            title="Haz clic para destacar el producto solicitado"
                                        >
                                            Ref: {item.descripcion}
                                        </button>
                                    </div>
                                )}
                                
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                    {/* Limpiar nombres legacy que puedan tener sucursales incluidas */}
                                    {(() => {
                                        let nombreLimpio = item.nombre || '';
                                        const indiceSuc = nombreLimpio.lastIndexOf(' (Suc.');
                                        if (indiceSuc !== -1) {
                                            nombreLimpio = nombreLimpio.substring(0, indiceSuc).trim();
                                        }
                                        return nombreLimpio;
                                    })()}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    SKU: {item.sku} • Cantidad: {item.cantidad}
                                </p>
                                
                                {/* Mostrar desglose de sucursales si existe */}
                                {item.detallesSucursales && item.detallesSucursales.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {item.detallesSucursales.map((detalle, idx) => (
                                            <span 
                                                key={idx}
                                                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                                                title={`${detalle.cantidad} unidades desde ${detalle.nombreSucursal}`}
                                            >
                                                {detalle.nombreSucursal}: {detalle.cantidad}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                type="button" 
                                onClick={() => onRemove(item.id)} 
                                className="text-red-500 hover:text-red-700 p-1 ml-2"
                                title="Eliminar producto"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                        
                        {/* Controles de cantidad y precio */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleGestionarCantidades(item)}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                    Gestionar
                                </button>
                            </div>
                            
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                            </div>
                            {/* Grupo de precios */}
                            <div className="flex items-end gap-4">
                                {/* Precio tienda */}
                                <div className="text-right w-32">
                                    <div className="text-[12px] text-gray-500 leading-none mb-1">Precio tienda</div>
                                    <div className="h-9 flex items-center justify-end text-sm font-semibold text-gray-900">
                                        ${((item.precioTienda ?? item.precioUnitario) || 0).toLocaleString('es-CL')} c/u
                                    </div>
                                </div>

                                {/* Precio final (editable) */}
                                <div className="text-right w-32">
                                    <label className="block text-[12px] text-gray-500 leading-none mb-1">Precio final</label>
                                    <input
                                        value={Number(item.precioFinal ?? item.precioTienda ?? item.precioUnitario ?? 0)}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            onUpdatePrecioFinal && onUpdatePrecioFinal(item.id, Number.isFinite(val) ? val : 0);
                                        }}
                                        className="h-9 w-20 text-right border border-gray-300 rounded px-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        </div>
                        
                        {/* Subtotal del producto */}
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                            <span className="text-sm text-gray-600">Subtotal</span>
                            <span className="font-bold text-lg">
                                ${(
                                    item.cantidad * ((item.precioFinal ?? item.precioTienda ?? item.precioUnitario) || 0)
                                ).toLocaleString('es-CL')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Totales */}
            <div className="pt-4 border-t mt-4">
                <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between"><span>Neto</span><span>${Math.round(neto).toLocaleString('es-CL')}</span></div>
                    <div className="flex justify-between"><span>IVA (19%)</span><span>${Math.round(iva).toLocaleString('es-CL')}</span></div>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>${Math.round(total).toLocaleString('es-CL')}</span>
                </div>
                <button 
                    className="w-full mt-4 p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Generar y Enviar Cotización
                </button>
                
                {/* Toast de producto agregado */}
                {productAddedToast !== 'idle' && (
                    <div 
                        className={`mt-2 bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                            productAddedToast === 'visible' ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'
                        }`}
                    >
                        <div className="text-green-200 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">¡Producto agregado!</p>
                            <p className="text-xs text-green-100 truncate">
                                {lastAddedProduct?.nombre} - Cantidad: {lastAddedProduct?.cantidad}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal para gestionar cantidades */}
            <ModalGestionarCantidades
                isOpen={modalGestionarOpen}
                onClose={() => {
                    setModalGestionarOpen(false);
                    setProductoSeleccionado(null);
                }}
                producto={productoSeleccionado}
                onUpdateCantidades={handleUpdateCantidades}
                onOpenStockModal={onOpenStockModal}
                itemsCotizacion={items}
            />
        </aside>
    );
}

