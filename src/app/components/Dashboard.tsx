import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTickets, mockTodos } from '../data/mockData';
import { Ticket, TodoItem } from '../types';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, CheckCircle2, Circle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type TimePeriod = 'daily' | 'weekly' | 'monthly' | '3month' | '6month' | '1year';

export function Dashboard() {
  const navigate = useNavigate();
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('weekly');

  const openTickets = tickets.filter((t) => t.status === 'open');
  const ongoingTickets = tickets.filter((t) => t.status === 'ongoing');
  const completedTickets = tickets.filter((t) => t.status === 'completed');

  // Filter tickets by time period
  const getFilteredTickets = () => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timePeriod) {
      case 'daily':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3month':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6month':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return tickets.filter((t) => new Date(t.createdAt) >= cutoffDate);
  };

  const filteredTickets = getFilteredTickets();
  const chartData = [
    { name: 'Open', value: filteredTickets.filter((t) => t.status === 'open').length, color: '#3b82f6' },
    { name: 'In Progress', value: filteredTickets.filter((t) => t.status === 'ongoing').length, color: '#f59e0b' },
    { name: 'Completed', value: filteredTickets.filter((t) => t.status === 'completed').length, color: '#10b981' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const TicketTable = ({ tickets }: { tickets: Ticket[] }) => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-6 py-3 text-sm text-slate-600">Ticket ID</th>
            <th className="text-left px-6 py-3 text-sm text-slate-600">Title</th>
            <th className="text-left px-6 py-3 text-sm text-slate-600">Pharmacy/Company</th>
            <th className="text-left px-6 py-3 text-sm text-slate-600">Priority</th>
            <th className="text-left px-6 py-3 text-sm text-slate-600">Category</th>
            <th className="text-left px-6 py-3 text-sm text-slate-600">Assigned To</th>
            <th className="text-left px-6 py-3 text-sm text-slate-600">Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                No tickets found
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-900">{ticket.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-900">{ticket.title}</span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ticket.pharmacyId) {
                        navigate(`/pharmacy/${ticket.pharmacyId}`);
                      } else if (ticket.companyId) {
                        navigate(`/company/${ticket.companyId}`);
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {ticket.pharmacyName || ticket.companyName}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{ticket.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{ticket.assignedTo || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{formatDate(ticket.createdAt)}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage and track support tickets</p>
        </div>
        <Button onClick={() => navigate('/ticket/search')}>
          <Plus className="w-4 h-4 mr-2" />
          New Support Ticket
        </Button>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Pie Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ticket Overview</CardTitle>
              <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="3month">3 Months</SelectItem>
                  <SelectItem value="6month">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold text-blue-600">
                  {chartData[0].value}
                </div>
                <div className="text-sm text-slate-600">Open</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-yellow-600">
                  {chartData[1].value}
                </div>
                <div className="text-sm text-slate-600">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-green-600">
                  {chartData[2].value}
                </div>
                <div className="text-sm text-slate-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* To-Do List */}
        <Card>
          <CardHeader>
            <CardTitle>My To-Do List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {todo.text}
                  </span>
                </div>
              ))}
              {todos.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No tasks yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Section */}
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="open">
            Open <span className="ml-2 text-xs bg-slate-200 px-2 py-0.5 rounded-full">{openTickets.length}</span>
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            Ongoing <span className="ml-2 text-xs bg-slate-200 px-2 py-0.5 rounded-full">{ongoingTickets.length}</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <span className="ml-2 text-xs bg-slate-200 px-2 py-0.5 rounded-full">{completedTickets.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <TicketTable tickets={openTickets} />
        </TabsContent>

        <TabsContent value="ongoing">
          <TicketTable tickets={ongoingTickets} />
        </TabsContent>

        <TabsContent value="completed">
          <TicketTable tickets={completedTickets} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
