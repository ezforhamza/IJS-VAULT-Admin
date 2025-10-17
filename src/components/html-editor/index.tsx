import { Textarea } from '@/ui/textarea';
import { Label } from '@/ui/label';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function HtmlEditor({ value, onChange }: HtmlEditorProps) {
  return (
    <div className="space-y-2">
      <Label>HTML Content</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter HTML content..."
        className="min-h-[500px] font-mono text-sm"
      />
    </div>
  );
}
