import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

interface AssetsCardProps {
  previewPoster: string | null;
  previewLogo: string | null;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "poster" | "logo"
  ) => void;
}

export function AssetsCard({
  previewPoster,
  previewLogo,
  onFileChange,
}: AssetsCardProps) {
  return (
    <Card className="shadow-sm border border-slate-200 overflow-hidden p-0 rounded-2xl">
      <CardHeader className="bg-slate-50/80 border-b px-6 !py-3 items-center">
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 h-auto md:h-8">
          <CardTitle className="text-base font-semibold text-slate-800 leading-normal">
            2. รูปภาพประกอบ (Assets)
          </CardTitle>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-slate-300 h-4 border-l border-slate-300"></span>
            <span className="text-sm text-slate-500 font-normal">
              อัปโหลดรูปภาพที่จะแสดงบนหน้าดาวน์โหลด
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-5 space-y-8">
        {/* Poster Upload */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-slate-700">
            รูป Poster (แนวนอน 16:9)
          </Label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50/50 hover:border-slate-300 transition-all relative group cursor-pointer bg-slate-50/30">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, "poster")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {previewPoster ? (
              <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-sm border">
                <img
                  src={previewPoster}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium bg-black/50 px-3 py-1.5 rounded-full text-sm">
                    คลิกเพื่อเปลี่ยนรูป
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400 py-4">
                <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                  <ImagePlus className="h-8 w-8 text-slate-300" />
                </div>
                <span className="text-sm font-medium text-slate-600">
                  คลิกเพื่ออัปโหลดรูปภาพ
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  รองรับ JPG, PNG (Max 5MB)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-slate-700">
            รูป Logo องค์กร (พื้นใส PNG)
          </Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl border bg-slate-50/30">
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl w-32 h-32 flex items-center justify-center hover:bg-white transition-all bg-white flex-shrink-0">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => onFileChange(e, "logo")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Logo"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center">
                  <ImagePlus className="h-6 w-6 text-slate-300 mx-auto" />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Upload
                  </span>
                </div>
              )}
            </div>
            <div className="text-sm text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">คำแนะนำ</p>
              <ul className="list-disc list-inside text-slate-500 text-xs space-y-0.5 ml-1">
                <li>ควรใช้ไฟล์ .PNG พื้นหลังโปร่งใส</li>
                <li>ขนาดอย่างน้อย 200x200 px</li>
                <li>ขนาดไฟล์ไม่เกิน 2MB</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
