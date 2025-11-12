// Test unitario para cancionesService (CJS-friendly)
import { assertGeneroCompatible } from './cancionesService';

// 👇 Mock del módulo prisma ANTES de que Jest evalue los imports del SUT
jest.mock('../data/prisma.js', () => {
  const findUnique = jest.fn(); // mock base sin genéricos
    return {
        __esModule: true,
        prisma: {
        evento: { findUnique }
        },
        // por si en algún archivo importaran default (no molesta tenerlo)
        default: {
        evento: { findUnique }
        }
    };
    });

    // Luego del mock, importamos prisma (queda mockeado)
    import { prisma } from '../data/prisma.js';

    // Para evitar choques de tipos estrictos (never), casteamos el mock:
    const findUniqueMock = prisma.evento.findUnique as unknown as jest.Mock;

    describe('cancionesService.assertGeneroCompatible (UNIT)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('lanza "El evento no existe" si no encuentra el evento', async () => {
        // evitamos never usando implementación asíncrona
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
