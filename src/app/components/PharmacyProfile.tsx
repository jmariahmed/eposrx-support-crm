import { useNavigate, useParams } from 'react-router-dom';
import { mockPharmacies, mockTickets } from '../data/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Store, Mail, MapPin, Phone, FileText, Plus, Building2 } from 'lucide-react';
import { Separator } from './ui/separator';

export function PharmacyProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pharmacy = mockPharmacies.find((p) => p.id === id);
  const pharmacyTickets = mockTickets.filter((t) => t.pharmacyId === id);

  if (!pharmacy) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Pharmacy not found</p>
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
        onClick={() => navigate('/pharmacies')}
        className="mb-4 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Pharmacies
      </Button>

      <div className="grid grid-cols-3 gap-6">
        {/* Pharmacy Details */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{pharmacy.name}</CardTitle>
                  {pharmacy.companyName && (
                    <div className="flex items-center gap-2 mt-2">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <button
                        onClick={() => navigate(`/company/${pharmacy.companyId}`)}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {pharmacy.companyName}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm text-slate-600 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-slate-500 mt-0.5" />
                    <span className="text-slate-900">{pharmacy.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-slate-500 mt-0.5" />
                    <span className="text-slate-900">{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-slate-900">{pharmacy.address}</p>
                      <p className="text-slate-900">{pharmacy.postcode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {pharmacy.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm text-slate-600 mb-2">Notes</h4>
                    <p className="text-sm text-slate-700">{pharmacy.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              <Button
                className="w-full"
                onClick={() =>
                  navigate('/ticket/new', {
                    state: {
                      pharmacyId: pharmacy.id,
                      pharmacyName: pharmacy.name,
                      pharmacyEmail: pharmacy.email,
                      pharmacyPhone: pharmacy.phone,
                      pharmacyPostcode: pharmacy.postcode,
                    },
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Open Support Ticket
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tickets History */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Support Tickets</CardTitle>
                <Badge variant="secondary">{pharmacyTickets.length} Total</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pharmacyTickets.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No tickets found</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Create the first support ticket for this pharmacy
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pharmacyTickets.map((ticket) => (
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
