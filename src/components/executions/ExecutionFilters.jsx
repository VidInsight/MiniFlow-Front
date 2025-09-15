import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const EXECUTION_STATUSES = [
  'PENDING',
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'TIMEOUT',
  'PAUSED'
];

const STATUS_COLORS = {
  PENDING: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
  RUNNING: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  COMPLETED: 'bg-green-500/20 text-green-700 border-green-500/30',
  FAILED: 'bg-red-500/20 text-red-700 border-red-500/30',
  CANCELLED: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
  TIMEOUT: 'bg-orange-500/20 text-orange-700 border-orange-500/30',
  PAUSED: 'bg-purple-500/20 text-purple-700 border-purple-500/30'
};

export const ExecutionFilters = ({ onFiltersChange, initialFilters = {}, isLoading = false }) => {
  const [filters, setFilters] = useState({
    workflowId: '',
    status: '',
    success: null,
    startedAtFrom: null,
    startedAtTo: null,
    completedAtFrom: null,
    completedAtTo: null,
    minDuration: '',
    maxDuration: '',
    ...initialFilters
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const active = [];
    if (filters.workflowId) active.push({ key: 'workflowId', label: 'Workflow ID', value: filters.workflowId });
    if (filters.status) active.push({ key: 'status', label: 'Durum', value: filters.status });
    if (filters.success !== null) active.push({ key: 'success', label: 'Başarı', value: filters.success ? 'Başarılı' : 'Başarısız' });
    if (filters.startedAtFrom) active.push({ key: 'startedAtFrom', label: 'Başlangıç', value: format(filters.startedAtFrom, 'dd/MM/yyyy') });
    if (filters.startedAtTo) active.push({ key: 'startedAtTo', label: 'Başlangıç Son', value: format(filters.startedAtTo, 'dd/MM/yyyy') });
    if (filters.completedAtFrom) active.push({ key: 'completedAtFrom', label: 'Bitiş', value: format(filters.completedAtFrom, 'dd/MM/yyyy') });
    if (filters.completedAtTo) active.push({ key: 'completedAtTo', label: 'Bitiş Son', value: format(filters.completedAtTo, 'dd/MM/yyyy') });
    if (filters.minDuration) active.push({ key: 'minDuration', label: 'Min Süre', value: `${filters.minDuration}s` });
    if (filters.maxDuration) active.push({ key: 'maxDuration', label: 'Max Süre', value: `${filters.maxDuration}s` });
    
    setActiveFilters(active);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRemoveFilter = (key) => {
    const newFilters = { ...filters };
    if (key === 'success') {
      newFilters[key] = null;
    } else {
      newFilters[key] = '';
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      workflowId: '',
      status: '',
      success: null,
      startedAtFrom: null,
      startedAtTo: null,
      completedAtFrom: null,
      completedAtTo: null,
      minDuration: '',
      maxDuration: ''
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handleQuickStatusFilter = (status) => {
    handleFilterChange('status', filters.status === status ? '' : status);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Basit' : 'Gelişmiş'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Sıfırla
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Status Filters */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Hızlı Durum Filtreleri</Label>
          <div className="flex flex-wrap gap-2">
            {EXECUTION_STATUSES.map((status) => (
              <Badge
                key={status}
                variant={filters.status === status ? "default" : "outline"}
                className={cn(
                  "cursor-pointer hover:scale-105 transition-transform",
                  filters.status === status ? "shadow-md" : "",
                  STATUS_COLORS[status]
                )}
                onClick={() => handleQuickStatusFilter(status)}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="workflowId">Workflow ID</Label>
            <Input
              id="workflowId"
              placeholder="Workflow ID ara..."
              value={filters.workflowId}
              onChange={(e) => handleFilterChange('workflowId', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="status">Durum</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => handleFilterChange('status', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seç..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tümü</SelectItem>
                {EXECUTION_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="success">Başarı Durumu</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="success"
                checked={filters.success === true}
                onCheckedChange={(checked) => handleFilterChange('success', checked ? true : null)}
                disabled={isLoading}
              />
              <Label htmlFor="success" className="text-sm">
                {filters.success === true ? 'Sadece Başarılı' : filters.success === false ? 'Sadece Başarısız' : 'Tümü'}
              </Label>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Filters */}
              <div>
                <Label>Başlangıç Tarihi</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal flex-1",
                          !filters.startedAtFrom && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startedAtFrom ? format(filters.startedAtFrom, "dd/MM/yyyy") : "Başlangıç"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.startedAtFrom}
                        onSelect={(date) => handleFilterChange('startedAtFrom', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal flex-1",
                          !filters.startedAtTo && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startedAtTo ? format(filters.startedAtTo, "dd/MM/yyyy") : "Bitiş"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.startedAtTo}
                        onSelect={(date) => handleFilterChange('startedAtTo', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label>Tamamlanma Tarihi</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal flex-1",
                          !filters.completedAtFrom && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.completedAtFrom ? format(filters.completedAtFrom, "dd/MM/yyyy") : "Başlangıç"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.completedAtFrom}
                        onSelect={(date) => handleFilterChange('completedAtFrom', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal flex-1",
                          !filters.completedAtTo && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.completedAtTo ? format(filters.completedAtTo, "dd/MM/yyyy") : "Bitiş"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.completedAtTo}
                        onSelect={(date) => handleFilterChange('completedAtTo', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Duration Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minDuration">Minimum Süre (saniye)</Label>
                <Input
                  id="minDuration"
                  type="number"
                  placeholder="Min süre..."
                  value={filters.minDuration}
                  onChange={(e) => handleFilterChange('minDuration', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="maxDuration">Maksimum Süre (saniye)</Label>
                <Input
                  id="maxDuration"
                  type="number"
                  placeholder="Max süre..."
                  value={filters.maxDuration}
                  onChange={(e) => handleFilterChange('maxDuration', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Aktif Filtreler</Label>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  <span className="text-xs font-medium">{filter.label}:</span>
                  <span className="text-xs">{filter.value}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleRemoveFilter(filter.key)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};