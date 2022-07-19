
db.createCollection( 'paseos', {validator: {$jsonSchema: {bsonType: 'object',description:'Almacena las estadisticas de los paseos creados',title:'paseos',required: [         'idCreador',          'fechaCreacion',          'fechaPaseo',          'nombrePaseo',          'paisPaseo',          'paisCreador',          'cantidadIntegrantes',          'cantidadRestaurantes',          'cantidadAtraccionesTuristicas'],properties: {idCreador: {bsonType: 'objectId'},fechaCreacion: {bsonType: 'date'},fechaPaseo: {bsonType: 'date'},nombrePaseo: {bsonType: 'string'},paisPaseo: {bsonType: 'string'},paisCreador: {bsonType: 'string'},cantidadIntegrantes: {bsonType: 'int'},cantidadRestaurantes: {bsonType: 'int'},cantidadAtraccionesTuristicas: {bsonType: 'int'}}         }      }});  