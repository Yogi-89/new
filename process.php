<?php
    // Cek apakah ada data yang dikirimkan melalui metode POST
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Cek apakah data "nama" telah diisi oleh pengguna
        if (isset($_POST["nama"]) && !empty($_POST["nama"])) {
            $nama = $_POST["nama"];
            echo "<h2>Halo, " . $nama . "!</h2>";
        } else {
            echo "<h2>Maaf, Anda harus mengisi nama Anda!</h2>";
        }
    } else {
        echo "<h2>Halaman ini tidak dapat diakses langsung.</h2>";
    }
