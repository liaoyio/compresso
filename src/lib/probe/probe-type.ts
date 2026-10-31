// TypeScript types for ffprobe
// Generated from https://github.com/FFmpeg/FFmpeg/blob/master/doc/ffprobe.xsd

export interface Ffprobe {
  program_version?: ProgramVersionType;
  library_versions?: LibraryVersionsType;
  pixel_formats?: PixelFormatsType;
  packets?: PacketsType;
  frames?: FramesType;
  packets_and_frames?: PacketsAndFramesType;
  programs?: ProgramsType;
  stream_groups?: StreamGroupsType;
  streams?: StreamType[];
  chapters?: ChaptersType;
  format?: FormatType;
  error?: ErrorType;
}

export interface ProgramVersionType {
  version: string;
  copyright: string;
  build_date?: string;
  build_time?: string;
  compiler_ident: string;
  configuration: string;
}

export interface LibraryVersionsType {
  library_version?: LibraryVersionType[];
}

export interface LibraryVersionType {
  name: string;
  major: number;
  minor: number;
  micro: number;
  version: number;
  ident: string;
}

export interface PixelFormatsType {
  pixel_format?: PixelFormatType[];
}

export interface PixelFormatType {
  name: string;
  nb_components: number;
  log2_chroma_w?: number;
  log2_chroma_h?: number;
  bits_per_pixel?: number;
  flags?: PixelFormatFlagsType;
  components?: PixelFormatComponentsType;
}

export interface PixelFormatFlagsType {
  big_endian: number;
  palette: number;
  bitstream: number;
  hwaccel: number;
  planar: number;
  rgb: number;
  alpha: number;
}

export interface PixelFormatComponentsType {
  component?: PixelFormatComponentType[];
}

export interface PixelFormatComponentType {
  index: number;
  bit_depth: number;
}

export interface PacketsType {
  packet?: PacketType[];
}

export interface PacketType {
  tags?: TagsType;
  side_data_list?: PacketSideDataListType;
  codec_type: string;
  stream_index: number;
  pts?: number;
  pts_time?: number;
  dts?: number;
  dts_time?: number;
  duration?: number;
  duration_time?: number;
  size: number;
  pos?: number;
  flags: string;
  data?: string;
  data_hash?: string;
}

export interface PacketSideDataListType {
  side_data?: PacketSideDataType[];
}

export interface PacketSideDataType {
  side_datum?: PacketSideDatumType[];
  type?: string;
}

export interface PacketSideDatumType {
  key?: string;
  value?: string;
}

export interface FramesType {
  frame?: FrameType[];
  subtitle?: SubtitleType[];
}

export interface PacketsAndFramesType {
  packet?: PacketType[];
  frame?: FrameType[];
  subtitle?: SubtitleType[];
}

export interface FrameType {
  tags?: TagsType;
  logs?: LogsType;
  side_data_list?: FrameSideDataListType;
  media_type: string;
  stream_index?: number;
  key_frame: number;
  pts?: number;
  pts_time?: number;
  pkt_dts?: number;
  pkt_dts_time?: number;
  best_effort_timestamp?: number;
  best_effort_timestamp_time?: number;
  duration?: number;
  duration_time?: number;
  pkt_pos?: number;
  pkt_size?: number;
  sample_fmt?: string;
  nb_samples?: number;
  channels?: number;
  channel_layout?: string;
  width?: number;
  height?: number;
  crop_top?: number;
  crop_bottom?: number;
  crop_left?: number;
  crop_right?: number;
  pix_fmt?: string;
  sample_aspect_ratio?: string;
  pict_type?: string;
  interlaced_frame?: number;
  top_field_first?: number;
  repeat_pict?: number;
  color_range?: string;
  color_space?: string;
  color_primaries?: string;
  color_transfer?: string;
  chroma_location?: string;
}

export interface SubtitleType {
  media_type: "subtitle";
  pts?: number;
  pts_time?: number;
  format?: number;
  start_display_time?: number;
  end_display_time?: number;
  num_rects?: number;
}

export interface LogsType {
  log: LogType[];
}

export interface LogType {
  context?: string;
  level?: number;
  category?: number;
  parent_context?: string;
  parent_category?: number;
  message?: string;
}

export interface FrameSideDataListType {
  side_data?: FrameSideDataType[];
}

export interface FrameSideDataType {
  timecodes?: FrameSideDataTimecodeList;
  components?: FrameSideDataComponentList;
  side_datum?: FrameSideDatumType[];
  side_data_type?: string;
  side_data_size?: number;
  timecode?: string;
}

export interface FrameSideDatumType {
  key?: string;
  value?: string;
}

export interface FrameSideDataTimecodeList {
  timecode?: FrameSideDataTimecodeType[];
}

export interface FrameSideDataTimecodeType {
  value?: string;
}

export interface FrameSideDataComponentList {
  component?: FrameSideDataComponentType[];
}

export interface FrameSideDataComponentType {
  pieces?: FrameSideDataPieceList;
  side_datum?: FrameSideDatumType[];
}

export interface FrameSideDataPieceList {
  piece?: FrameSideDataPieceType[];
}

export interface FrameSideDataPieceType {
  side_datum?: FrameSideDatumType[];
}

export interface ProgramsType {
  program?: ProgramType[];
}

export interface ProgramType {
  tags?: TagsType;
  streams?: StreamsType;
  program_id: number;
  program_num: number;
  nb_streams: number;
  pmt_pid: number;
  pcr_pid: number;
}

export interface StreamGroupsType {
  stream_group?: StreamGroupType[];
}

export interface StreamGroupType {
  disposition?: StreamDispositionType;
  tags?: TagsType;
  streams?: StreamsType;
  components?: StreamGroupComponentList;
  index: number;
  nb_streams: number;
  type: string;
}

export interface StreamGroupComponentList {
  component?: StreamGroupComponentType[];
}

export interface StreamGroupComponentType {
  subcomponents?: StreamGroupSubComponentList;
  component_entry?: StreamGroupEntryType[];
}

export interface StreamGroupSubComponentList {
  subcomponent?: StreamGroupSubComponentType[];
}

export interface StreamGroupSubComponentType {
  pieces?: StreamGroupPieceList;
  subcomponent_entry?: StreamGroupEntryType[];
}

export interface StreamGroupPieceList {
  piece?: StreamGroupPieceType[];
}

export interface StreamGroupPieceType {
  subpieces?: StreamGroupSubPieceList;
  piece_entry?: StreamGroupEntryType[];
}

export interface StreamGroupSubPieceList {
  subpiece?: StreamGroupSubPieceType[];
}

export interface StreamGroupSubPieceType {
  blocks?: StreamGroupBlockList;
  subpiece_entry?: StreamGroupEntryType[];
}

export interface StreamGroupBlockList {
  block?: StreamGroupBlockType[];
}

export interface StreamGroupBlockType {
  block_entry?: StreamGroupEntryType[];
}

export interface StreamGroupEntryType {
  key?: string;
  value?: string;
}

export interface StreamsType {
  stream?: StreamType[];
}

export interface StreamType {
  disposition?: StreamDispositionType;
  tags?: TagsType;
  side_data_list?: PacketSideDataListType;
  index: number;
  codec_name?: string;
  codec_long_name?: string;
  profile?: string;
  codec_type?: string;
  codec_tag: string;
  codec_tag_string: string;
  extradata?: string;
  extradata_size?: number;
  extradata_hash?: string;
  width?: number;
  height?: number;
  coded_width?: number;
  coded_height?: number;
  closed_captions?: boolean;
  film_grain?: boolean;
  has_b_frames?: number;
  sample_aspect_ratio?: string;
  display_aspect_ratio?: string;
  pix_fmt?: string;
  level?: number;
  color_range?: string;
  color_space?: string;
  color_transfer?: string;
  color_primaries?: string;
  chroma_location?: string;
  field_order?: string;
  refs?: number;
  sample_fmt?: string;
  sample_rate?: number;
  channels?: number;
  channel_layout?: string;
  bits_per_sample?: number;
  initial_padding?: number;
  id?: string;
  r_frame_rate: string;
  avg_frame_rate: string;
  time_base: string;
  start_pts?: number;
  start_time?: number;
  duration_ts?: number;
  duration?: number;
  bit_rate?: number;
  max_bit_rate?: number;
  bits_per_raw_sample?: number;
  nb_frames?: number;
  nb_read_frames?: number;
  nb_read_packets?: number;
}

export interface StreamDispositionType {
  default: number;
  dub: number;
  original: number;
  comment: number;
  lyrics: number;
  karaoke: number;
  forced: number;
  hearing_impaired: number;
  visual_impaired: number;
  clean_effects: number;
  attached_pic: number;
  timed_thumbnails: number;
  non_diegetic: number;
  captions: number;
  descriptions: number;
  metadata: number;
  dependent: number;
  still_image: number;
  multilayer: number;
}

export interface ChaptersType {
  chapter?: ChapterType[];
}

export interface ChapterType {
  tags?: TagsType;
  id: number;
  time_base: string;
  start: number;
  start_time?: number;
  end: number;
  end_time: number;
}

export interface TagsType {
  tag?: TagType[];
}

export interface TagType {
  key: string;
  value: string;
}

export interface FormatType {
  tags?: TagsType;
  filename: string;
  nb_streams: number;
  nb_programs: number;
  nb_stream_groups: number;
  format_name: string;
  format_long_name?: string;
  start_time?: number;
  duration?: number;
  size?: number;
  bit_rate?: number;
  probe_score?: number;
}

export interface ErrorType {
  code: number;
  string: string;
}
