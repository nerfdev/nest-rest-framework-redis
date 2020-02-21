import { deflateSync, inflateSync } from 'zlib';

export const COMPRESSION_ENCODING = 'base64';

export function compressData<T>(data: T): string {
  return deflateSync(JSON.stringify(data)).toString(COMPRESSION_ENCODING);
}

export function decompressData<T>(compressedData: string): T {
  const decompressedJson = Buffer.from(compressedData, COMPRESSION_ENCODING);
  const deserializedData = JSON.parse(inflateSync(decompressedJson).toString());
  return deserializedData as T;
}
