import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X, 
  RefreshCw 
} from 'lucide-react';
import { HelpTooltip } from '@/components/ui/help-tooltip';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tümü' },
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'INACTIVE', label: 'Pasif' },
  { value: 'DRAFT', label: 'Taslak' },
  { value: 'PAUSED', label: 'Duraklatıldı' },
  { value: 'FAILED', label: 'Başarısız' }
];

export const WorkflowFilters = ({ 
  onFiltersChange, 
  initialFilters = {}, 
  isLoading = false 
}) => {
  const [filters, setFilters] = useState({
    name: '',
    status: 'all',
    minPriority: '',
    maxPriority: '',
    ...initialFilters
  });

  const [localSearchTerm, setLocalSearchTerm] = useState(filters.name || '');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== filters.name) {
        handleFilterChange('name', localSearchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm]);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      name: '',
      status: 'all',
      minPriority: '',
      maxPriority: ''
    };
    setFilters(resetFilters);
    setLocalSearchTerm('');
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'status') return value !== 'all';
    return value !== '' && value !== null && value !== undefined;
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5" />
          Filtreleme ve Arama
          <HelpTooltip content="Workflow'ları farklı kriterlere göre filtreleyebilirsiniz" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Workflow Adı
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Workflow adında ara..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status and Priority Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Durum
            </Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Priority Filter */}
          <div className="space-y-2">
            <Label htmlFor="minPriority" className="text-sm font-medium">
              <div className="flex items-center gap-2">
                Min. Öncelik
                <HelpTooltip content="Minimum öncelik değeri (0-100)" />
              </div>
            </Label>
            <Input
              id="minPriority"
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={filters.minPriority}
              onChange={(e) => handleFilterChange('minPriority', e.target.value)}
            />
          </div>

          {/* Max Priority Filter */}
          <div className="space-y-2">
            <Label htmlFor="maxPriority" className="text-sm font-medium">
              <div className="flex items-center gap-2">
                Maks. Öncelik
                <HelpTooltip content="Maksimum öncelik değeri (0-100)" />
              </div>
            </Label>
            <Input
              id="maxPriority"
              type="number"
              min="0"
              max="100"
              placeholder="100"
              value={filters.maxPriority}
              onChange={(e) => handleFilterChange('maxPriority', e.target.value)}
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4 mr-2" />
                Filtreleri Temizle
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isLoading && (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Filtreleniyor...
              </div>
            )}
            {hasActiveFilters && !isLoading && (
              <div className="text-primary font-medium">
                Filtreler aktif
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};