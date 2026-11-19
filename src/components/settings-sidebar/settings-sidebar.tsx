import { useOptimizeConfig } from "@/lib/store/store-hooks";
import { TitleBarButton, TitleBarRoot } from "../title-bar/title-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  SettingsRoot,
  Setting,
  SettingWrapper,
  SettingIcon,
} from "../setting-root";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
// import { Button } from "../ui/button";
// import {
//   useCompressoFiles,
//   useReoptimize,
// } from "@/lib/store/use-compresso-files";

import { ScrollArea } from "../ui/scroll-area";
import { Md30FpsSelect } from "react-icons/md";

import {
  defaultConfig,
  defaultCRFFraction,
  defaultVideoBitrateKbps,
  maxSpeed,
  minSpeed,
  RateControlMode,
  speedFromNumber,
  speedToNumber,
} from "@/lib/optimizer/types";
import {
  FileIcon,
  GaugeIcon,
  GlobeIcon,
  InfoIcon,
  MicIcon,
  SunMoonIcon,
  TargetIcon,
  Undo2Icon,
  ZapIcon,
} from "lucide-react";
import { useTheme } from "../theme-provider";
import {
  SmallSlider,
  SmallSliderLabel,
  SmallSliderLabels,
  SmallSliderRoot,
} from "../small-slider";
import { Separator } from "../ui/separator";

export const SettingsSidebar = () => {
  const { resetConfig } = useOptimizeConfig();

  return (
    <>
      <div className="bg-foreground/3">
        <TitleBarRoot>
          <TitleBarButton title="恢复默认" onClick={resetConfig}>
            <Undo2Icon className="w-4 h-4" />
          </TitleBarButton>
          <a href="https://docs.compresso.app/settings" target="_blank">
            <TitleBarButton title="设置说明">
              <InfoIcon className="w-4 h-4" />
            </TitleBarButton>
          </a>
        </TitleBarRoot>
      </div>
      <ScrollArea className="flex  h-full flex-col text-sm border-r bg-foreground/3 px-2">
        <SettingsRoot>
          <AppearanceSetting />
          <SettingsSeparator />

          <RateControlSettings />
          <SpeedSetting />

          <SettingsSeparator />

          <FileFormatSettings />
          <WebStreamableSetting />

          <SettingsSeparator />

          <MaxFramerateSetting />
          <DownscaleSetting />
          <VideoSpeedSetting />
          <RemoveAudioSetting />
          <PreserveMetadataSetting />
          <TargetSizeSetting />
        </SettingsRoot>

        {/* <RecompressFiles /> */}

        <div className="h-20" />

        {/* uncomment to show ffmpeg command */}
        {/* {isDev() && (
          <div className="text-xs opacity-50">
            <DebugCommand />
          </div>
        )} */}
      </ScrollArea>
    </>
  );
};

const TargetSizeSetting = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();
  const targetMb = optimizeConfig.targetSizeBytes
    ? optimizeConfig.targetSizeBytes / 1024 / 1024
    : undefined;
  const [targetSizeMb, setTargetSizeMb] = useState(targetMb ?? 20);

  const handleEnabledChange = (nextEnabled: boolean) => {
    setOptimizeConfig({
      ...optimizeConfig,
      useTargetSize: nextEnabled,
    });
  };

  const handleChange = (nextTargetSizeMb: number) => {
    if (nextTargetSizeMb < 0.1) {
      nextTargetSizeMb = 0.1;
    }
    setTargetSizeMb(nextTargetSizeMb);
    setOptimizeConfig({
      ...optimizeConfig,
      targetSizeBytes: nextTargetSizeMb * 1024 * 1024,
    });
  };

  const isEnabled = optimizeConfig.useTargetSize ? true : false;

  return (
    <SettingWrapper>
      <SettingIcon>
        <TargetIcon className="w-3 h-3" />
      </SettingIcon>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Switch
            variant="small"
            id="enable-targetsize"
            checked={isEnabled}
            onCheckedChange={handleEnabledChange}
          />
          <Label className=" font-normal" htmlFor="enable-targetsize">
            Limit file size
          </Label>
        </div>

        {isEnabled && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 relative">
              <div className="absolute left-3 opacity-50 text-xs pointer-events-none">
                上限
              </div>
              <Input
                type="number"
                className="text-right pr-2"
                value={targetSizeMb}
                step={1}
                onChange={(e) => handleChange(e.target.valueAsNumber)}
              />
              <span>MB</span>
            </div>
            <div className="text-xs opacity-50">
              通过码率让文件接近该大小。{" "}
              <a
                href="https://docs.compresso.app/guide/set-max-file-size"
                target="_blank"
                className="underline"
              >
                了解更多
              </a>
            </div>
          </div>
        )}
      </div>
    </SettingWrapper>
  );
};

// const DebugCommand = () => {
//   const { optimizeConfig } = useOptimizeConfig();

//   const command = useMemo(() => {
//     return createFFmpegCommand({
//       inputFilePath: "path/to/input/file",
//       outputPath: "path/to/output/file",
//       config: optimizeConfig,
//       watermarkPath: null,
//     });
//   }, [optimizeConfig]);

//   return (
//     <Input
//       type="text"
//       className="text-xs opacity-50 select-text"
//       value={command.join(" ")}
//     />
//   );
// };

const AppearanceSetting = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = (nextTheme: string) => {
    if (!nextTheme) return;
    setTheme(nextTheme as "dark" | "light" | "system");
  };

  const itemClass = (selected: boolean, extra = "") =>
    cn(
      "bg-control m-0 flex justify-center h-[2em] items-center data-[state=on]:bg-selection data-[state=off]:hover:bg-foreground/5 data-[state=on]:hover:bg-selection data-[state=on]:text-white data-[state=on]:font-bold data-[state=off]:text-foreground/80 p-0 w-full",
      extra,
      selected ? "bg-selection" : ""
    );

  return (
    <div>
      <div className="flex items-center space-x-2 justify-between">
        <div className="flex items-center gap-2">
          <SunMoonIcon className="w-3 h-3 opacity-30" />
          <div>外观</div>
        </div>
      </div>
      <ToggleGroup
        type="single"
        value={theme}
        className="w-full grid grid-cols-3 mt-2 gap-0"
        onValueChange={handleChange}
      >
        <ToggleGroupItem value="light" className={itemClass(theme === "light", "rounded-l-md")}>
          浅色
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" className={itemClass(theme === "dark")}>
          深色
        </ToggleGroupItem>
        <ToggleGroupItem value="system" className={itemClass(theme === "system", "rounded-r-md")}>
          跟随系统
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

const SettingsSeparator = () => {
  return <Separator className="bg-foreground/5 -mx-2 w-[calc(100%+1rem)]" />;
};

// TODO: Find a good way ROT-872
// const OverwriteSetting = () => {
//   const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();

//   const handleChange = (overwrite: boolean) => {
//     setOptimizeConfig({
//       ...optimizeConfig,
//       overwrite,
//     });
//   };
//   return (
//     <div className="flex items-center space-x-2">
//       <Switch
//         id="overwrite"
//         checked={optimizeConfig.overwrite}
//         onCheckedChange={handleChange}
//       />
//       <Label className=" font-normal" htmlFor="overwrite">
//         Overwrite existing files
//       </Label>
//     </div>
//   );
// };

export const PreserveMetadataSetting = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();

  const handleChange = (preserveMetadata: boolean) => {
    setOptimizeConfig({
      ...optimizeConfig,
      preserveMetadata,
    });
  };

  // it's a switch that toggles the -map_metadata 0 flag
  return (
    <SettingWrapper>
      <SettingIcon>
        <FileIcon className="w-3 h-3" />
      </SettingIcon>
      <Switch
        variant="small"
        id="preserve-metadata"
        checked={optimizeConfig.preserveMetadata}
        onCheckedChange={handleChange}
      />
      <Label className=" font-normal" htmlFor="preserve-metadata">
        Preserve metadata
      </Label>
    </SettingWrapper>
  );
};

export const SpeedSetting = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();
  const handleChange = (nextSpeed: number[]) => {
    setOptimizeConfig({
      ...optimizeConfig,
      speed: speedFromNumber(nextSpeed[0]),
    });
  };

  return (
    <Setting>
      {/* <SettingTitle>Speed</SettingTitle> */}

      <div className="flex justify-evenly items-end gap-3 ">
        <SmallSliderRoot>
          <SmallSliderLabels>
            <SmallSliderLabel>更快</SmallSliderLabel>
            <SmallSliderLabel>更好</SmallSliderLabel>
          </SmallSliderLabels>

          <SmallSlider
            min={minSpeed}
            max={maxSpeed}
            step={1}
            value={[
              speedToNumber(
                optimizeConfig.speed ?? defaultConfig.speed ?? "veryfast"
              ),
            ]}
            onValueChange={handleChange}
            aria-label="编码速度"
          />
        </SmallSliderRoot>
        <BoostSetting />
      </div>
    </Setting>
  );
};

export const BoostSetting = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();

  const handleChange = (boost: boolean) => {
    setOptimizeConfig({
      ...optimizeConfig,
      threadCount: boost ? undefined : 1,
    });
  };

  const isOn = optimizeConfig.threadCount === undefined;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Toggle
            pressed={isOn}
            onPressedChange={handleChange}
            className={cn(
              ` flex items-center gap-2 data-[state=off]:border-foreground/10
            border
            data-[state=on]:border-blue-500
             h-8 
             data-[state=on]:text-white data-[state=on]:fill-white
  data-[state=on]:bg-gradient-to-r from-blue-500 to-blue-700
  dark:data-[state=on]:shadow-[0_0_10px_0_rgba(0,0,255,1.5)]
  data-[state=off]:hover:text-foreground
  `,
              isOn && "text-white"
            )}
            asChild
          >
            <div>
              <ZapIcon
                className={cn(
                  "w-4 h-4 fill-foreground text-foreground",
                  isOn && "fill-white text-white "
                )}
              />
              <span className="">加速</span>
            </div>
          </Toggle>
        </TooltipTrigger>
        <TooltipContent asChild>
          <div className="text-xs max-w-[200px]">
            使用更多 CPU 核心来加快压缩速度。
            压缩期间其他应用可能会变卡。
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const RemoveAudioSetting = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();

  const handleChange = (keepAudio: boolean) => {
    setOptimizeConfig({
      ...optimizeConfig,
      removeAudio: !keepAudio,
    });
  };
  return (
    <SettingWrapper>
      <SettingIcon>
        <MicIcon className="w-3 h-3" />
      </SettingIcon>
      <Switch
        variant="small"
        id="keep-audio"
        checked={!optimizeConfig.removeAudio}
        onCheckedChange={handleChange}
      />
      <Label className=" font-normal" htmlFor="keep-audio">
        Keep audio
      </Label>
    </SettingWrapper>
  );
};


export const WebStreamableSetting = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();

  const handleChange = (webStreamable: boolean) => {
    setOptimizeConfig({
      ...optimizeConfig,
      webStreamable,
    });
  };

  return (
    <SettingWrapper>
      <SettingIcon>
        <GlobeIcon className="w-3 h-3" />
      </SettingIcon>
      <Switch
        variant="small"
        id="web-streamable"
        checked={optimizeConfig.webStreamable}
        onCheckedChange={handleChange}
      />
      <Label className=" font-normal" htmlFor="web-streamable">
        Web stream-friendly
      </Label>
    </SettingWrapper>
  );
};


import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";

const RateControlSettings = () => {
  const { optimizeConfig } = useOptimizeConfig();
  const mode =
    optimizeConfig.rateControlMode ?? defaultConfig.rateControlMode ?? "crf";
  const usesTargetSize = !!optimizeConfig.useTargetSize;

  return (
    <>
      <RateControlModeSetting disabled={usesTargetSize} />
      {usesTargetSize ? (
        <AutoTargetSizeQualitySetting />
      ) : mode === "bitrate" ? (
        <BitrateSetting />
      ) : (
        <CRFSetting />
      )}
    </>
  );
};

const RateControlModeSetting = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();
  const mode = disabled
    ? "bitrate"
    : optimizeConfig.rateControlMode ?? defaultConfig.rateControlMode ?? "crf";

  const handleChange = (nextMode: string) => {
    if (disabled || !nextMode) return;

    setOptimizeConfig({
      ...optimizeConfig,
      rateControlMode: nextMode as RateControlMode,
    });
  };

  return (
    <div>
      <div className="flex items-center space-x-2 justify-between">
        <div>模式</div>
      </div>

      <ToggleGroup
        type="single"
        value={mode}
        className={cn(
          "w-full grid grid-cols-2 mt-2 gap-0",
          disabled && "opacity-50"
        )}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <ToggleGroupItem
          value="crf"
          className={cn(
            "bg-control m-0 flex justify-center h-[2em] items-center rounded-l-md data-[state=on]:bg-selection data-[state=off]:hover:bg-foreground/5 data-[state=on]:hover:bg-selection data-[state=on]:text-white data-[state=on]:font-bold data-[state=off]:text-foreground/80 p-0 w-full",
            mode === "crf" ? "bg-selection" : ""
          )}
        >
          画质
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bitrate"
          className={cn(
            "bg-control m-0 flex justify-center h-[2em] items-center rounded-r-md data-[state=on]:bg-selection data-[state=off]:hover:bg-foreground/5 data-[state=on]:hover:bg-selection data-[state=on]:text-white data-[state=on]:font-bold data-[state=off]:text-foreground/80 p-0 w-full",
            mode === "bitrate" ? "bg-selection" : ""
          )}
        >
          码率
        </ToggleGroupItem>
      </ToggleGroup>
      {disabled && (
        <div className="text-xs opacity-50 mt-2">限制文件大小时自动</div>
      )}
    </div>
  );
};

const AutoTargetSizeQualitySetting = () => {
  return (
    <Setting>
      <div className="flex justify-between items-center opacity-50">
        <div>画质</div>
        <div className="text-xs">限制文件大小时自动</div>
      </div>
    </Setting>
  );
};

const BitrateSetting = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();
  const bitrateKbps =
    optimizeConfig.videoBitrateKbps ?? defaultVideoBitrateKbps;

  const handleChange = (nextBitrate: number[]) => {
    setOptimizeConfig({
      ...optimizeConfig,
      videoBitrateKbps: nextBitrate[0],
    });
  };

  return (
    <Setting>
      <div className="flex justify-between items-center">
        <div>视频码率</div>
        <div className="text-xs opacity-50 font-mono">
          {(bitrateKbps / 1000).toFixed(2)} Mbps
        </div>
      </div>

      <SmallSliderRoot>
        <SmallSliderLabels>
          <SmallSliderLabel>更小</SmallSliderLabel>
          <SmallSliderLabel>更清晰</SmallSliderLabel>
        </SmallSliderLabels>

        <SmallSlider
          min={500}
          max={10000}
          step={250}
          value={[bitrateKbps]}
          onValueChange={handleChange}
          aria-label="视频码率"
        />
      </SmallSliderRoot>
    </Setting>
  );
};

export const CRFSetting = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();

  const options = [
    { value: 0.1, label: "体积最小" },
    { value: 0.3, label: "够用" },
    { value: defaultCRFFraction, label: "推荐" },
    { value: 0.5, label: "几乎看不出损失" },
    { value: 0.6, label: "高质量、体积大" },
    { value: 0.9, label: "接近无损" },
  ];

  const handleChange = (selection: string) => {
    const selectedOption = options.find(
      (option) => option.value.toString() === selection
    );
    if (selectedOption) {
      setOptimizeConfig({
        ...optimizeConfig,
        crfFraction: selectedOption.value,
      });
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 justify-between">
        <div>画质</div>
      </div>

      <div className="text-xs opacity-50">
        {
          options.find((option) => option.value === optimizeConfig.crfFraction)
            ?.label
        }
      </div>

      <ToggleGroup
        type="single"
        value={
          optimizeConfig.crfFraction?.toString() ??
          defaultCRFFraction.toString()
        }
        className="w-full flex justify-evenly mt-2 gap-0 items-start"
        onValueChange={handleChange}
      >
        {options.map((option, index) => (
          <ToggleGroupItem
            key={index}
            value={option.value.toString()}
            className={cn(
              index === 0 && "rounded-l-md",
              index === options.length - 1 && "rounded-r-md",
              index > 0 && index < options.length - 1 && "",
              `
             bg-control
             m-0 flex justify-center 
              h-[2em]
             items-center 
             group
             data-[state=on]:bg-selection
             data-[state=off]:hover:bg-foreground/5
             data-[state=on]:hover:bg-selection
             data-[state=on]:text-white
             data-[state=on]:font-bold
             
             data-[state=off]:text-foreground/80
             p-0 w-full
                `,
              option.value === optimizeConfig.crfFraction ? "bg-selection" : ""
            )}
          >
            <div
              className="rounded
            hover:bg-foreground/5 
            "
            >
              {index + 1}
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

const FileFormatSettings = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();

  const handleChange = (format: string) => {
    setOptimizeConfig({
      ...optimizeConfig,
      formats: [format],
    });
  };

  return (
    <SettingWrapper>
      <SettingIcon>
        <FileIcon className="w-3 h-3" />
      </SettingIcon>
      <Select value={optimizeConfig.formats[0]} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择文件格式" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mp4">MP4 格式</SelectItem>
          <SelectItem value="webm">WebM 格式</SelectItem>
        </SelectContent>
      </Select>
    </SettingWrapper>
  );
};

import { useState } from "react";
import { cn } from "@/lib/utils";
// import { isDev } from "@/lib/reset-compresso";
// import { createFFmpegCommand } from "@/lib/optimizer/create-ffmpeg-command";

import { Toggle } from "../ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Input } from "../ui/input";
import { DownscaleSetting } from "./downscale-setting";
import { NumericSettingControl } from "./numeric-setting-control";

const VideoSpeedSetting = () => (
  <SettingWrapper>
    <SettingIcon>
      <GaugeIcon className="w-3 h-3" />
    </SettingIcon>
    <NumericSettingControl setting="speedFraction" />
  </SettingWrapper>
);

const MaxFramerateSetting = () => (
  <SettingWrapper>
    <SettingIcon>
      <Md30FpsSelect />
    </SettingIcon>
    <NumericSettingControl setting="maxFramerate" />
  </SettingWrapper>
);

export {
  DownscaleSetting as DownscaleFractionSetting,
  VideoSpeedSetting,
  MaxFramerateSetting,
  FileFormatSettings,
};
