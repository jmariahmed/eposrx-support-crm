import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPharmacies, mockCompanies } from '../data/mockData';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Building2, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function TicketSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'postcode' | 'phone' | ''>('');

  // Combine pharmacies and companies for search
  const allEntities = [
    ...mockPharmacies.map(p => ({ ...p, type: 'pharmacy' as const })),
    ...mockCompanies.map(c => ({ ...c, type: 'company' as const, postcode: '' }))
  ];

  const searchResults = searchTerm.trim() === '' ? [] : allEntities.filter((entity) => {
    const search = searchTerm.toLowerCase();
    return (
      entity.name.toLowerCase().includes(search) ||
      entity.email.toLowerCase().includes(search) ||
      (entity.postcode && entity.postcode.toLowerCase().includes(search)) ||
      entity.phone.toLowerCase().includes(search)
    );
  });

  const handleSelectEntity = (entity: typeof allEntities[0]) => {
    if (entity.type === 'pharmacy') {
      navigate('/ticket/new', {
        state: {
          pharmacyId: entity.id,
          pharmacyName: entity.name,
          pharmacyEmail: entity.email,
          pharmacyPhone: entity.phone,
          pharmacyPostcode: entity.postcode,
        },
      });
    } else {
      navigate('/ticket/new', {
        state: {
          companyId: entity.id,
          companyName: entity.name,
          companyEmail: entity.email,
          companyPhone: entity.phone,
        },
      });
    }
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard')}
        className="mb-4 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl text-slate-900 mb-2">Create New Support Ticket</h1>
          <p className="text-slate-600">Search for a pharmacy or company to create a ticket</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search">Search by Name, Postcode, Email, or Phone Number</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Start typing to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Enter pharmacy name, company name, postcode, email, or phone number
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchTerm.trim() !== '' && (
          <Card>
            <CardHeader>
              <CardTitle>
                Search Results
                {searchResults.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-600">
                    ({searchResults.length} found)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No results found</p>
                  <p className="text-sm text-slate-500 mt-1">Try a different search term</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((entity) => (
                    <div
                      key={entity.id}
                      onClick={() => handleSelectEntity(entity)}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-slate-900">{entity.name}</h3>
                              <Badge variant="outline" className="capitalize">
                                {entity.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600 space-y-0.5">
                              <p>{entity.email}</p>
                              <p>{entity.phone}</p>
                              {entity.postcode && <p>{entity.postcode}</p>}
                              {entity.type === 'pharmacy' && 'companyName' in entity && entity.companyName && (
                                <p className="text-slate-500">Part of: {entity.companyName}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {searchTerm.trim() === '' && (
          <div className="text-center py-12 text-slate-500">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p>Start typing to search for a pharmacy or company</p>
          </div>
        )}
      </div>
    </div>
  );
}
