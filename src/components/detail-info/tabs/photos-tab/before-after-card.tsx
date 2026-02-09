import Image from "next/image";
import { keyToPublicUrl } from "@/utils/s3";

type Props = {
  beforeUrl: string;
  afterUrl: string;
};

export default function BeforeAfterCard({ beforeUrl, afterUrl }: Props) {
  const hasData = beforeUrl || afterUrl;

  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-[11px] text-white/50">복원 전 / 후</h3>
        <span className="text-[10px] text-white/30">동일 지점 기준 비교</span>
      </div>

      {hasData ? (
        <div className="grid grid-cols-2 gap-3">
          <PhotoSlot url={beforeUrl} label="복원 전" />
          <PhotoSlot url={afterUrl} label="복원 후" />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-white/40">
          사진 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}

function PhotoSlot({ url, label }: { url: string; label: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden bg-black/80 flex items-center justify-center aspect-[4/3]">
      {url ? (
        <Image
          src={keyToPublicUrl(url)}
          alt={label}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, 450px"
        />
      ) : (
        <span className="text-[11px] text-white/30">사진 없음</span>
      )}
      <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80 bg-black/50 px-2 py-0.5 rounded">
        {label}
      </span>
    </div>
  );
}
