export interface Event {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  theme_color: string;
  poster_url: string | null;
  logo_url: string | null;
  storage_bucket_url: string; // URL หลักของ R2 เช่น https://pub-xxx.r2.dev
}

export interface Certificate {
  id: string;
  created_at: string;
  event_id: string;
  user_identifier: string; // รหัสพนักงาน
  user_name: string; // ชื่อผู้รับ
  filename: string; // ชื่อไฟล์ .pdf
}
