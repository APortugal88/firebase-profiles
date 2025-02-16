const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("./src/admin");
const profilesApp = require("./src/profiles");
const imagesApp = require("./src/images");
// Crear una aplicación Express principal
const mainApp = express();
// Configurar CORS a nivel de aplicación principal
mainApp.use(cors({ origin: true }));
// Montar las sub-aplicaciones en rutas específicas
mainApp.use("/profiles", profilesApp);
mainApp.use("/images", imagesApp);
// Exportar la función HTTP principal
exports.api = functions.https.onRequest(mainApp);
