import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockPharmacies, mockCompanies, mockStaff } from '../data/mockData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Upload, Store, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface TicketLocationState {
  pharmacyId?: string;
  pharmacyName?: string;
  pharmacyEmail?: string;
  pharmacyPhone?: string;
  pharmacyPostcode?: string;
  companyId?: string;
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
}

export function CreateTicket() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TicketLocationState | undefined;

  const [formData, setFormData] = useState({
    entityType: state?.pharmacyId ? 'pharmacy' : state?.companyId ? 'company' : '',
    pharmacyId: state?.pharmacyId || '',
    companyId: state?.companyId || '',
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    assignedTo: '',
  });

  const categories = [
    'Technical Support',
    'Billing',
    'Account Management',
    'Training',
    'General Inquiry',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pharmacyId && !formData.companyId) {
      toast.error('Please select a pharmacy or company');
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock ticket creation
    toast.success('Support ticket created successfully!');
    
    // Navigate to dashboard after creation
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const selectedPharmacy = mockPharmacies.find((p) => p.id === formData.pharmacyId);
  const selectedCompany = mockCompanies.find((c) => c.id === formData.companyId);

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl text-slate-900 mb-2">Create Support Ticket</h1>
          <p className="text-slate-600">Fill in the details to create a new support ticket</p>
        </div>

        {/* Display selected entity info */}
        {(selectedPharmacy || selectedCompany) && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {selectedPharmacy ? (
                    <Store className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Building2 className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {selectedPharmacy?.name || selectedCompany?.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedPharmacy?.email || selectedCompany?.email}
                  </p>
                  <p className="text-sm text-slate-600">
                    {selectedPharmacy?.phone || selectedCompany?.phone}
                  </p>
                  {selectedPharmacy?.postcode && (
                    <p className="text-sm text-slate-600">{selectedPharmacy.postcode}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Show selection only if not pre-filled */}
              {!state?.pharmacyId && !state?.companyId && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    No pharmacy or company selected. Please go back and search for one, or select manually below.
                  </p>
                  
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={formData.entityType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, entityType: value, pharmacyId: '', companyId: '' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.entityType === 'pharmacy' && (
                    <div className="space-y-2">
                      <Label htmlFor="pharmacy">Pharmacy *</Label>
                      <Select
                        value={formData.pharmacyId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, pharmacyId: value })
                        }
                      >
                        <SelectTrigger id="pharmacy">
                          <SelectValue placeholder="Select a pharmacy..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPharmacies.map((pharmacy) => (
                            <SelectItem key={pharmacy.id} value={pharmacy.id}>
                              {pharmacy.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.entityType === 'company' && (
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Select
                        value={formData.companyId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, companyId: value })
                        }
                      >
                        <SelectTrigger id="company">
                          <SelectValue placeholder="Select a company..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCompanies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Issue Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue or query..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  required
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assign To */}
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To (Optional)</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assignedTo: value })
                  }
                >
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Select staff member..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {mockStaff.map((staff) => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-slate-300 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF, PNG, JPG up to 10MB
                  </p>
                  <input
                    id="file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Ticket</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
