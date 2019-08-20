import * as functions from 'firebase-functions';
import axios from 'axios';
import VisionApiResponse from './vision-api-response';

/**
 * cloud function configにcloudvision.api_keyを設定しておく
 */
class CloudVisionApi {
  static async execute(imageUrl: string) {
    try {
      const response = await axios
        .post(
          `https://vision.googleapis.com/v1/images:annotate?key=${
            functions.config().cloudvision.api_key
          }`,
          {
            requests: [
              {
                image: {
                  source: { imageUri: imageUrl }
                },
                features: [{ type: 'TEXT_DETECTION' }]
              }
            ]
          }
        )
        .catch(error => {
          throw error;
        });
      console.log(response);
      return VisionApiResponse.fromResponse(response);
    } catch (error) {
      console.log(error);
      return VisionApiResponse.fromError(error);
    }
  }
}

export default CloudVisionApi;
