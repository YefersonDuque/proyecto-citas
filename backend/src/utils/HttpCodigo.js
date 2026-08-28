class HttpCodigo {
  /* get, delete, head, trace */
  static OK = 200;

  /* Created, updated */
  static CREADO = 201;

  /* No content */
  static NO_CONTENIDO = 204;

  /* Bad request */
  static SOLICITUD_INCORRECTA = 400;

  /* Not authenticated */
  static No_AUTENTICADO = 401;

  /* Forbidden */
  static NO_AUTORIZADO = 403;

  /* Not found */
  static NO_ENCONTRADO = 404;

  /* Internal server error */
  static ERROR_INTERNO_SERVIDOR = 500;
}

module.exports = HttpCodigo;
