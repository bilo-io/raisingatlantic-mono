
"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DirectoryExplorerToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  className?: string;
}

export function DirectoryExplorerToolbar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  viewMode,
  onViewModeChange,
  actions,
  filters,
  className
}: DirectoryExplorerToolbarProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full flex-1">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-8 w-full sm:w-[250px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {filters}
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant={viewMode === 'list' ? 'default' : 'outline'} 
          size="icon" 
          onClick={() => onViewModeChange('list')} 
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant={viewMode === 'grid' ? 'default' : 'outline'} 
          size="icon" 
          onClick={() => onViewModeChange('grid')} 
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        {actions}
      </div>
    </div>
  );
}
