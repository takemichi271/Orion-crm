export const DB_PATHS = {
  CLIENTS: 'clients',
  CLIENT_BY_ID: (id: string) => `clients/${id}`,
  CLIENT_ADDRESSES: (id: string) => `clients/${id}/addresses`,
  CLIENT_ADDRESS: (clientId: string, addressId: string) =>
    `clients/${clientId}/addresses/${addressId}`,
} as const;

export const ALERT_MESSAGES = {
  CLIENT_CREATED: 'Cliente creado exitosamente',
  CLIENT_UPDATED: 'Cliente actualizado exitosamente',
  CLIENT_DELETED: 'Cliente eliminado exitosamente',
  ADDRESS_CREATED: 'Dirección creada exitosamente',
  ADDRESS_UPDATED: 'Dirección actualizada exitosamente',
  ADDRESS_DELETED: 'Dirección eliminada exitosamente',
  FORM_ERROR: 'Por favor, corrija los siguientes errores:',
  GENERIC_ERROR: 'Ocurrió un error. Intente nuevamente',
} as const;
