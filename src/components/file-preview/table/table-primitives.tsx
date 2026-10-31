import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export const Subtable = ({ children }: { children: React.ReactNode }) => {
  return (
    <Table className="">
      <TableBody>{children}</TableBody>
    </Table>
  );
};

const formatValue = (value: string | number | undefined): string => {
  if (typeof value === "undefined") return "";
  if (typeof value === "string") {
    if (value.includes("/")) { return value }
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
      return numberValue.toLocaleString("en-US");
    }
    return value;
  }
  return value.toLocaleString("en-US");
};

export const ComparisonRow = ({
  property,
  originalValue,
  compressedValue,
  unit,
}: {
  property: string;
  originalValue?: string | number;
  compressedValue?: string | number;
  unit?: string;
}) => {
  if (!originalValue && !compressedValue) return null;
  return (
    <Row>
      <Property>{property}</Property>
      <OriginalValue>
        {formatValue(originalValue)} {unit}
      </OriginalValue>
      {/* <TableCell className="w-12 flex justify-end"><ArrowRightIcon size={16}/></TableCell> */}
      <CompressedValue>
        {formatValue(compressedValue)} {unit}
      </CompressedValue>
    </Row>
  );
};

export const Row = ({ children }: { children: React.ReactNode }) => {
  return <TableRow className=" select-all">{children}</TableRow>;
};

export const Property = ({ children }: { children: React.ReactNode }) => {
  return <TableCell className="text-lefts font-bold">{children}</TableCell>;
};

export const OriginalValue = ({ children }: { children: React.ReactNode }) => {
  return <TableCell className="text-right">{children}</TableCell>;
};

export const CompressedValue = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <TableCell className="text-right">{children}</TableCell>;
};
