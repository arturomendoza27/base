/**
 * Utilidades para transformar y agrupar permisos
 */

export interface GroupedPermission {
  resource: string;
  resourceLabel: string;
  permissions: {
    name: string;
    label: string;
  }[];
}

/**
 * Transforma un nombre de permiso en un label legible en español
 */
export function transformPermissionName(permission: string): string {
  const [resource, action] = permission.split('.');
  
  // Mapeo de acciones a labels en español
  const actionMap: Record<string, string> = {
    'view': 'Ver',
    'show': 'Ver detalle',
    'create': 'Crear',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'import': 'Importar',
    'export': 'Exportar',
  };

  // Mapeo de recursos a labels en español
  const resourceMap: Record<string, string> = {
    'users': 'Usuarios',
    'roles': 'Roles',
    'clientes': 'Clientes',
    'tarifas': 'Tarifas',
    'predios': 'Predios',
    'cicloFacturacion': 'Ciclo de Facturación',
    'facturacion': 'Facturación',
    'caja': 'Caja',
    'pagos': 'Pagos',
    'reportes': 'Reportes',
    'log': 'Registro de Actividad',
    'settings': 'Configuración',
  };

  const actionLabel = actionMap[action] || action;
  const resourceLabel = resourceMap[resource] || resource;

  // Para acciones específicas, crear frases más naturales
  if (action === 'view' || action === 'show') {
    return `Ver ${resourceLabel.toLowerCase()}`;
  }
  
  if (action === 'create') {
    return `Crear ${resourceLabel.toLowerCase()}`;
  }
  
  if (action === 'edit') {
    return `Editar ${resourceLabel.toLowerCase()}`;
  }
  
  if (action === 'delete') {
    return `Eliminar ${resourceLabel.toLowerCase()}`;
  }
  
  if (action === 'import') {
    return `Importar ${resourceLabel.toLowerCase()}`;
  }
  
  if (action === 'export') {
    return `Exportar ${resourceLabel.toLowerCase()}`;
  }

  return `${actionLabel} ${resourceLabel.toLowerCase()}`;
}

/**
 * Agrupa permisos por recurso
 */
export function groupPermissions(permissions: string[]): GroupedPermission[] {
  const groups: Record<string, GroupedPermission> = {};

  permissions.forEach(permission => {
    const [resource] = permission.split('.');
    
    if (!groups[resource]) {
      // Mapeo de recursos a labels en español
      const resourceLabelMap: Record<string, string> = {
        'users': 'Usuarios',
        'roles': 'Roles',
        'clientes': 'Clientes',
        'tarifas': 'Tarifas',
        'predios': 'Predios',
        'cicloFacturacion': 'Ciclo de Facturación',
        'facturacion': 'Facturación',
        'caja': 'Caja',
        'pagos': 'Pagos',
        'reportes': 'Reportes',
        'log': 'Registro de Actividad',
        'settings': 'Configuración',
      };

      groups[resource] = {
        resource,
        resourceLabel: resourceLabelMap[resource] || resource,
        permissions: [],
      };
    }

    groups[resource].permissions.push({
      name: permission,
      label: transformPermissionName(permission),
    });
  });

  // Ordenar grupos por resourceLabel
  return Object.values(groups).sort((a, b) => 
    a.resourceLabel.localeCompare(b.resourceLabel)
  );
}

/**
 * Obtiene todos los permisos agrupados para mostrar en la UI
 */
export function getGroupedPermissions(permissions: string[]) {
  return groupPermissions(permissions);
}

/**
 * Obtiene el total de permisos seleccionados de un array de permisos agrupados
 */
export function getSelectedCountFromGrouped(
  groupedPermissions: GroupedPermission[],
  selectedPermissions: string[]
): number {
  let count = 0;
  groupedPermissions.forEach(group => {
    group.permissions.forEach(perm => {
      if (selectedPermissions.includes(perm.name)) {
        count++;
      }
    });
  });
  return count;
}
