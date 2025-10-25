import React, { useState, useEffect } from 'react';
import { getVisualConfig, updateVisualConfig, VisualConfig, Banner } from '../lib/api';
import { FaSave, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

// Initial state for the form
const initialConfig: VisualConfig = {
  logo: { url: '', alt: '', width: 0, height: 0 },
  banners: { enabled: false, autoplay: false, interval: 0, items: [] },
};

const VisualSettings: React.FC = () => {
  const [config, setConfig] = useState<VisualConfig>(initialConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1. Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVisualConfig();
        setConfig(data);
      } catch (err) {
        setError('Erro ao carregar configurações visuais.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form submission (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Simple validation
    if (config.logo.width <= 0 || config.logo.height <= 0 || config.banners.interval <= 0) {
      setError('Valores de Largura, Altura e Intervalo devem ser maiores que zero.');
      setSaving(false);
      return;
    }

    try {
      await updateVisualConfig(config);
      setSuccess('Salvo com sucesso!');
      // Re-fetch data to ensure consistency after save
      const updatedData = await getVisualConfig();
      setConfig(updatedData);
    } catch (err) {
      setError('Erro ao salvar configurações. Verifique o console para detalhes.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
    }
  };

  // Handle input changes for logo and banner settings
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        [name]: type === 'number' ? Number(value) : value,
      },
    }));
  };

  const handleBannerSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      banners: {
        ...prev.banners,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
      },
    }));
  };

  // --- Banner Item Management (Simplified Inline Editing) ---

  const handleBannerItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newItems = [...config.banners.items];
    newItems[index] = {
      ...newItems[index],
      [name]: type === 'checkbox' ? checked : value,
    };
    setConfig(prev => ({
      ...prev,
      banners: { ...prev.banners, items: newItems },
    }));
  };

  const addBanner = () => {
    const newBanner: Banner = {
      id: Date.now(), // Use timestamp as a temporary unique ID for new items
      url: '',
      alt: '',
      title: '',
      subtitle: '',
      link: '',
      active: true,
    };
    setConfig(prev => ({
      ...prev,
      banners: { ...prev.banners, items: [...prev.banners.items, newBanner] },
    }));
  };

  const removeBanner = (id: number) => {
    setConfig(prev => ({
      ...prev,
      banners: {
        ...prev.banners,
        items: prev.banners.items.filter(item => item.id !== id),
      },
    }));
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurações Visuais</h1>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Sucesso:</strong>
          <span className="block sm:inline"> {success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo Settings */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Configurações de Logo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">URL da Logo</label>
              <input
                type="url"
                name="url"
                id="logoUrl"
                value={config.logo.url}
                onChange={handleLogoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="logoAlt" className="block text-sm font-medium text-gray-700">Texto Alternativo (Alt)</label>
              <input
                type="text"
                name="alt"
                id="logoAlt"
                value={config.logo.alt}
                onChange={handleLogoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="logoWidth" className="block text-sm font-medium text-gray-700">Largura (px)</label>
              <input
                type="number"
                name="width"
                id="logoWidth"
                value={config.logo.width}
                onChange={handleLogoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="logoHeight" className="block text-sm font-medium text-gray-700">Altura (px)</label>
              <input
                type="number"
                name="height"
                id="logoHeight"
                value={config.logo.height}
                onChange={handleLogoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Banner Settings */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Configurações de Banners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center">
              <input
                id="bannersEnabled"
                name="enabled"
                type="checkbox"
                checked={config.banners.enabled}
                onChange={handleBannerSettingsChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="bannersEnabled" className="ml-2 block text-sm text-gray-900">
                Banners Ativos
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="bannersAutoplay"
                name="autoplay"
                type="checkbox"
                checked={config.banners.autoplay}
                onChange={handleBannerSettingsChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="bannersAutoplay" className="ml-2 block text-sm text-gray-900">
                Autoplay
              </label>
            </div>
            <div>
              <label htmlFor="bannersInterval" className="block text-sm font-medium text-gray-700">Intervalo (ms)</label>
              <input
                type="number"
                name="interval"
                id="bannersInterval"
                value={config.banners.interval}
                onChange={handleBannerSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
                required
              />
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-4">Itens do Banner</h3>
          <button
            type="button"
            onClick={addBanner}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
          >
            <FaPlus className="-ml-1 mr-2 h-4 w-4" />
            Adicionar Banner
          </button>

          {/* Banner Items Table/List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {config.banners.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <input
                        type="checkbox"
                        name="active"
                        checked={item.active}
                        onChange={(e) => handleBannerItemChange(index, e)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="text"
                        name="title"
                        value={item.title}
                        onChange={(e) => handleBannerItemChange(index, e)}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
                        placeholder="Título"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="url"
                        name="url"
                        value={item.url}
                        onChange={(e) => handleBannerItemChange(index, e)}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
                        placeholder="URL da Imagem"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="text"
                        name="link"
                        value={item.link}
                        onChange={(e) => handleBannerItemChange(index, e)}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
                        placeholder="Link de Destino"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeBanner(item.id)}
                        className="text-red-600 hover:text-red-900 ml-3"
                        title="Remover Banner"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <FaSave className="-ml-1 mr-2 h-5 w-5" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VisualSettings;

