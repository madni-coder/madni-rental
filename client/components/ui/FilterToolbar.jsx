import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function FilterToolbar({ search, onSearch, filters = [] }) {
  return (
    <div className="flex gap-3 items-center mb-4">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          placeholder="Search…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 bg-card border-border h-8 text-sm"
        />
      </div>

      {/* Dynamic filter selects */}
      {filters.map((f) => (
        <Select key={f.key} value={f.value} onValueChange={f.onChange}>
          <SelectTrigger className="w-36 h-8 text-sm bg-card border-border">
            <SelectValue placeholder={f.placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {f.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-sm">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
