import axios from 'axios';
import VisionApiResponse from './vision-api-response';

class CloudVisionApi {
  static async execute(imageUrl) {
    try {
      const response = await axios
        .post(
          `https://vision.googleapis.com/v1/images:annotate?key=${
            process.env.CLOUD_VISION_API_KEY
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
