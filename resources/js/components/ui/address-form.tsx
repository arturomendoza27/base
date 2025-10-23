import React, { useState, useMemo } from 'react';

const AddressForm = () => {
  // Estado para los campos de dirección
  const [addressData, setAddressData] = useState({
    tipoVia: '',
    numeroPrincipal: '',
    separador: '#',
    numeroSecundario: '',
    complemento: '',
    lote: ''
  });

  // Opciones predefinidas
  const tiposVia = [
    { value: '', label: 'Seleccione tipo' },
    { value: 'DIG', label: 'Diagonal (DIG)' },
    { value: 'AV', label: 'Avenida (AV)' },
    { value: 'CLL', label: 'Calle (CLL)' },
    { value: 'CR', label: 'Carrera (CR)' },
    { value: 'TV', label: 'Transversal (TV)' },
    { value: 'CL', label: 'Circular (CL)' },
    { value: 'AK', label: 'Avenida Carrera (AK)' }
  ];

  const separadores = [
    { value: '#', label: 'Número (#)' },
    { value: '-', label: 'Guión (-)' },
    { value: 'LOTE', label: 'Lote' },
    { value: 'MANZANA', label: 'Manzana' }
  ];

  // Generar la dirección formateada
  const direccionFormateada = useMemo(() => {
    const { tipoVia, numeroPrincipal, separador, numeroSecundario, complemento, lote } = addressData;
    
    if (!tipoVia || !numeroPrincipal) return '';

    let direccion = `${tipoVia} ${numeroPrincipal}`;
    
    if (separador && numeroSecundario) {
      if (separador === 'LOTE' || separador === 'MANZANA') {
        direccion += ` ${separador} ${numeroSecundario}`;
      } else {
        direccion += ` ${separador} ${numeroSecundario}`;
      }
    }
    
    if (complemento) {
      direccion += ` ${complemento}`;
    }
    
    if (lote && separador !== 'LOTE') {
      direccion += ` LOTE ${lote}`;
    }
    
    return direccion;
  }, [addressData]);

  // Manejar cambios en los inputs
  const handleChange = (field, value) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dirección enviada:', {
      ...addressData,
      direccionCompleta: direccionFormateada
    });
    
    // Aquí puedes enviar los datos a tu API o almacenamiento
    alert(`Dirección guardada: ${direccionFormateada}`);
  };

  // Resetear formulario
  const handleReset = () => {
    setAddressData({
      tipoVia: '',
      numeroPrincipal: '',
      separador: '#',
      numeroSecundario: '',
      complemento: '',
      lote: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
        Formulario de Dirección
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Complete los campos para generar una dirección preformateada
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de vía */}
        <div>
          <label htmlFor="tipoVia" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Vía *
          </label>
          <select
            id="tipoVia"
            value={addressData.tipoVia}
            onChange={(e) => handleChange('tipoVia', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {tiposVia.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Número principal */}
        <div>
          <label htmlFor="numeroPrincipal" className="block text-sm font-medium text-gray-700 mb-2">
            Número Principal *
          </label>
          <input
            id="numeroPrincipal"
            type="text"
            value={addressData.numeroPrincipal}
            onChange={(e) => handleChange('numeroPrincipal', e.target.value)}
            placeholder="Ej: 1, 10, 9"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Separador y número secundario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="separador" className="block text-sm font-medium text-gray-700 mb-2">
              Separador
            </label>
            <select
              id="separador"
              value={addressData.separador}
              onChange={(e) => handleChange('separador', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {separadores.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="numeroSecundario" className="block text-sm font-medium text-gray-700 mb-2">
              Número Secundario
            </label>
            <input
              id="numeroSecundario"
              type="text"
              value={addressData.numeroSecundario}
              onChange={(e) => handleChange('numeroSecundario', e.target.value)}
              placeholder="Ej: 48, 17"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Complemento y Lote */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-2">
              Complemento
            </label>
            <input
              id="complemento"
              type="text"
              value={addressData.complemento}
              onChange={(e) => handleChange('complemento', e.target.value)}
              placeholder="Ej: A, BIS, SUR"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lote" className="block text-sm font-medium text-gray-700 mb-2">
              Lote/Manzana
            </label>
            <input
              id="lote"
              type="text"
              value={addressData.lote}
              onChange={(e) => handleChange('lote', e.target.value)}
              placeholder="Ej: 59, 127"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Vista previa */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Vista previa:</h3>
          <div className={`p-3 rounded border-2 ${direccionFormateada ? 'border-green-200 bg-green-50 text-green-800' : 'border-gray-200 bg-gray-100 text-gray-500'}`}>
            {direccionFormateada || 'Complete los campos para ver la dirección...'}
          </div>
        </div>

        {/* Ejemplos */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-md font-medium text-blue-700 mb-2">Ejemplos de formato:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              DIG 0 # 9-48
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              AV 1 # 9 - 17
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              CLL 10 A LOTE 59
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              AV 2 LOTE 127
            </li>
          </ul>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Limpiar Formulario
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Guardar Dirección
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;