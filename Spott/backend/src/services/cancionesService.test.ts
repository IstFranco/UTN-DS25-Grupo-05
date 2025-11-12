// Test unitario para cancionesService 
import { assertGeneroCompatible } from './cancionesService';


jest.mock('../data/prisma.js', () => {
  const findUnique = jest.fn(); 
    return {
        __esModule: true,
        prisma: {
        evento: { findUnique }
        },
       
        default: {
        evento: { findUnique }
        }
    };
    });

    
    import { prisma } from '../data/prisma.js';

   
    const findUniqueMock = prisma.evento.findUnique as unknown as jest.Mock;

    describe('cancionesService.assertGeneroCompatible (UNIT)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('lanza "El evento no existe" si no encuentra el evento', async () => {
        
        findUniqueMock.mockImplementationOnce(async () => null);

        await expect(assertGeneroCompatible('evt-404', 'rock'))
        .rejects
        .toThrow('El evento no existe');
    });

    test('no lanza si generoCancion es undefined (opcional)', async () => {
        findUniqueMock.mockImplementationOnce(async () => ({ musica: 'rock' }));

        await expect(assertGeneroCompatible('evt-1'))
        .resolves
        .toBeUndefined();
    });

    test('no lanza si el género coincide', async () => {
        findUniqueMock.mockImplementationOnce(async () => ({ musica: 'rock' }));

        await expect(assertGeneroCompatible('evt-1', 'rock'))
        .resolves
        .toBeUndefined();
    });

    test('lanza 400 si el género NO coincide', async () => {
    // el evento existe con musica 'rock'
    findUniqueMock.mockImplementationOnce(async () => ({ musica: 'rock' }));

    // llamamos UNA sola vez y chequeamos que el error tenga status 400
    await expect(assertGeneroCompatible('evt-1', 'pop'))
        .rejects
        .toMatchObject({ status: 400 });
    });
});
