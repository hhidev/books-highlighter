interface EntityAnnotation {
  mid: string;
  locale: string;
  description: string;
  score: number;
  confidence: number;
  topicality: number;
}

interface Result {
  responses: [
    {
      textAnnotations: EntityAnnotation[];
    }
  ];
}

interface Error {
  code: number;
  message: string;
  details: [];
}

class VisionApiResponse {
  status: number;
  data: Result;
  error: Error;

  static fromResponse(response: any) {
    const r = new this();

    r.status = response.status;
    r.data = response.data;
    return r;
  }

  static fromError(error: any) {
    const r = new this();

    r.status = error.status;
    r.error = error;

    return r;
  }

  isOK() {
    return this.status >= 200 && this.status < 400;
  }
}

export default VisionApiResponse;
