import {
  localidadPerteneceAProvincia,
  listarProvincias,
  listarLocalidadesPorProvincia,
} from './locationService';
import axios from 'axios';

// Mock de Axios (unit test puro, sin salir a Internet)
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));


const axiosGetMock = (axios as any).get as jest.Mock;

describe('locationService (UNIT)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listarProvincias → mapea correctamente a { nombre }', async () => {
    axiosGetMock.mockImplementationOnce(async () => ({
      data: { provincias: [{ nombre: 'Buenos Aires' }, { nombre: 'Córdoba' }] },
    }));

    const res = await listarProvincias();
    expect(res).toEqual([{ nombre: 'Buenos Aires' }, { nombre: 'Córdoba' }]);
  });

  test('listarLocalidadesPorProvincia → mapea correctamente a { nombre }', async () => {
    axiosGetMock.mockImplementationOnce(async () => ({
      data: { localidades: [{ nombre: 'La Plata' }, { nombre: 'Mar del Plata' }] },
    }));

    const res = await listarLocalidadesPorProvincia('Buenos Aires');
    expect(res).toEqual([{ nombre: 'La Plata' }, { nombre: 'Mar del Plata' }]);
  });

  test('localidadPerteneceAProvincia → true cuando la API devuelve coincidencia', async () => {
    axiosGetMock.mockImplementationOnce(async () => ({
      data: {
        localidades: [
          { nombre: 'La Plata', provincia: { nombre: 'Buenos Aires' } },
        ],
      },
    }));

    const ok = await localidadPerteneceAProvincia('La Plata', 'Buenos Aires');
    expect(ok).toBe(true);
  });


  test('localidadPerteneceAProvincia → false cuando NO hay coincidencia', async () => {
    axiosGetMock.mockImplementationOnce(async () => ({
      data: { localidades: [] },
    }));

    const noOk = await localidadPerteneceAProvincia('Villa Invento', 'Neuquén');
    expect(noOk).toBe(false);
  });
});