import { useNavigate, useParams } from 'react-router-dom';
import { mockCompanies, mockTickets, mockPharmacies } from '../data/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Building2, Mail, MapPin, Phone, FileText, Plus, Store } from 'lucide-react';
import { Separator } from './ui/separator';

export function CompanyProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const company = mockCompanies.find((c) => c.id === id);
  const companyTickets = mockTickets.filter((t) => t.companyId === id);
  const companyPharmacies = mockPharmacies.filter((p) => p.companyId === id);

  if (!company) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Company not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/companies')}
        className="mb-4 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Companies
      </Button>

      <div className="grid grid-cols-3 gap-6">
        {/* Company Details */}
        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{company.name}</CardTitle>
                  <Badge variant="secondary">Company</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm text-slate-600 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-slate-500 mt-0.5" />
                    <span className="text-slate-900">{company.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-slate-500 mt-0.5" />
                    <span className="text-slate-900">{company.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                    <span className="text-slate-900">{company.address}</span>
                  </div>
                </div>
              </div>

              {company.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm text-slate-600 mb-2">Notes</h4>
                    <p className="text-sm text-slate-700">{company.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              <Button
                className="w-full"
                onClick={() =>
                  navigate('/ticket/new', {
                    state: {
                      companyId: company.id,
                      companyName: company.name,
                      companyEmail: company.email,
                      companyPhone: company.phone,
                    },
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Open Support Ticket
              </Button>
            </CardContent>
          </Card>

          {/* Pharmacy Locations */}
          {companyPharmacies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pharmacy Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {companyPharmacies.map((pharmacy) => (
                    <button
                      key={pharmacy.id}
                      onClick={() => navigate(`/pharmacy/${pharmacy.id}`)}
                      className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Store className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-900">
                          {pharmacy.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{pharmacy.postcode}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tickets History */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Support Tickets</CardTitle>
                <Badge variant="secondary">{companyTickets.length} Total</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {companyTickets.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No tickets found</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Create the first support ticket for this company
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {companyTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {ticket.id}
                          </span>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        </div>
                        <span className="text-sm text-slate-500">{formatDate(ticket.createdAt)}</span>
                      </div>
                      <h4 className="text-slate-900 mb-1">{ticket.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Category: {ticket.category}</span>
                        <span>•</span>
                        <span>Assigned to: {ticket.assignedTo || 'Unassigned'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
