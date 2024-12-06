export class AiModelCard {
    id: string;
    version: Date;

    aiModelId: string;
    name: string;
    date: Date;
    framework: string;

    trainingData: { [key: string]: string };
    trainingParameters: { [key: string]: string };

    author: string;
    description: string;
    citation: string;
    operationType: string[];
    architecture: string;

    training: { [key: string]: number };
    testing: { [key: string]: number };

    license: string;

    publiclyShared: boolean = true;
    _links: any;
}
