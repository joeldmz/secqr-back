import { HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

// Definimos una estructura para el error manejado
export class DatabaseError {
  constructor(
    public readonly httpStatus: HttpStatus,
    public readonly message: string,
    public readonly originalError: Error,
  ) {}
}

/**
 * Servicio encargado de mapear errores de Prisma a errores HTTP manejables.
 */
export class PrismaErrorService {
  static mapError(error: any): DatabaseError {
    if (error instanceof PrismaClientKnownRequestError) {

      const code = error?.code || 'UNKNOWN_PRISMA_ERROR';

      let message = 'Ocurrió un error de base de datos al ejecutar la consulta.';
      let httpStatus = HttpStatus.BAD_REQUEST;

      if (code === 'P2002') { // Unique constraint failed
        message = 'El email ya existe. Verifique que los datos sean únicos.';
        httpStatus = HttpStatus.CONFLICT;
      } else if (code === 'P2012') { // Missing required argument
        message = 'Faltan argumentos requeridos en la base de datos.';
        httpStatus = HttpStatus.BAD_REQUEST;
      } else if (code === 'P2025') { // Record not found
        message = 'No se encontró ningún registro con los parámetros proporcionados.';
        httpStatus = HttpStatus.NOT_FOUND;
      } else {
        // Para otros errores de DB, usamos el mensaje genérico y BAD_REQUEST
        message = `Error de Base de Datos (${code}): ${error.message}`;
        httpStatus = HttpStatus.BAD_REQUEST;
      }
      
      return new DatabaseError(httpStatus, message, error);
    }

    // 3. Manejar otros errores generales (ej. errores de conexión)
    if (error instanceof Error) {
        return new DatabaseError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Error interno del servidor al comunicarse con la base de datos.',
            error
        );
    }

    // 4. Fallback
    return new DatabaseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Error desconocido del sistema.', new Error(String(error)));
  }
}

// Exportar la clase de error para que los servicios la puedan usar
export type DatabaseErrorResult = DatabaseError;