import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateCertificateUseCase } from '../../../../src/application/certificate/use-cases/CreateCertificateUseCase';
import { InMemoryCertificateRepository } from '../../../builder/InMemoryCertificateRepository';
import { IStorageService } from '../../../../src/domain/certificate/services/IStorageService';
import { IPDFProcessor } from '../../../../src/domain/certificate/services/IPDFProcessor';

const mockStorageService = {
    uploadFile: jest.fn().mockImplementation(async () => 'caminho/do/arquivo.pdf'),
    deleteFile: jest.fn().mockImplementation(async () => undefined),
    getPhysicalPath: jest.fn().mockImplementation(() => '/tmp/caminho/fisico.pdf')
} as unknown as IStorageService;

const mockPdfProcessor = {
    extractInformation: jest.fn().mockImplementation(async () => ({
        workload: 10,
        month: 1,
        year: 2024
    }))
} as unknown as IPDFProcessor;

describe('CreateCertificateUseCase', () => {
    let useCase: CreateCertificateUseCase;
    let repository: InMemoryCertificateRepository;

    beforeEach(() => {
        repository = new InMemoryCertificateRepository();
        useCase = new CreateCertificateUseCase(repository, mockStorageService, mockPdfProcessor);
    });

    it('Deve criar um certificado com sucesso', async () => {
        const fakeFile = {
            fieldname: 'file',
            originalname: 'certificado.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: Buffer.from('fake-pdf-content'),
            size: 1024
        } as Express.Multer.File;

        const input = {
            userId: 'user-123',
            file: fakeFile,
            title: 'Workshop de Typescript',
            description: 'Participação no workshop',
            institution: 'Faculdade',
            workload: 10,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            category: 'EVENTOS' as any 
        };

        const result = await useCase.execute(input);

        expect(result).toHaveProperty('id');
        expect(result.status).toBe('pending');
        expect(result.certificateUrl).toBeDefined(); 
        
        const saved = await repository.findById(result.id);
        expect(saved).toBeDefined();
    });
});