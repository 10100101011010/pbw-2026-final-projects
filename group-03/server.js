import express from "express";
import path from "path";
//Menggunakan library mysql2 sebagai penghubung antara Express dan MySQL.
import mysql from "mysql2/promise";
import { createServer as createViteServer } from "vite";

//anna2
async function startServer() {
  const app = express();
  const PORT = 3000;

  //Membuat koneksi ke database MySQL.
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "findly_db"
});

console.log("✅ Berhasil terhubung ke MySQL");

  // Agar server dapat menerima data JSON dari React.
  app.use(express.json());

  let items = [
    {
      id: "1",
      title: "iPhone 14 Pro — Space Black",
      description: "Ketinggalan di bangku taman depan perpus.",
      location: "Central Park, New York",
      status: "lost",
      date: "2026-07-02T00:00:00.000Z",
      contact: "081234567890",
      image: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "2",
      title: "Buku Catatan Hitam",
      description: "Ditemukan di meja kelas A2.",
      location: "Gedung A, Ruang A2.1",
      status: "found",
      date: "2026-07-01T00:00:00.000Z",
      contact: "089876543210",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600"
    }
  ];

  // GET: Mengambil semua data barang
  //Endpoint GET digunakan untuk mengambil seluruh data barang dari database.
  app.get("/api/items", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM items ORDER BY date DESC");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil data." });
    }
});

  // POST: Menambahkan data ke MySQL
  // Endpoint POST digunakan untuk menambah data barang.
app.post("/api/items", async (req, res) => {

console.log("================================");
console.log("POST /api/items DIPANGGIL");
console.log("BODY:", req.body);
console.log("================================");

  try {
    const {
      title,
      description,
      location,
      status,
      contact,
      image
    } = req.body;

    const date = new Date();

    const [result] = await db.query(
      `INSERT INTO items
      (title, description, location, status, date, contact, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        location,
        status,
        date,
        contact,
        image
      ]
    );

    console.log("INSERT BERHASIL");
    console.log(result);

    const [rows] = await db.query(
      "SELECT * FROM items WHERE id = ?",
      [result.insertId]
    );

    res.json(rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Gagal menambah data"
    });

  }
});

  // PUT: Update data barang
app.put("/api/items/:id", async (req, res) => {
  try {

    const { id } = req.params;

    // Jika request hanya mengubah status
    if (req.body.status && Object.keys(req.body).length === 1) {

      await db.query(
        "UPDATE items SET status = ? WHERE id = ?",
        [req.body.status, id]
      );

    } else {

      const {
        title,
        description,
        location,
        status,
        contact,
        image
      } = req.body;

      await db.query(
        `UPDATE items
         SET title = ?,
             description = ?,
             location = ?,
             status = ?,
             contact = ?,
             image = ?
         WHERE id = ?`,
        [
          title,
          description,
          location,
          status,
          contact,
          image,
          id
        ]
      );
    }

    const [rows] = await db.query(
      "SELECT * FROM items WHERE id = ?",
      [id]
    );

    res.json(rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Gagal update data"
    });

  }
});

  // DELETE: Hapus data dari MySQL
app.delete("/api/items/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM items WHERE id = ?",
      [id]
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Gagal menghapus data"
    });

  }
});

  // Vite middleware buat development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

startServer();
