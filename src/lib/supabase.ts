import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ============================================================
// 服务端 Supabase 客户端（用于 Server Components 和 API Routes）
// 使用简单客户端，不需要 cookie 处理（本站无需用户登录）
// ============================================================
export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// ============================================================
// 浏览器端 Supabase 客户端（用于 Client Components）
// ============================================================
export function createBrowserSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
