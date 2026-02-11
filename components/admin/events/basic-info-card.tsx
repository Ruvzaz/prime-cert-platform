import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BasicInfoCardProps {
  formData: {
    name: string;
    slug: string;
    theme_color: string;
  };
  setFormData: (data: any) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BasicInfoCard({
  formData,
  setFormData,
  onNameChange,
}: BasicInfoCardProps) {
  return (
    <Card className="shadow-sm border border-slate-200 overflow-hidden p-0 rounded-2xl">
      <CardHeader className="bg-slate-50/80 border-b px-6 !py-3 items-center">
        <div className="flex items-center h-8">
          <CardTitle className="text-base font-semibold text-slate-800 leading-normal">
            1. ข้อมูลทั่วไป (Basic Info)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-5 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">ชื่องาน (Event Name)</Label>
          <Input
            id="name"
            placeholder="เช่น Annual Party 2026"
            value={formData.name}
            onChange={onNameChange}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug (Auto)</Label>
          <Input
            id="slug"
            value={formData.slug}
            readOnly
            className="bg-slate-50 text-slate-500 cursor-not-allowed h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">สีธีมหลัก (Theme Color)</Label>
          <div className="flex gap-3">
            <div className="relative">
              <Input
                type="color"
                className="w-16 h-11 p-1 cursor-pointer absolute opacity-0 z-10"
                value={formData.theme_color}
                onChange={(e) =>
                  setFormData({ ...formData, theme_color: e.target.value })
                }
              />
              <div
                className="w-16 h-11 rounded-md border border-slate-200 shadow-sm"
                style={{ backgroundColor: formData.theme_color }}
              />
            </div>
            <Input
              value={formData.theme_color}
              onChange={(e) =>
                setFormData({ ...formData, theme_color: e.target.value })
              }
              className="uppercase font-mono h-11"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
