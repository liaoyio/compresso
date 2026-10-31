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
        property="Codec"
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
        property="Width"
        originalValue={originalStream.width}
        compressedValue={compressedStream.width}
        unit="px"
      />
      <ComparisonRow
        property="Height"
        originalValue={originalStream.height}
        compressedValue={compressedStream.height}
        unit="px"
      />
      <ComparisonRow
        property="Pixel Format"
        originalValue={originalStream.pix_fmt}
        compressedValue={compressedStream.pix_fmt}
        unit=""
      />
      <ComparisonRow
        property="Bit Rate"
        originalValue={originalStream.bit_rate}
        compressedValue={compressedStream.bit_rate}
        unit="bps"
      />
      <ComparisonRow
        property="Frame Rate"
        originalValue={originalStream.r_frame_rate}
        compressedValue={compressedStream.r_frame_rate}
        unit="fps"
      />
      <ComparisonRow
        property="Color Range"
        originalValue={originalStream.color_range}
        compressedValue={compressedStream.color_range}
        unit=""
      />
      <ComparisonRow
        property="Color Space"
        originalValue={originalStream.color_space}
        compressedValue={compressedStream.color_space}
        unit=""
      />
      <ComparisonRow
        property="Color Transfer"
        originalValue={originalStream.color_transfer}
        compressedValue={compressedStream.color_transfer}
        unit=""
      />
      <ComparisonRow
        property="Color Primaries"
        originalValue={originalStream.color_primaries}
        compressedValue={compressedStream.color_primaries}
        unit=""
      />
      <ComparisonRow
        property="Chroma Location"
        originalValue={originalStream.chroma_location}
        compressedValue={compressedStream.chroma_location}
        unit=""
      />
      <ComparisonRow
        property="Field Order"
        originalValue={originalStream.field_order}
        compressedValue={compressedStream.field_order}
        unit=""
      />
      <ComparisonRow
        property="References"
        originalValue={originalStream.refs}
        compressedValue={compressedStream.refs}
        unit=""
      />
      <ComparisonRow
        property="Sample Format"
        originalValue={originalStream.sample_fmt}
        compressedValue={compressedStream.sample_fmt}
        unit=""
      />
      <ComparisonRow
        property="Sample Rate"
        originalValue={originalStream.sample_rate}
        compressedValue={compressedStream.sample_rate}
        unit="Hz"
      />
      <ComparisonRow
        property="Channels"
        originalValue={originalStream.channels}
        compressedValue={compressedStream.channels}
        unit=""
      />
      <ComparisonRow
        property="Channel Layout"
        originalValue={originalStream.channel_layout}
        compressedValue={compressedStream.channel_layout}
        unit=""
      />
      <ComparisonRow
        property="Bits Per Sample"
        originalValue={originalStream.bits_per_sample}
        compressedValue={compressedStream.bits_per_sample}
        unit="bits"
      />
      <ComparisonRow
        property="Initial Padding"
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
        property="Average Frame Rate"
        originalValue={originalStream.avg_frame_rate}
        compressedValue={compressedStream.avg_frame_rate}
        unit="fps"
      />
      <ComparisonRow
        property="Time Base"
        originalValue={originalStream.time_base}
        compressedValue={compressedStream.time_base}
        unit=""
      />
      <ComparisonRow
        property="Start PTS"
        originalValue={originalStream.start_pts}
        compressedValue={compressedStream.start_pts}
        unit=""
      />
      <ComparisonRow
        property="Start Time"
        originalValue={originalStream.start_time}
        compressedValue={compressedStream.start_time}
        unit="s"
      />
      {/* <ComparisonRow
        property="Duration (TS)"
        originalValue={originalStream.duration_ts}
        compressedValue={compressedStream.duration_ts}
        unit=""
      /> */}
      <ComparisonRow
        property="Duration"
        originalValue={originalStream.duration}
        compressedValue={compressedStream.duration}
        unit="s"
      />
      <ComparisonRow
        property="Max Bit Rate"
        originalValue={originalStream.max_bit_rate}
        compressedValue={compressedStream.max_bit_rate}
        unit="bps"
      />
      <ComparisonRow
        property="Bits Per Raw Sample"
        originalValue={originalStream.bits_per_raw_sample}
        compressedValue={compressedStream.bits_per_raw_sample}
        unit="bits"
      />
      <ComparisonRow
        property="Number of Frames"
        originalValue={originalStream.nb_frames}
        compressedValue={compressedStream.nb_frames}
        unit=""
      />
      <ComparisonRow
        property="Number of Read Frames"
        originalValue={originalStream.nb_read_frames}
        compressedValue={compressedStream.nb_read_frames}
        unit=""
      />
      <ComparisonRow
        property="Number of Read Packets"
        originalValue={originalStream.nb_read_packets}
        compressedValue={compressedStream.nb_read_packets}
        unit=""
      />

      <ComparisonRow
        property="Dispositions"
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
        property="Tags"
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
