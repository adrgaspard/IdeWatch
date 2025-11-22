/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export type CellInput = boolean | number | string;

import { normalizeRange, Range } from "../models/range";
import { ReadonlyFixedArray } from "./general";

export type MatrixInput = Array<Array<CellInput>>;

export type ParsingOptions = Partial<{
  nullable: boolean;
}>;

export type CellInputParser<TResult> = (x: CellInput) => TResult;

export type CellInputArrayParser<TResult, ParametersCount extends number> = (
  x: ReadonlyFixedArray<CellInput, ParametersCount>
) => TResult;

type StringEnumValues<TEnum> = TEnum[keyof TEnum];
type NumericEnumValues<TEnum> = Extract<TEnum[keyof TEnum], number>;

export function mapCellInput<TIfPresent, TIfEmpty>(
  x: CellInput,
  presentFunc: CellInputParser<TIfPresent>,
  emptyFunc: () => TIfEmpty
): TIfPresent | TIfEmpty {
  return x === "" ? emptyFunc() : presentFunc(x);
}

export function orUndefined(): undefined {
  return undefined;
}

export function orThrow<TResult>(errorMessage: string): TResult {
  throw new Error(errorMessage);
}

export function cellInputToString(cell: CellInput): string {
  if (!["string", "number", "boolean"].includes(typeof cell)) {
    throw new Error(`${cell} could not be parsed into a string.`);
  }
  return typeof cell === "string" ? cell : `${cell}`;
}

export function cellInputToNumber(cell: CellInput): number {
  if (typeof cell === "number") return cell;
  if (typeof cell !== "string") throw new Error(`${cell} is not a string, it could not be parsed into a number.`);
  const result = parseFloat(cell);
  if (isNaN(result)) throw new Error(`${cell} could not be parsed into a number.`);
  return result;
}

export function cellInputToInteger(cell: CellInput): number {
  if (typeof cell !== "string" && typeof cell !== "number") {
    throw new Error(`${cell} is not a string, it could not be parsed into a number.`);
  }
  const result = typeof cell === "number" ? cell : parseInt(cell);
  if (!Number.isSafeInteger(result)) throw new Error(`${cell} could not be parsed into an integer.`);
  return result;
}

export function cellInputToBoolean(cell: CellInput): boolean {
  if (typeof cell !== "boolean") throw new Error(`${cell} is not a boolean.`);
  return cell;
}

export function cellInputToStringEnum<TEnum extends Readonly<Record<string, string>>>(
  cell: CellInput,
  enumType: TEnum,
  transco?: (value: string) => string
): StringEnumValues<TEnum> {
  const value = transco ? transco(cellInputToString(cell)) : cellInputToString(cell);
  const enumValues = Object.values(enumType);
  if (!enumValues.includes(value)) {
    throw new Error(`${value} is not inside the requested enum values (${enumValues.join(", ")}).`);
  }
  return value as StringEnumValues<TEnum>;
}

export function cellInputToNumericEnum<TEnum extends Readonly<Record<string, number | string>>>(
  cell: CellInput,
  enumType: TEnum
): NumericEnumValues<TEnum> {
  const value = cellInputToNumber(cell);
  const enumValues = Object.values(enumType).filter(x => typeof x === "number");
  if (!enumValues.includes(value)) {
    throw new Error(`${value} is not inside the requested enum values (${enumValues.join(", ")}).`);
  }
  return value as NumericEnumValues<TEnum>;
}

export function cellInputToRange(cell: CellInput): Range {
  if (typeof cell === "number") return [{ min: cell, max: cell }];
  if (typeof cell !== "string") {
    throw new Error(`${cell} is not a string or a number, it could not be parsed into a range.`);
  }
  if (cell === "") return [];
  const trimmedCell = cell.trim();
  if (trimmedCell === "") throw new Error(`${cell} could not be parsed into a range.`);

  const tokens = trimmedCell.split(", ").map(t => t.trim());
  const result: Range = tokens.map(token => {
    const match = token.match(/^(-?\d+(?:\.\d+)?)(?:\s*-\s*(-?\d+(?:\.\d+)?))?$/);
    if (!match) throw new Error(`${cell} could not be parsed into a range (invalid token '${token}').`);
    const first = parseFloat(match[1]);
    const second = match[2] !== undefined ? parseFloat(match[2]) : first;
    if (isNaN(first) || isNaN(second)) {
      throw new Error(`${cell} could not be parsed into a range (invalid number in '${token}').`);
    }
    if (first > second) {
      throw new Error(`${cell} could not be parsed into a range (min > max in '${token}').`);
    }
    return { min: first, max: second };
  });
  return normalizeRange(result);
}

function ensureMatrixInputCorrect(matrix: MatrixInput): { lineSize: number; linesCount: number } {
  if (!Array.isArray(matrix) || matrix.length < 1) {
    throw new Error(`${matrix} is not a matrix-like input (no array in first dimension).`);
  }
  let subLength = undefined;
  for (const sub of matrix) {
    if (!Array.isArray(sub) || sub.length < (matrix.length === 1 ? 2 : 1)) {
      throw new Error(`${matrix} is not a matrix-like input (one element is not an array in second dimension).`);
    }
    if (subLength === undefined) {
      subLength = sub.length;
      continue;
    }
    if (subLength !== sub.length) {
      throw new Error(`${matrix} is not a matrix-like input (all lines does not have the same length).`);
    }
  }
  return { lineSize: subLength!, linesCount: matrix.length };
}

function transposeMatrix(matrix: MatrixInput): MatrixInput {
  return matrix[0].map((_, col) => matrix.map(row => row[col]));
}

export function lineInputToArrayOf<TResult>(
  matrix: MatrixInput,
  itemFunc: CellInputParser<TResult>
): ReadonlyArray<TResult> {
  const matrixSize = ensureMatrixInputCorrect(matrix);
  if (matrixSize.linesCount !== 1) throw new Error(`${matrix} is not a line-like input.`);
  const line = matrix[0];
  return line.map(itemFunc);
}

export function columnInputToArrayOf<TResult>(
  matrix: MatrixInput,
  itemFunc: CellInputParser<TResult>
): ReadonlyArray<TResult> {
  const matrixSize = ensureMatrixInputCorrect(matrix);
  if (matrixSize.lineSize !== 1) throw new Error(`${matrix} is not a column-like input.`);
  const column = (transposeMatrix(matrix) as unknown as ReadonlyArray<ReadonlyArray<CellInput>>)[0];
  return column.map(itemFunc);
}

export function lineInputTo<TResult, ParametersCount extends number>(
  matrix: MatrixInput,
  parametersCount: ParametersCount,
  lineFunc: CellInputArrayParser<TResult, ParametersCount>
): TResult {
  const matrixSize = ensureMatrixInputCorrect(matrix);
  if (matrixSize.linesCount !== 1) throw new Error(`${matrix} is not a line-like input.`);
  if (matrixSize.lineSize !== parametersCount) {
    throw new Error(`The line size should be ${parametersCount} (actual: ${matrixSize.lineSize}).`);
  }
  const line = (matrix as unknown as ReadonlyArray<ReadonlyFixedArray<CellInput, ParametersCount>>)[0];
  return lineFunc(line);
}

export function columnInputTo<TResult, ParametersCount extends number>(
  matrix: MatrixInput,
  parametersCount: ParametersCount,
  columnFunc: CellInputArrayParser<TResult, ParametersCount>
): TResult {
  const matrixSize = ensureMatrixInputCorrect(matrix);
  if (matrixSize.lineSize !== 1) throw new Error(`${matrix} is not a column-like input.`);
  if (matrixSize.linesCount !== parametersCount) {
    throw new Error(`The line size should be ${parametersCount} (actual: ${matrixSize.linesCount}).`);
  }
  const transposed = transposeMatrix(matrix);
  const column = (transposed as unknown as ReadonlyArray<ReadonlyFixedArray<CellInput, ParametersCount>>)[0];
  return columnFunc(column);
}

export function linesInputToArrayOf<TResult, ParametersCount extends number>(
  matrix: MatrixInput,
  parametersCount: ParametersCount,
  lineFunc: CellInputArrayParser<TResult, ParametersCount>
): ReadonlyArray<TResult> {
  const matrixSize = ensureMatrixInputCorrect(matrix);
  if (matrixSize.lineSize !== parametersCount) {
    throw new Error(`The line size should be ${parametersCount} (actual: ${matrixSize.lineSize}).`);
  }
  return (matrix as unknown as ReadonlyArray<ReadonlyFixedArray<CellInput, ParametersCount>>).map(lineFunc);
}

export function columnsInputToArrayOf<TResult, ParametersCount extends number>(
  matrix: MatrixInput,
  parametersCount: ParametersCount,
  columnFunc: CellInputArrayParser<TResult, ParametersCount>
): ReadonlyArray<TResult> {
  const matrixSize = ensureMatrixInputCorrect(matrix);
  if (matrixSize.linesCount !== parametersCount) {
    throw new Error(`The column size should be ${parametersCount} (actual: ${matrixSize.linesCount}).`);
  }
  const transposed = transposeMatrix(matrix);
  return (transposed as unknown as ReadonlyArray<ReadonlyFixedArray<CellInput, ParametersCount>>).map(columnFunc);
}
