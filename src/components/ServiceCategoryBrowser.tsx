import { useState } from 'react';
import { serviceCategories } from '@/data/serviceCategories';

interface Props {
  onSelectService?: (service: string, category: string) => void;
}

export default function ServiceCategoryBrowser({ onSelectService }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Filter categories and services by search query
  const filtered = serviceCategories
    .map(cat => ({
      ...cat,
      filteredServices: cat.services.filter(svc =>
        svc.toLowerCase().includes(query.toLowerCase())
      )
    }))
    .filter(cat => cat.filteredServices.length > 0);

  return (
    <div>
      {/* Search bar */}
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="Search for a service..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search services"
      />
      {/* Responsive grid of categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(cat => (
          <div key={cat.slug} className="bg-white rounded shadow p-4">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setExpanded(expanded === cat.slug ? null : cat.slug)}
              aria-expanded={expanded === cat.slug ? 'true' : 'false'}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setExpanded(expanded === cat.slug ? null : cat.slug)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${cat.color}`}>{/* Optionally render SVG icon here */}</div>
              <div>
                <div className="font-bold">{cat.name}</div>
                <div className="text-xs text-gray-500">{cat.description}</div>
              </div>
            </div>
            {expanded === cat.slug && (
              <ul className="mt-3 pl-4 list-disc">
                {cat.filteredServices.map((svc: string) => (
                  <li key={svc}>
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => onSelectService?.(svc, cat.name)}
                      tabIndex={0}
                      aria-label={`Select ${svc}`}
                    >
                      {svc}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-gray-500">No services found.</div>}
      </div>
    </div>
  );
} 