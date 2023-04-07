import { HttpException, HttpStatus } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CoreModule } from "../core.module";
import { CommonExceptionFilter } from "./common-exception.filter"

const mockJson = jest.fn();

const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson
}));

const mockSend = jest.fn().mockImplementation(() => ({
    json: mockJson
}));

const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
    send: mockSend
}));

const mockHeaders = {
    'messagekey-requestuuid': 'adad'
}

const mockGetRequest = jest.fn().mockImplementation(() => ({
    headers: mockHeaders
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: mockGetRequest
}));

const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn()
};

describe('CommonExceptionFilter', () => {

    let filter: CommonExceptionFilter

    beforeEach(async () => {
        process.env.AWS_REGION = "ap-south-1"
        process.env.AWS_SECRETNAME = "uat/api-modernization-2"
        const config = () => ({})

        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            imports: [CoreModule.forRoot({ loggerLabel: 'AccountCardInfo' }), ConfigModule.forRoot({ load: [config] })],
            providers: [CommonExceptionFilter]
        }).compile();

        filter = module.get<CommonExceptionFilter>(CommonExceptionFilter);
    });

    it('should be defined', () => {
        expect(filter).toBeDefined();
    });

    it('should catch error and send error response', () => {
        filter.catch(new HttpException('Http exception', HttpStatus.BAD_REQUEST), mockArgumentsHost);
        expect(mockGetResponse).toBeCalledTimes(1);
        expect(mockStatus).toBeCalledTimes(1);
        expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockSend).toBeCalledTimes(1);
    });
})