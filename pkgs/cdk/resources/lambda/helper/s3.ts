import { S3 } from 'aws-sdk';

// S3クライアントを作成
const s3 = new S3();

/**
 * S3バケットから任意のオブジェクトを取得するメソッド
 * @param bucketName バケット名
 * @param objectKey  オブジェクトキー
 * @returns 
 */
export const getS3Object = async (bucketName: string, objectKey: string): Promise<string> => {
  try {
    // S3からオブジェクトを取得
    const data = await s3.getObject({
      Bucket: bucketName,
      Key: objectKey
    }).promise();

    // ファイル内容をUTF-8でデコード
    const fileContent = data.Body?.toString('utf-8');

    if (fileContent) {
      console.log('Markdown file content:', fileContent);
    } else {
      console.error('File content is empty');
    }
    return fileContent || "";
  } catch (error) {
    console.error('Error fetching file from S3:', error);
    return "";
  }
}