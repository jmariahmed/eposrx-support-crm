import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPharmacies } from '../data/mockData';
import { Pharmacy } from '../types';
import { Input } from './ui/input';
import { Search, Store, Mail, MapPin, Phone, Plus } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { mockCompanies } from '../data/mockData';
import { toast } from 'sonner';

export function PharmacyList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [pharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyId: '',
    email: '',
    phone: '',
    postcode: '',
    address: '',
    notes: '',
  });

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const query = searchQuery.toLowerCase();
    return (
      pharmacy.name.toLowerCase().includes(query) ||
      pharmacy.email.toLowerCase().includes(query) ||
      pharmacy.postcode.toLowerCase().includes(query) ||
      pharmacy.address.toLowerCase().includes(query) ||
      (pharmacy.companyName && pharmacy.companyName.toLowerCase().includes(query))
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Pharmacy added successfully!');
    setDialogOpen(false);
    setFormData({
      name: '',
      companyId: '',
      email: '',
      phone: '',
      postcode: '',
      address: '',
      notes: '',
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl text-slate-900 mb-2">Pharmacies</h1>
          <p className="text-slate-600">Manage individual pharmacy locations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Pharmacy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Pharmacy</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pharmacy Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyId">Parent Company (Optional)</Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                >
                  <SelectTrigger id="companyId">
                    <SelectValue placeholder="Select company (if applicable)..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Independent Pharmacy</SelectItem>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Pharmacy</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by pharmacy name, company, email, or postcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Showing {filteredPharmacies.length} of {pharmacies.length} pharmacies
        </p>
      </div>

      <div className="grid gap-4">
        {filteredPharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            onClick={() => navigate(`/pharmacy/${pharmacy.id}`)}
            className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg text-slate-900">{pharmacy.name}</h3>
                    {pharmacy.companyName && (
                      <Badge variant="secondary" className="text-xs">
                        {pharmacy.companyName}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{pharmacy.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{pharmacy.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {pharmacy.address} • {pharmacy.postcode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredPharmacies.length === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No pharmacies found matching your search</p>
            <p className="text-sm text-slate-500 mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
