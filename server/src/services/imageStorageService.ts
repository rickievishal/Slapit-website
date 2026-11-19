import mongoose from 'mongoose';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const GRIDFS_BUCKET_NAME = 'productImages';
export const GRIDFS_IMAGE_PATH = '/api/upload/files/';
const allowedContentTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const getBucket = () => {
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB must be connected before accessing image storage');
  return new mongoose.mongo.GridFSBucket(db, { bucketName: GRIDFS_BUCKET_NAME });
};

export const getGridFsImageId = (url: string): string | null => {
  const match = url.match(/(?:^|\/)api\/upload\/files\/([a-f\d]{24})(?:$|[?#])/i);
  return match?.[1] || null;
};

export const parseImageDataUrl = (
  image: string
): { buffer: Buffer; contentType: string } | null => {
  const match = image.match(/^data:(image\/(?:jpeg|png|webp));base64,([\s\S]*)$/i);
  if (!match) return null;
  return {
    buffer: Buffer.from(match[2], 'base64'),
    contentType: match[1].toLowerCase(),
  };
};

export const imageStorageService = {
  async store(buffer: Buffer, contentType: string, filename: string): Promise<string> {
    const uploadStream = getBucket().openUploadStream(filename, {
      metadata: { contentType },
    });
    await pipeline(Readable.from([buffer]), uploadStream);
    return `${GRIDFS_IMAGE_PATH}${uploadStream.id.toString()}`;
  },

  async getFile(id: string) {
    if (!mongoose.isValidObjectId(id)) return null;
    const bucket = getBucket();
    const file = await bucket.find({ _id: new mongoose.mongo.ObjectId(id) }).next();
    if (!file) return null;
    const storedContentType = file.metadata?.contentType;
    return {
      contentType:
        typeof storedContentType === 'string' && allowedContentTypes.has(storedContentType)
          ? storedContentType
          : 'application/octet-stream',
      stream: bucket.openDownloadStream(file._id),
    };
  },

  async getBuffer(id: string): Promise<{ buffer: Buffer; contentType: string } | null> {
    const file = await this.getFile(id);
    if (!file) return null;

    const chunks: Buffer[] = [];
    for await (const chunk of file.stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return { buffer: Buffer.concat(chunks), contentType: file.contentType };
  },
};
