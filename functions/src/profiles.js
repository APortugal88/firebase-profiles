const express = require("express");
const admin = require("./admin");
const { FieldValue } = require("firebase-admin/firestore");
const router = express.Router();
const db = admin.firestore();
// Función de registro de perfil
router.post("/create", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        error: "Nombre y email son requeridos",
      });
    }
    const profileRef = db.collection("profiles").doc();
    await profileRef.set({
      name,
      email,
      createdAt: FieldValue.serverTimestamp(),
      imageUrl: null,
    });
    res.status(200).json({
      id: profileRef.id,
      message: "Perfil creado exitosamente",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;
    const profileDoc = await db.collection("profiles").doc(profileId).get();
    if (!profileDoc.exists) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }
    res.status(200).json(profileDoc.data());
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
module.exports = router;
