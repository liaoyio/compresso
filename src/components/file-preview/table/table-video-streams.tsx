import { Subtable, ComparisonRow } from "./table-primitives";
import { StreamType } from "@/lib/probe/probe-type";

export const TableStream = ({
  originalStream,
  compressedStream,
}: {
  originalStream: StreamType;
  compressedStream: StreamType;
}) => {
  return (
    <Subtable>
      <ComparisonRow
        property="编码格式"
        originalValue={originalStream.codec_name}
        compressedValue={compressedStream.codec_name}
        unit=""
      />
      <ComparisonRow
        property="Profile"
        originalValue={originalStream.profile}
        compressedValue={compressedStream.profile}
        unit=""
      />
      <ComparisonRow
        property="宽度"
        originalValue={originalStream.width}
        compressedValue={compressedStream.width}
        unit="px"
      />
      <ComparisonRow
        property="高度"
        originalValue={originalStream.height}
        compressedValue={compressedStream.height}
        unit="px"
      />
      <ComparisonRow
        property="像素格式"
        originalValue={originalStream.pix_fmt}
        compressedValue={compressedStream.pix_fmt}
        unit=""
      />
      <ComparisonRow
        property="码率"
        originalValue={originalStream.bit_rate}
        compressedValue={compressedStream.bit_rate}
        unit="bps"
      />
      <ComparisonRow
        property="帧率"
        originalValue={originalStream.r_frame_rate}
        compressedValue={compressedStream.r_frame_rate}
        unit="fps"
      />
      <ComparisonRow
        property="色彩范围"
        originalValue={originalStream.color_range}
        compressedValue={compressedStream.color_range}
        unit=""
      />
      <ComparisonRow
        property="色彩空间"
        originalValue={originalStream.color_space}
        compressedValue={compressedStream.color_space}
        unit=""
      />
      <ComparisonRow
        property="色彩传递"
        originalValue={originalStream.color_transfer}
        compressedValue={compressedStream.color_transfer}
        unit=""
      />
      <ComparisonRow
        property="色彩原色"
        originalValue={originalStream.color_primaries}
        compressedValue={compressedStream.color_primaries}
        unit=""
      />
      <ComparisonRow
        property="色度位置"
        originalValue={originalStream.chroma_location}
        compressedValue={compressedStream.chroma_location}
        unit=""
      />
      <ComparisonRow
        property="场序"
        originalValue={originalStream.field_order}
        compressedValue={compressedStream.field_order}
        unit=""
      />
      <ComparisonRow
        property="参考帧数"
        originalValue={originalStream.refs}
        compressedValue={compressedStream.refs}
        unit=""
      />
      <ComparisonRow
        property="采样格式"
        originalValue={originalStream.sample_fmt}
        compressedValue={compressedStream.sample_fmt}
        unit=""
      />
      <ComparisonRow
        property="采样率"
        originalValue={originalStream.sample_rate}
        compressedValue={compressedStream.sample_rate}
        unit="Hz"
      />
      <ComparisonRow
        property="声道数"
        originalValue={originalStream.channels}
        compressedValue={compressedStream.channels}
        unit=""
      />
      <ComparisonRow
        property="声道布局"
        originalValue={originalStream.channel_layout}
        compressedValue={compressedStream.channel_layout}
        unit=""
      />
      <ComparisonRow
        property="采样位深"
        originalValue={originalStream.bits_per_sample}
        compressedValue={compressedStream.bits_per_sample}
        unit="bits"
      />
      <ComparisonRow
        property="初始填充"
        originalValue={originalStream.initial_padding}
        compressedValue={compressedStream.initial_padding}
        unit=""
      />
      <ComparisonRow
        property="ID"
        originalValue={originalStream.id}
        compressedValue={compressedStream.id}
        unit=""
      />

      <ComparisonRow
        property="平均帧率"
        originalValue={originalStream.avg_frame_rate}
        compressedValue={compressedStream.avg_frame_rate}
        unit="fps"
      />
      <ComparisonRow
        property="时间基"
        originalValue={originalStream.time_base}
        compressedValue={compressedStream.time_base}
        unit=""
      />
      <ComparisonRow
        property="起始 PTS"
        originalValue={originalStream.start_pts}
        compressedValue={compressedStream.start_pts}
        unit=""
      />
      <ComparisonRow
        property="起始时间"
        originalValue={originalStream.start_time}
        compressedValue={compressedStream.start_time}
        unit="s"
      />
      {/* <ComparisonRow
        property="时长 (TS)"
        originalValue={originalStream.duration_ts}
        compressedValue={compressedStream.duration_ts}
        unit=""
      /> */}
      <ComparisonRow
        property="时长"
        originalValue={originalStream.duration}
        compressedValue={compressedStream.duration}
        unit="s"
      />
      <ComparisonRow
        property="最大码率"
        originalValue={originalStream.max_bit_rate}
        compressedValue={compressedStream.max_bit_rate}
        unit="bps"
      />
      <ComparisonRow
        property="原始采样位深"
        originalValue={originalStream.bits_per_raw_sample}
        compressedValue={compressedStream.bits_per_raw_sample}
        unit="bits"
      />
      <ComparisonRow
        property="帧数"
        originalValue={originalStream.nb_frames}
        compressedValue={compressedStream.nb_frames}
        unit=""
      />
      <ComparisonRow
        property="已读取帧数"
        originalValue={originalStream.nb_read_frames}
        compressedValue={compressedStream.nb_read_frames}
        unit=""
      />
      <ComparisonRow
        property="已读取数据包数"
        originalValue={originalStream.nb_read_packets}
        compressedValue={compressedStream.nb_read_packets}
        unit=""
      />

      <ComparisonRow
        property="流标记"
        originalValue={Object.entries(originalStream.disposition || {})
          .filter(([_, value]) => value === 1 || value === 0)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")}
        compressedValue={Object.entries(compressedStream.disposition || {})
          .filter(([_, value]) => value === 1 || value === 0)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")}
        unit=""
      />

      <ComparisonRow
        property="标签"
        originalValue={Object.entries(originalStream.tags || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")}
        compressedValue={Object.entries(compressedStream.tags || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")}
        unit=""
      />
    </Subtable>
  );
};
