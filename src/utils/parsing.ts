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

import { normalizeRange, Range } from "../models/range";
import { ReadonlyFixedArray } from "./general";

export type CellInput = boolean | number | string;
export type MatrixInput = ReadonlyArray<ReadonlyArray<CellInput>>;

type CellParser<TResult> = (x: CellInput) => TResult;

type CellArrayParser<TResult> = (x: ReadonlyArray<CellInput>) => TResult;

type CellFixedArrayParser<TResult, ParametersCount extends number> = (
  x: ReadonlyFixedArray<CellInput, ParametersCount>
) => TResult;

type StringEnumValues<TEnum> = TEnum[keyof TEnum];
type NumericEnumValues<TEnum> = Extract<TEnum[keyof TEnum], number>;

export function mapCell<TIfPresent, TIfEmpty>(
  x: CellInput,
  presentFunc: CellParser<TIfPresent>,
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

export function cellToString(cell: CellInput): string {
  if (!["string", "number", "boolean"].includes(typeof cell)) {
    throw new Error(`${cell} could not be parsed into a string.`);
  }
  return typeof cell === "string" ? cell : `${cell}`;
}

export function cellToNumber(cell: CellInput): number {
  if (typeof cell === "number") return cell;
  if (typeof cell !== "string") throw new Error(`${cell} is not a string, it could not be parsed into a number.`);
  const result = parseFloat(cell);
  if (isNaN(result)) throw new Error(`${cell} could not be parsed into a number.`);
  return result;
}

export function cellToInteger(cell: CellInput): number {
  if (typeof cell !== "string" && typeof cell !== "number") {
    throw new Error(`${cell} is not a string, it could not be parsed into a number.`);
  }
  const result = typeof cell === "number" ? cell : parseInt(cell);
  if (!Number.isSafeInteger(result)) throw new Error(`${cell} could not be parsed into an integer.`);
  return result;
}

export function cellToBoolean(cell: CellInput): boolean {
  if (typeof cell !== "boolean") throw new Error(`${cell} is not a boolean.`);
  return cell;
}

export function cellToStringEnum<TEnum extends Readonly<Record<string, string>>>(
  cell: CellInput,
  enumType: TEnum,
  transco?: (value: string) => string
): StringEnumValues<TEnum> {
  const value = transco ? transco(cellToString(cell)) : cellToString(cell);
  const enumValues = Object.values(enumType);
  if (!enumValues.includes(value)) {
    throw new Error(`${value} is not inside the requested enum values (${enumValues.join(", ")}).`);
  }
  return value as StringEnumValues<TEnum>;
}

export function cellToNumericEnum<TEnum extends Readonly<Record<string, number | string>>>(
  cell: CellInput,
  enumType: TEnum
): NumericEnumValues<TEnum> {
  const value = cellToNumber(cell);
  const enumValues = Object.values(enumType).filter(x => typeof x === "number");
  if (!enumValues.includes(value)) {
    throw new Error(`${value} is not inside the requested enum values (${enumValues.join(", ")}).`);
  }
  return value as NumericEnumValues<TEnum>;
}

export function cellToRange(cell: CellInput): Range {
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

function ensureMatrixIsValid(matrix: MatrixInput): { columnsCount: number; linesCount: number } {
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
  return { columnsCount: subLength!, linesCount: matrix.length };
}

function transposeMatrix(matrix: MatrixInput): MatrixInput {
  return matrix[0].map((_, col) => matrix.map(row => row[col]));
}

function ensureLineIsValid(matrix: MatrixInput, desiredLength?: number): ReadonlyArray<CellInput> {
  const matrixSize = ensureMatrixIsValid(matrix);
  if (matrixSize.linesCount !== 1) throw new Error(`${matrix} is not a line-like input.`);
  if (desiredLength !== undefined && matrixSize.columnsCount !== desiredLength) {
    throw new Error(`The line length should be ${desiredLength} (actual: ${matrixSize.columnsCount}).`);
  }
  return matrix[0];
}

function ensureColumnIsValid(matrix: MatrixInput, desiredLength?: number): ReadonlyArray<CellInput> {
  const matrixSize = ensureMatrixIsValid(matrix);
  if (matrixSize.columnsCount !== 1) throw new Error(`${matrix} is not a column-like input.`);
  if (desiredLength !== undefined && matrixSize.linesCount !== desiredLength) {
    throw new Error(`The column length should be ${desiredLength} (actual: ${matrixSize.linesCount}).`);
  }
  return (transposeMatrix(matrix) as unknown as ReadonlyArray<ReadonlyArray<CellInput>>)[0];
}

export function lineToArray<TResult>(matrix: MatrixInput, itemFunc: CellParser<TResult>): ReadonlyArray<TResult> {
  const line = ensureLineIsValid(matrix);
  return line.map(itemFunc);
}

export function columnToArray<TResult>(matrix: MatrixInput, itemFunc: CellParser<TResult>): ReadonlyArray<TResult> {
  const column = ensureColumnIsValid(matrix);
  return column.map(itemFunc);
}

export function lineTo<TResult, ParametersCount extends number>(
  matrix: MatrixInput,
  parametersCount: ParametersCount,
  lineFunc: CellFixedArrayParser<TResult, ParametersCount>
): TResult {
  const line = ensureLineIsValid(matrix, parametersCount) as ReadonlyFixedArray<CellInput, ParametersCount>;
  return lineFunc(line);
}

export function columnTo<TResult, ParametersCount extends number>(
  matrix: MatrixInput,
  parametersCount: ParametersCount,
  columnFunc: CellFixedArrayParser<TResult, ParametersCount>
): TResult {
  const column = ensureColumnIsValid(matrix, parametersCount) as ReadonlyFixedArray<CellInput, ParametersCount>;
  return columnFunc(column);
}

export function linesToArray<TResult>(matrix: MatrixInput, lineFunc: CellArrayParser<TResult>): ReadonlyArray<TResult> {
  ensureMatrixIsValid(matrix);
  return (matrix as unknown as ReadonlyArray<ReadonlyArray<CellInput>>).map(lineFunc);
}

export function columnsToArray<TResult>(
  matrix: MatrixInput,
  columnFunc: CellArrayParser<TResult>
): ReadonlyArray<TResult> {
  ensureMatrixIsValid(matrix);
  const transposed = transposeMatrix(matrix);
  return (transposed as unknown as ReadonlyArray<ReadonlyArray<CellInput>>).map(columnFunc);
}

export function linesToFixedArray<TResult, ParametersCount extends number>(
  matrix: MatrixInput,
  parametersCount: ParametersCount,
  lineFunc: CellFixedArrayParser<TResult, ParametersCount>
): ReadonlyArray<TResult> {
  const matrixSize = ensureMatrixIsValid(matrix);
  if (matrixSize.columnsCount !== parametersCount) {
    throw new Error(`The line size should be ${parametersCount} (actual: ${matrixSize.columnsCount}).`);
  }
  return (matrix as unknown as ReadonlyArray<ReadonlyFixedArray<CellInput, ParametersCount>>).map(lineFunc);
}

export function columnsToFixedArray<TResult, ParametersCount extends number>(
  matrix: MatrixInput,
  parametersCount: ParametersCount,
  columnFunc: CellFixedArrayParser<TResult, ParametersCount>
): ReadonlyArray<TResult> {
  const matrixSize = ensureMatrixIsValid(matrix);
  if (matrixSize.linesCount !== parametersCount) {
    throw new Error(`The column size should be ${parametersCount} (actual: ${matrixSize.linesCount}).`);
  }
  const transposed = transposeMatrix(matrix);
  return (transposed as unknown as ReadonlyArray<ReadonlyFixedArray<CellInput, ParametersCount>>).map(columnFunc);
}
