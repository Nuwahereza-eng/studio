import { Droplets } from 'lucide-react'; // Using Droplets as a milk-related icon

export const Logo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 text-lg font-semibold ${className}`}>
    <Droplets className="h-7 w-7 text-primary" />
    <span>DairyConnect</span>
  </div>
);
