CREATE TABLE TipoDocumentoVehiculo (
    idTipoDocumento INT AUTO_INCREMENT PRIMARY KEY,
    idEmpresaExterna INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (idEmpresaExterna) REFERENCES EmpresaExterna(idEmpresaExterna)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE EmpresaExterna (
    idEmpresaExterna INT AUTO_INCREMENT PRIMARY KEY,
    NombreEncargado VARCHAR(100) NOT NULL,
    Celular VARCHAR(15),
    Direccion VARCHAR(150),
    Correo VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE TipoMantenimiento (
    idTipoMantenimiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Persona (
    idPersona INT AUTO_INCREMENT PRIMARY KEY,
    nombreCompleto VARCHAR(100) NOT NULL,
    apellidoCompleto VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    cedula VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    correo VARCHAR(100),
    fechaNacimiento DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Rol (
    idRol INT AUTO_INCREMENT PRIMARY KEY,
    nombre ENUM('Asociado','Empleado','Conductor') NOT NULL,
    TipoRol ENUM('Interno','Externo') DEFAULT 'Interno'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE RolPersona (
    idRolPersona INT AUTO_INCREMENT PRIMARY KEY,
    idPersona INT NOT NULL,
    idRol INT NOT NULL,
    FOREIGN KEY (idPersona) REFERENCES Persona(idPersona)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idRol) REFERENCES Rol(idRol)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Vehiculo (
    idVehiculo INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    idPersona INT,
    motor VARCHAR(50),
    chasis VARCHAR(50),
    modelo VARCHAR(50),
    marca VARCHAR(50),
    linea VARCHAR(50),
    combustible VARCHAR(30),
    cilindraje VARCHAR(20),
    movil VARCHAR(10),
    FOREIGN KEY (idPersona) REFERENCES Persona(idPersona)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE DocumentoVehiculo (
    idDocumento INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL,
    idTipoDocumento INT NOT NULL,
    fechaEmision DATE,
    fechaVencimiento DATE,
    estadoDocVehiculo ENUM('Vigente','Vencido','Pendiente') DEFAULT 'Vigente',
    FOREIGN KEY (idTipoDocumento) REFERENCES TipoDocumentoVehiculo(idTipoDocumento)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (placa) REFERENCES Vehiculo(placa)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ConductorVehiculo (
    idConductorVehiculo INT AUTO_INCREMENT PRIMARY KEY,
    idPersona INT NOT NULL,
    idVehiculo INT NOT NULL,
    jornada VARCHAR(30),
    EstadoConductor ENUM('Activo','Inactivo') DEFAULT 'Activo',
    fechaInicio DATE NOT NULL,
    fechaFin DATE,
    FOREIGN KEY (idPersona) REFERENCES Persona(idPersona)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idVehiculo) REFERENCES Vehiculo(idVehiculo)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Mantenimiento (
    idMantenimiento INT AUTO_INCREMENT PRIMARY KEY,
    idVehiculo INT NOT NULL,
    idTipoMantenimiento INT NOT NULL,
    idEmpresaExterna INT NOT NULL,
    observaciones VARCHAR(250),
    fechaMantenimiento DATE,
    FOREIGN KEY (idVehiculo) REFERENCES Vehiculo(idVehiculo)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idTipoMantenimiento) REFERENCES TipoMantenimiento(idTipoMantenimiento)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idEmpresaExterna) REFERENCES EmpresaExterna(idEmpresaExterna)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- Roles
INSERT INTO Rol (nombre, TipoRol) VALUES
('Asociado','Interno'),
('Empleado','Interno'),
('Conductor','Interno');

-- Personas
INSERT INTO Persona (nombreCompleto, apellidoCompleto, direccion, cedula, telefono, correo, fechaNacimiento) VALUES
('Carlos','Gómez','Cra 10 #23-45','1001','3001234567','carlos@transandino.com','1985-05-12'),
('Laura','Martínez','Av 15 #22-30','1002','3109876543','laura@transandino.com','1990-07-21'),
('Jorge','Pérez','Cll 50 #10-20','1003','3205557890','jorge@transandino.com','1988-03-10'),
('Ana','Rodríguez','Calle 5 #10-12','1004','3009876543','ana@transandino.com','1992-11-05');

-- Asignar roles a personas
INSERT INTO RolPersona (idPersona, idRol) VALUES
(1, 1), -- Carlos Asociado
(2, 2), -- Laura Empleado
(3, 3), -- Jorge Conductor
(4, 3); -- Ana Conductor

-- Vehículos
INSERT INTO Vehiculo (placa, idPersona, motor, chasis, modelo, marca, linea, combustible, cilindraje, movil) VALUES
('ABC123', 1, 'MTR001', 'CHS001', '2022', 'Toyota', 'Corolla', 'Gasolina', '1800', 'M001'),
('XYZ789', 2, 'MTR002', 'CHS002', '2021', 'Mazda', 'CX5', 'Diesel', '2200', 'M002'),
('LMN456', 3, 'MTR003', 'CHS003', '2023', 'Honda', 'Civic', 'Gasolina', '1600', 'M003');

-- Empresas externas adicionales
INSERT INTO EmpresaExterna (NombreEncargado, Celular, Direccion, Correo) VALUES
('Taller Los Rápidos', '3201112233', 'Calle 30 #20-10', 'rapidos@empresa.com'),
('AutoFix', '3104445566', 'Carrera 15 #45-32', 'autofix@empresa.com'),
('Mecánica Rápida', '3112233445', 'Cra 20 #35-18', 'mecanica@empresa.com'),
('Servicios Automotrices Express', '3123344556', 'Av 10 #25-14', 'express@empresa.com'),
('Taller El Motor', '3134455667', 'Calle 40 #12-10', 'elmotor@empresa.com');

-- Tipos de documentos asociados a las nuevas empresas externas
INSERT INTO TipoDocumentoVehiculo (idEmpresaExterna, nombre) VALUES
(3, 'SOAT'),
(3, 'Revisión Técnico-Mecánica'),
(4, 'Tarjeta de Propiedad'),
(4, 'Certificado de Emisiones'),
(5, 'SOAT'),
(5, 'Revisión Técnico-Mecánica');


-- Documentos de vehículos
INSERT INTO DocumentoVehiculo (placa, idTipoDocumento, fechaEmision, fechaVencimX   iento, estadoDocVehiculo) VALUES
('ABC123', 1, '2024-01-01', '2025-01-01', 'Vigente'),
('ABC123', 2, '2024-02-01', '2025-02-01', 'Vigente'),
('XYZ789', 3, '2024-01-15', '2025-01-15', 'Pendiente'),
('LMN456', 4, '2025-03-01', '2026-03-01', 'Vigente');

-- Conductores y asignaciones
INSERT INTO ConductorVehiculo (idPersona, idVehiculo, jornada, EstadoConductor, fechaInicio, fechaFin) VALUES
(3, 1, 'Diurna', 'Activo', '2024-03-01', NULL),
(4, 3, 'Nocturna', 'Activo', '2025-05-01', NULL);

-- Tipos de mantenimiento
INSERT INTO TipoMantenimiento (nombre) VALUES
('Cambio de aceite'),
('Alineación y balanceo'),
('Revisión frenos'),
('Cambio de batería');

-- Mantenimientos
INSERT INTO Mantenimiento (idVehiculo, idTipoMantenimiento, idEmpresaExterna, observaciones, fechaMantenimiento) VALUES
(1, 1, 1, 'Cambio de aceite sintético', '2025-03-10'),
(2, 2, 2, 'Revisión de suspensión', '2025-04-15'),
(3, 3, 1, 'Revisión de frenos delanteros', '2025-06-05'),
(1, 4, 2, 'Cambio de batería', '2025-07-20');


-- ===============================================
-- CONSULTAS DE VALIDACIÓN
-- ===============================================

-- 1️⃣ Mostrar todas las personas con su rol
SELECT P.nombreCompleto, P.apellidoCompleto, R.nombre AS Rol
FROM Persona P
JOIN RolPersona RP ON P.idPersona = RP.idPersona
JOIN Rol R ON RP.idRol = R.idRol;

-- 2️⃣ Mostrar los vehículos con su propietario (persona)
SELECT V.placa, V.marca, V.modelo, P.nombreCompleto AS Propietario
FROM Vehiculo V
LEFT JOIN Persona P ON V.idPersona = P.idPersona;

-- 3️⃣ Mostrar los documentos de cada vehículo y su estado
SELECT V.placa, TD.nombre AS TipoDocumento, DV.estadoDocVehiculo, DV.fechaVencimiento
FROM DocumentoVehiculo DV
JOIN Vehiculo V ON DV.placa = V.placa
JOIN TipoDocumentoVehiculo TD ON DV.idTipoDocumento = TD.idTipoDocumento;

-- 4️⃣ Mostrar mantenimientos realizados, con empresa y tipo de servicio
SELECT V.placa, TM.nombre AS TipoMantenimiento, EE.NombreEncargado AS Empresa,
       M.fechaMantenimiento, M.observaciones
FROM Mantenimiento M
JOIN Vehiculo V ON M.idVehiculo = V.idVehiculo
JOIN TipoMantenimiento TM ON M.idTipoMantenimiento = TM.idTipoMantenimiento
JOIN EmpresaExterna EE ON M.idEmpresaExterna = EE.idEmpresaExterna;

-- 5️⃣ Mostrar conductores activos y el vehículo que conducen
SELECT P.nombreCompleto AS Conductor, V.placa, CV.jornada, CV.EstadoConductor
FROM ConductorVehiculo CV
JOIN Persona P ON CV.idPersona = P.idPersona
JOIN Vehiculo V ON CV.idVehiculo = V.idVehiculo
WHERE CV.EstadoConductor = 'Activo';