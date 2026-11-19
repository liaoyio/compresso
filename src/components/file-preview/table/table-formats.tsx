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
        property="大小"
        originalValue={originalFormat?.size}
        compressedValue={compressedFormat?.size}
        unit="bytes"
      />
      <ComparisonRow
        property="时长"
        originalValue={originalFormat?.duration}
        compressedValue={compressedFormat?.duration}
        unit="s"
      />
      <ComparisonRow
        property="格式"
        originalValue={originalFormat?.format_long_name}
        compressedValue={compressedFormat?.format_long_name}
        unit=""
      />

      <ComparisonRow
        property="流数量"
        originalValue={originalFormat?.nb_streams}
        compressedValue={compressedFormat?.nb_streams}
        unit=""
      />

      <ComparisonRow
        property="流组"
        originalValue={originalFormat?.nb_stream_groups}
        compressedValue={compressedFormat?.nb_stream_groups}
        unit=""
      />

      <ComparisonRow
        property="起始时间"
        originalValue={originalFormat?.start_time}
        compressedValue={compressedFormat?.start_time}
        unit=""
      />
      <ComparisonRow
        property="码率"
        originalValue={originalFormat?.bit_rate}
        compressedValue={compressedFormat?.bit_rate}
        unit="bps"
      />
    </Subtable>
  );
};
