import { CornerRightUp, ZapIcon } from "lucide-react";
import { useAccess } from "../auth/use-access";
import { Switch } from "../ui/switch";
import { useRemoveWatermarkLink } from "../title-bar/preview-title-bar";

export const WatermarkSwitch = () => {
  const { hasPaid } = useAccess();
  const { watermarkLink } = useRemoveWatermarkLink("ws");

  if (!watermarkLink) return null;

  if (hasPaid) return null;

  return (
    <div className="  w-full flex justify-end -mt-7" style={{ zIndex: 100 }}>
      <div className="bg-stone-950 text-white rounded-full p-5 border border-stone-800">
        <a
          href={watermarkLink}
          target="_blank"
          className="flex items-center gap-2 justify-center"
        >
          {/* <ArrowUpIcon className="w-6 h-6 fill-foreground animate-bounce" /> */}
          <Switch checked={true} />
          Watermark
          <CornerRightUp className="w-4 h-4 opacity-50" />
          {/* <ZapIcon className="w-3 h-3 fill-foreground opacity-50 animate-bounce" /> */}
          <ProBadge />
        </a>
      </div>
    </div>
  );
};

const ProBadge = () => {
  return (
    <div
      className="flex items-center gap-2 
          uppercase text-bold text-[0.7rem] font-bold    
          bg-foreground/5 text-white rounded-full px-2 py-1"
    >
      {/* <div>Pro</div> */}
      <ZapIcon className="w-3 h-3 fill-foreground" />
    </div>
  );
};
