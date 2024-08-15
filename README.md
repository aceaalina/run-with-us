### run-with-us
Magazin ONLINE
- Acest proiect constă în dezvoltarea unui magazin cu articole sportive care include patru pagini HTML cu elemente de JavaScript și CSS (în fișiere separate). Funcționalitățile necesare sunt implementate folosind tehnica AJAX și răspunsurile primite de la server sunt mapate pe clase JavaScript.

Pagini
### 1. index.html - Lista Produse
Descriere:
- Pagina afișează lista de produse primite de la server în format JSON.
Funcționalități:
Cererea către server se face folosind tehnica AJAX.
Afișarea produselor într-o listă.
Exemplu:
Vezi exemplul animat în GIF-ul tema_talcioc_index.
### 2. details.html - Detalii Produs
Descriere:
- Pagina primește ID-ul produsului ca query parameter (ex: details.html?id=0, unde 0 este ID-ul produsului).
Funcționalități:
Afișarea imaginii produsului, numelui, descrierii, prețului și numărului de produse din stoc.
Buton "Adaugă în coș": Afișează un mesaj în partea de sus a ecranului care informează utilizatorul că produsul a fost adăugat în coșul de cumpărături.
Produsele adăugate în coș sunt stocate în localStorage.
Exemplu:
Vezi exemplul animat în GIF-ul tema_talcioc_details.
### 3. cart.html - Coș de Cumpărături
Descriere:
- Pagina citește toate elementele salvate în localStorage și le afișează sub forma unui tabel.
Funcționalități:
Posibilitatea de a modifica cantitatea unui produs adăugat în coș (increase/decrease).
Funcție de "Remove" pentru a renunța la un produs din coș.
Fiecare produs din lista de cumpărături conține un link către pagina de detalii a produsului.
Recalcularea automată a totalului și subtotalurilor de fiecare dată când conținutul tabelului se modifică.
Exemplu:
Vezi exemplul animat în GIF-ul tema_talcioc_cart.
### 4. admin.html - Administrare Produse
Descriere:
- Pagina de administrare permite gestionarea produselor afișate în index.html și details.html.
Funcționalități:
Interfață grafică ce comunică cu serverul prin cereri AJAX folosind metodele HTTP GET, POST, PUT, DELETE.
Tabelul de produse include un link pe coloana de nume, care deschide un formular de adăugare/editare a produselor.
Fiecare produs conține următoarele informații: imagine, nume, descriere, preț, cantitate în stoc.
Produsele pot fi șterse de pe server folosind un buton "Remove".