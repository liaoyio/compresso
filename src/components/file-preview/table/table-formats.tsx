import { Subtable, ComparisonRow } from "./table-primitives";

export const TableFormats = ({
  originalFormat,
  compressedFormat,
}: {
  originalFormat: any;
  compressedFormat: any;
}) => {
  return (
    <Subtable>
      <ComparisonRow
        property="Size"
        originalValue={originalFormat?.size}
        compressedValue={compressedFormat?.size}
        unit="bytes"
      />
      <ComparisonRow
        property="Duration"
        originalValue={originalFormat?.duration}
        compressedValue={compressedFormat?.duration}
        unit="s"
      />
      <ComparisonRow
        property="Format"
        originalValue={originalFormat?.format_long_name}
        compressedValue={compressedFormat?.format_long_name}
        unit=""
      />

      <ComparisonRow
        property="Streams"
        originalValue={originalFormat?.nb_streams}
        compressedValue={compressedFormat?.nb_streams}
        unit=""
      />

      <ComparisonRow
        property="Stream groups"
        originalValue={originalFormat?.nb_stream_groups}
        compressedValue={compressedFormat?.nb_stream_groups}
        unit=""
      />

      <ComparisonRow
        property="Start time"
        originalValue={originalFormat?.start_time}
        compressedValue={compressedFormat?.start_time}
        unit=""
      />
      <ComparisonRow
        property="Bit rate"
        originalValue={originalFormat?.bit_rate}
        compressedValue={compressedFormat?.bit_rate}
        unit="bps"
      />
    </Subtable>
  );
};
