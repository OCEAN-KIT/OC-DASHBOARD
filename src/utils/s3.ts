/**
 * 서버에 저장된 S3 "key"를 브라우저에서 접근 가능한 절대 URL로 변환.
 * - 이미 http(s)로 시작하면 그대로 반환
 * - 그 외에는 NEXT_PUBLIC_S3_PUBLIC_BASE + key 형태로 합성
 */
export const keyToPublicUrl = (key: string): string => {
  const rawKey = String(key || "");
  if (!rawKey) return "";
  if (/^https?:\/\//i.test(rawKey)) return rawKey;

  const s3Base = (process.env.NEXT_PUBLIC_S3_PUBLIC_BASE || "").replace(
    /\/+$/,
    ""
  );
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
    /\/+$/,
    ""
  );
  const cleanKey = rawKey.replace(/^\/+/, "");
  const base = s3Base || apiBase;
  return base ? `${base}/${cleanKey}` : `/${cleanKey}`;
};
